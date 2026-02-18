//（見直し）定型フォーマット？
// ローカル環境の環境変数を読み込むための設定
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile').development);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Corsミドルウェアの設定
app.use(cors({
  origin: 'http://localhost:5173', 
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
app.get('/api/price/:coin_id', async (req, res) => {
  const { coin_id } = req.params; // 例: 'bitcoin'
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

    // 4. レスポンス返却
    res.json({
      jpyBalance: jpyBalance,
      btcBalance: btcBalance,
    });

  } catch (error) {
    res.status(500);
    res.json({ error: 'Failed to fetch portfolio', details: error.message });
  }
});

//（見直し）定型フォーマット？
// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//（見直し）定型フォーマット？
