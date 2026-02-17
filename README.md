# crypto-simulator-mvp

# 構成
- フロントサイド：React, JavaScript
- サーバー：Express
- データベース：Postgres / Knex
- デプロイ：Render
- テスト：vitest, react-testing-library　（仮）
- 外部API：CoinGecko(https://docs.coingecko.com/)　（仮）
- グラフ: Recharts(https://recharts.github.io/)　（仮）

# 開発手法
1. 要件を確定させる
2. DB構成（ER図）を確定させる
3. BEロジックを確定させる
4. BE: CoinGeckoの通信を確認する
5. 


# 要件
## 何をするアプリか？
1. 現在の持ち日本円、持ちBTCが出来る（Portfolio）
2. Buy（Yen → Crypto） or Sell（Crypto → Yen） が出来る（Deal）
3. 現在の損益（Position）が表示出来る

## 整理
1. 現在の持ち日本円、持ちBTCが出来る（Portfolio）
  ### FE
  - DBから情報を表示
  ### BE
  - DBの取引履歴（GET）
  - APIの現在価格（GET）

2. Buy（Yen → Crypto） or Sell（Crypto → Yen） が出来る（Deal）
  ### FE
  - BTC or ETHを指定（ETHは今回はドロップダウンのみ）
  - <input>でnumberを入力
  - <button>Buy</button> or <button>Sell</button>を指定
  - <Process>Nice Deal</Process>を表示
  ### BE
  - 

3. 現在の損益（Position）が表示出来る
  ### FE
  - 最初は非表示
  - <button>Visible</button>で表示
  ### BE
  - DBの取引履歴（GET）
  - APIの現在価格（GET）
  - 

# DB構成
外部サービスの使用回数や使用量は抑えるのが基本！！

1. trades
- id（Unique and Serial）（Primary）
- coin_id（btc or eth（今回はethは使用しない）（CoinGeckoの記載に揃える））
- side（buy or sell）
- qty（）
- price（取引時の価格（CoinGeckoの記載に揃える））
- treated_at（取引時のタイムスタンプ（CoinGeckoの記載に揃える））

2. users
- id（Unique and Serial）（Primary）
- jpy_balance（初期値として1000000をseed）
- created_at（取引時のタイムスタンプ（CoinGeckoの記載に揃える））