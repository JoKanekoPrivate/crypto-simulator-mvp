import { useState, useEffect } from 'react'
import './App.css'
import { Button, NumberInput, Text, Paper, Stack } from '@mantine/core';

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
  const [position, setPosition] = useState(null);
  
  // 2. イベントハンドラー
  // mantineのNuberInputはonChangeに直接値を渡す
  // const handleInputChange = (event) => {
  //   setInputAmount(event.target.value);
  // };

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

  const handleShowPosition = async () => {
    try {
      const res = await fetch('/api/position');
      const data = await res.json();
      // // デバッグ
      // console.log('Fetched position:', data);
      setPosition(data);
      setIsPositionVisible(!isPositionVisible);
    } catch (error) {
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
      <Paper shadow="sm" padding="md" withBorder>
        <h2>Portfolio</h2>
        {portfolio ? (
          <Stack>
            <Text>JPY Balance: ¥ {portfolio.jpyBalance}</Text>
            <Text>BTC Balance: BTC {portfolio.btcBalance}</Text>
          </Stack>
        ) : (
          <Text>Loading portfolio...</Text>
        )}
      </Paper>

      <Paper shadow="sm" padding="md" withBorder>
        <h2>Deal</h2>
        <NumberInput 
          type="number" 
          onChange={setInputAmount} 
          placeholder="Enter amount">
        </NumberInput>
        <Stack>
          <Button onClick={handleBuy}>Buy</Button>
          <Button onClick={handleSell}>Sell</Button>
        </Stack>
        {isDealed && (
          <div>{dealedMessage}</div>
        )}
      </Paper>

      <Paper shadow="sm" padding="md" withBorder>
        <h2>Position</h2>
        <Button onClick={handleShowPosition}>Show Position</Button>
        {isPositionVisible && (
          <Stack>
            <Text>Average Cost: ¥ {position.averageCost}</Text>
            <Text>Current Value: ¥ {position.currentPrice}</Text>
            <Text>Profit/Loss: ¥ {position.profitLoss}</Text>
          </Stack>
        )}
      </Paper>
    </>
  );
};
export default App
