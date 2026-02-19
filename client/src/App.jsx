import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. 状態管理
  // Portfolio関連
  const [portfolio, setPortfolio] = useState(null);
  
  // Deal関連
  const [inputAmount, setInputAmount] = useState('');
  const [isDealed, setIsDealed] = useState(false);
  const [dealedMessage, setDealedMessage] = useState('');
  
  // Position関連
  const [isPositionVisible, setIsPositionVisible] = useState(false);
  
  // 2. イベントハンドラー
  const handleInputChange = (event) => {
    setInputAmount(event.target.value);
  };

  const handleBuy = async () => {
    try {
      // リクエスト送信
      const res = await fetch('/api/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            // 今は固定でbitcoin
            coin_id: 'bitcoin', 
            side: 'buy',
            // event.target.valueはstring型のためnumberに変換
            qty: parseFloat(inputAmount),
          }
        ),
      });

      // レスポンス処理
      const data = await res.json();
      setIsDealed(true);
      setDealedMessage(data.message);
      
      // ポートフォリオ更新
      const portfolioRes = await fetch('/api/portfolio');
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData);

    } catch (error) {
      setIsDealed(true);
      setDealedMessage('Failed to execute deal');
      console.error('Error:', error);
    }
  };

  const handleSell = async () => {
    try {
      // リクエスト送信
      const res = await fetch('/api/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            coin_id: 'bitcoin', 
            side: 'sell',
            qty: parseFloat(inputAmount),
          }
        ),
      });

      // レスポンス処理
      const data = await res.json();
      setIsDealed(true);
      setDealedMessage(data.message);
      // ポートフォリオ更新
      const portfolioRes = await fetch('/api/portfolio');
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData);
      
    } catch (error) {
      setIsDealed(true);
      setDealedMessage('Failed to execute deal');
      console.error('Error:', error);
    }
  };

  // 3. 副作用処理
  useEffect(() => {
      const fetchPortfolio = async () => {
        try {
          const res = await fetch('/api/portfolio');
          const data = await res.json();
          // // デバッグ
          // console.log('Fetched portfolio:', data);
          setPortfolio(data);
        } catch (error) {
          console.error('Error fetching portfolio:', error);
        }
      };
      fetchPortfolio();
  }, [])

  useEffect(() => {
    if (isDealed) {
      const timer = setTimeout(() => {
        setIsDealed(false);
        setDealedMessage('');
      }, 3000);
      // タイムアウトのクリーンアップ
      return () => clearTimeout(timer);
    }
  }, [isDealed]);

  // /api/testエンドポイントからデータを取得
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // ハードコーディング回避のため、相対パスのAPIエンドポイントに修正
  //       // vite.config.jsでproxy設定し、相対パスでAPIエンドポイントを呼び出す
  //       const res = await fetch('/api/test');
  //       const data = await res.json();
  //       setMessage(data.message);
  //     } catch (error) {
  //       setMessage('Failed');
  //       console.error('Error:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // // /api/price/:coin_idエンドポイントからビットコインの価格を取得
  // useEffect(() => {
  //   const fetchPrice = async () => {
  //     try {
  //       const res = await fetch('/api/price/bitcoin');
  //       const data = await res.json();
  //       console.log('data:', data);
  //       console.log('data.bitcoin:', data.bitcoin);
  //       console.log('data.bitcoin.jpy:', data.bitcoin.jpy);
  //       setData(data);
  //     } catch (error) {
  //       console.error('Error /api/price/:coin_id:', error);
  //     }
  //   };
  //   fetchPrice();
  // }, []);

  // 4. 返り値構築
  return (
    <>
      <h1>Crypto Simulator</h1>
      <div>
        <h2>Portfolio</h2>
        {portfolio ? (
          <div>
            <p>JPY Balance: ¥ {portfolio.jpyBalance}</p>
            <p>BTC Balance: BTC {portfolio.btcBalance}</p>
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}
      </div>

      <div>
        <h2>Deal</h2>
        <input 
          type="number" 
          value={inputAmount} 
          onChange={handleInputChange} 
          placeholder="Enter amount">
        </input>
        <div>
          <button onClick={handleBuy}>Buy</button>
          <button onClick={handleSell}>Sell</button>
        </div>
        {isDealed && (
          <div>{dealedMessage}</div>
        )}
      </div>

      <div>
        <h2>Position</h2>
        <button onClick={() => setIsPositionVisible(!isPositionVisible)}>Show Position</button>
        {isPositionVisible && (
          <div>
            <p>Average Cost: 0 JPY</p>
            <p>Unrealized P/L: 0 JPY</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App
