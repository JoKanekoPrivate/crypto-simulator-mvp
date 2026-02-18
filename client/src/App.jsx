import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. 状態管理
  const [message, setMessage] = useState('Loading...');
  
  // 2. 副作用処理
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ハードコーディング回避のため、相対パスのAPIエンドポイントに修正
        // vite.config.jsでproxy設定し、相対パスでAPIエンドポイントを呼び出す
        const res = await fetch('/api/test');
        const data = await res.json();
        setMessage(data.message);
      } catch (error) {
        setMessage('Failed');
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  // 3. 返り値構築
  return <div>{message}</div>;
}

export default App
