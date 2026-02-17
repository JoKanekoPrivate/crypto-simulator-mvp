# crypto-simulator-mvp

# 構成
- フロントサイド：React, JavaScript
- サーバー：Express
- データベース：Postgres / Knex
- デプロイ：Render
- テスト：vitest, react-testing-library　（仮）
- 外部API：CoinGecko（https://docs.coingecko.com/）　（仮）
- グラフ: Recharts（https://recharts.github.io/）　（仮）
- UIライブラリ：Mantine　（仮）

# 開発手法
1. 要件を確定する✅
2. DB構成（ER図）を確定する✅
3. BE: ロジックを確定する✅
4. DB: DBを作成する
  - Migrationファイルの作成✅
  - Seedファイルの作成✅
5. FE-BE: Server-Client通信を確認する
6. BE: CoinGeckoの通信を確認する（一旦）
7. FE: 画面イメージを確定する（一旦）
8. FE: 画面を作成する（一旦）

> （一旦）は繰り返す

# 要件
## 何をするアプリか？
1. 現在の持ち日本円、持ちBTCが出来る（Portfolio）
2. Buy（JPY → Crypto） or Sell（Crypto → JPY）が出来る（Deal）
3. 現在の損益（Position）が表示出来る

## 整理
1. 現在の持ち日本円、持ちBTCが出来る（Portfolio）
  ### FE
  - DBから情報を表示
  ### BE
  - DBの取引履歴（GET）
  - APIの現在価格（GET）

2. Buy（JPY → Crypto） or Sell（Crypto → JPY） が出来る（Deal）
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

## DB_NAME: crypto_simulator_mvp
1. Schema(transactons)
- id（Unique and Serial）（Primary）
- coin_id（btc or eth（今回はethは使用しない）（CoinGeckoの記載に揃える））
- side（buy or sell）
- qty（）
- price（取引時の価格（CoinGeckoの記載に揃える））
- treated_at（取引時のタイムスタンプ（CoinGeckoの記載に揃える））

2. Schema(users)
- id（Unique and Serial）（Primary）（自分だけ登録）
- initial_jpy_balance（初期値として1000000をseed）

# BEロジック
## 残高計算ロジック
1. 現在の日本円残高 = 初期残高 - Σ（Buy取引額） + Σ（Sell取引額）
2. 現在のBTC保有量 = Σ（Buy数量） - Σ（Sell数量）

## 損益計算ロジック
1. 平均取得単価 = Σ（Buy取引額） / Σ（Buy数量）
2. 評価額 = 現在のBTC保有量 * 現在価格
3. 損益 = 評価額 - （平均取得単価 * 現在のBTC保有量）

## バリデーション
- Buy: 日本円残高 >= 購入金額
- Sell: BTC保有量 >= 売却数量