# セットアップ手順
git clone後から開始します

## 1. サーバー側のセットアップ
### 1-1. 依存関係のインストール
```terminal
cd server
npm install
```

### 1-2. .envファイルの作成
```terminal
cp .env.example .env
```
適宜、環境変数の設定

## 1-3. DBのマイグレーションとシード
```terminal
cd server
npm run db:migrate
nppm run db:seed
```

## 1-4. サバー起動
```terminal
npm run dev
```

## 2. クライアント側のセットアップ
### 2-1. 依存関係のインストール
```terminal
cd client
npm install
```
## 1-4. クライアント起動
```terminal
npm run dev
```
