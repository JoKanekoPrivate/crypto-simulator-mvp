import { useState, useEffect } from 'react'
import { Button, NumberInput, Text, Paper, Stack, Title, Group, Container } from '@mantine/core';

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
      console.error('Error details:', error);
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
    <Container size="md" my="md">
      <Title c='primary' ta="center" mb="md">Crypto Simulator</Title>

      <Stack gap="sm" >
      <Paper shadow="sm" padding="md" withBorder>
        <Title order={2} c="primary" ta="center" mb="md">Portfolio</Title>
        <Paper shadow="xs" padding="sm" withBorder>
        {portfolio ? (
          <Stack>
            <Text ta="center">JPY Balance: ¥ {portfolio.jpyBalance}</Text>
            <Text ta="center">BTC Balance: BTC {portfolio.btcBalance}</Text>
          </Stack>
        ) : (
          <Text ta="center">Loading portfolio...</Text>
        )}
        </Paper>
      </Paper>

      <Paper shadow="sm" padding="md" withBorder>
        <Title order={2} c="primary" ta="center" mb="md">Deal</Title>
        <NumberInput 
          type="number" 
          onChange={setInputAmount} 
          placeholder="Enter amount"
          maw={300}
          mx="auto">
        </NumberInput>
        <Group mt="md" justify="center">
          <Button onClick={handleBuy}>Buy</Button>
          <Button onClick={handleSell}>Sell</Button>
        </Group>
        {isDealed && (
          <Text ta="center">{dealedMessage}</Text>
        )}
      </Paper>

      <Paper shadow="sm" padding="md" withBorder>
        <Title order={2} c="primary" ta="center" mb="md">Position</Title>
        <Group mt="md" justify="center">
          <Button onClick={handleShowPosition}>Show Position</Button>
        </Group>
        <Paper shadow="xs" padding="sm" withBorder>
        {isPositionVisible && (
          <Stack>
            <Text ta="center">Average Cost: ¥ {position.averageCost}</Text>
            <Text ta="center">Current Value: ¥ {position.currentPrice}</Text>
            <Text ta="center">Profit/Loss: ¥ {position.profitLoss}</Text>
          </Stack>
        )}
        </Paper>
      </Paper>
      </Stack>
    </Container>
  );
};
export default App
