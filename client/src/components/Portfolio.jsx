import { Text, Paper, Stack, Title } from "@mantine/core";

export function Portfolio({ portfolio }) {
  return (
    <Paper shadow="sm" padding="md" withBorder>
      <Title order={2} c="primary" ta="center" mb="md">
        Portfolio
      </Title>
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
  );
}
