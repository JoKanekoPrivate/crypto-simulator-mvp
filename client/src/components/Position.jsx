import { useState } from "react";
import { Text, Paper, Stack, Title, Group, Button } from "@mantine/core";


export function Position() {
  // 1. 状態管理
  const [isPositionVisible, setIsPositionVisible] = useState(false);
  const [position, setPosition] = useState(null);

  // 2. イベントハンドラー
  const handleShowPosition = async () => {
    try {
      const res = await fetch("/api/position");
      const data = await res.json();
      setPosition(data);
      setIsPositionVisible(!isPositionVisible);
    } catch (error) {
      console.error("Error", error);
    }
  };

  // 4. 返り値構築
  return (
    <Paper shadow="sm" padding="md" withBorder>
      <Title order={2} c="primary" ta="center" mb="md">
        Position
      </Title>
      <Group mt="md" justify="center">
        <Button onClick={handleShowPosition}>Show Position</Button>
      </Group>
      <Paper shadow="xs" padding="sm" withBorder>
        {isPositionVisible && (
          <Stack>
            {/* <Text ta="center">Average Cost: ¥ {position.averageCost}</Text> */}
            <Text ta="center">Current Value: ¥ {position.currentValue}</Text>
            <Text ta="center">Profit/Loss: ¥ {position.profitLoss}</Text>
          </Stack>
        )}
      </Paper>
    </Paper>
  );
}