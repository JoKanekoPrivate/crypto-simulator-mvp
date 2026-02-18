// （見直し）定型フォーマット？
// ローカル環境の環境変数を読み込むための設定
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// （見直し）定型フォーマット？

// Corsミドルウェアの設定
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

// ルートのエンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'Hello Root' });
});

// テスト用エンドポイント
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello Test' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
