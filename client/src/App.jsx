import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. 状態管理
  const [isPositionVisible, setIsPositionVisible] = useState(false);
  const [portfolio, setPortfolio] = useState(null);

  // 2. イベントハンドラー
  

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
        <input placeholder="Enter amount"/>
        <div>
          <button>Buy</button>
          <button>Sell</button>
        </div>
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
