import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. 状態管理
  const [isPositionVisible, setIsPositionVisible] = useState(false);
  // const [message, setMessage] = useState('Loading...');
  // const [data, setData] = useState(null);
  
  // 2. 副作用処理
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


  // 3. 返り値構築
  return (
    <>
      <h1>Crypto Simulator</h1>
      <div>
        <h2>Portfolio</h2>
        <div>
          <p>JPY Balance: 1,000,000</p>
          <p>BTC Balance: 0.00000000</p>
          <p>Total Value: 1,000,000 JPY</p>
        </div>
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
