//（見直し）定型フォーマット？
// ローカル環境の環境変数を読み込むための設定
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Corsミドルウェアの設定
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN  
    : 'http://localhost:5173',
  credentials: true
}));

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'Hello Root' });
});
//（見直し）定型フォーマット？

// テスト用エンドポイント
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello Test' });
});

// CoinGecko API: 暗号通貨の現在価格（JPY）を取得
// パスパラメータでcoin_idを受信
app.get('/api/price/:coin_id', async (req, res) => {
  // 想定: 'bitcoin'
  const { coin_id } = req.params; 
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin_id}&vs_currencies=jpy`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500);
    res.json({ error: 'Failed to fetch price from CoinGecko' });
  }
});

// Portfolio: ユーザーの残高を取得（CoinGeckoAPIは不使用）
app.get('/api/portfolio', async (req, res) => {
  try {
    // 1. ユーザー情報を取得（初期残高）
    const user = await knex('users').where({ id: 1 }).first();
    // デバッグ
    console.log('User:', user);

    // 2. 取引履歴を取得
    const transactions = await knex('transactions').where({ user_id: 1 });
    // デバッグ
    console.log('Transactions:', transactions);

    // 3. 残高計算ロジック
    let jpyBalance = parseFloat(user.initial_jpy_balance);
    let btcBalance = 0;

    transactions.forEach(transaction => {
      const qty = parseFloat(transaction.qty);
      const price = parseFloat(transaction.price);
      
      if (transaction.side === 'buy') {
        jpyBalance -= qty * price; 
        btcBalance += qty;
      } else if (transaction.side === 'sell') {
        jpyBalance += qty * price; 
        btcBalance -= qty;
      }
    });

    // 4. レスポンス
    res.status(200);
    res.json({
      jpyBalance: jpyBalance,
      btcBalance: btcBalance,
    });

  } catch (error) {
    res.status(500);
    res.json({ error: 'Failed to fetch portfolio' });
  }
});

// Deal: 取引実行エンドポイント
app.post('/api/deal', async (req, res) => {
  // デバッグ
  console.log('Received deal request:', req.body);
  // 想定: { coin_id: 'bitcoin', side: 'buy', qty: 0.1 }
  const { coin_id, side, qty } = req.body; 
  
  try {
    // 1. CoinGecko APIで現在価格を取得
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin_id}&vs_currencies=jpy`
    );
    const data = await response.json();
    const price = data[coin_id].jpy;

    if (!price) {
      res.status(400);
      res.json({ error: 'Invalid coin_id or failed to fetch price' });
      return;
    }

    // 2. DBに取引レコードを挿入
    await knex('transactions').insert({
      user_id: 1,
      coin_id,
      side,
      qty,
      price,
      // treated_atは、DBのtimestampで自動設定する
    });

    // 3. レスポンス
    res.status(200);
    res.json({ message: 'Nice Deal!!' });

  } catch (error) {
    res.status(500);
    res.json({ error: 'Failed to execute deal' });
  }
});

// Position: ポジション情報を取得するエンドポイント
app.get('/api/position', async (req, res) => {
  try {
    // 1. 取引履歴を取得
    const transactions = await knex('transactions').where({ user_id: 1 });
    // デバッグ
    console.log('Transactions for Position:', transactions);

    // 2. 損益計算ロジック
    // total計算
    let totalQty = 0;
    let totalCost = 0;

    transactions.forEach(transaction => {
      const qty = parseFloat(transaction.qty);
      const price = parseFloat(transaction.price);
      
      if (transaction.side === 'buy') {
        totalQty += qty; 
        totalCost += qty * price;
      } else if (transaction.side === 'sell') {
        totalQty -= qty; 
        totalCost -= qty * price;
      }
    });

    // 平均取得単価計算
    let averageCost = 0;

    if (totalQty === 0) {
      averageCost = 0;
    } else {
      averageCost = totalCost / totalQty;
    }

    // 3. CoinGecko APIで現在価格を取得
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy`
    );
    const data = await response.json();
    const currentPrice = data.bitcoin.jpy;

    // 4. レスポンス
    res.status(200);
    res.json({
      averageCost: averageCost,
      currentPrice: currentPrice,
      profitLoss: (currentPrice - averageCost) * totalQty,
    });

  } catch (error) {
    res.status(500);
    res.json({ error: 'Failed to fetch position' });
  }
});

// （見直し）本番環境：
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

//（見直し）定型フォーマット？
// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//（見直し）定型フォーマット？
