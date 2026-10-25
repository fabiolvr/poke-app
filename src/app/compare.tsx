import { router, useLocalSearchParams } from 'expo-router';

import { OpponentPicker } from '@/components/opponent-picker';
import { StatComparison } from '@/components/stat-comparison';

// /compare?a=pikachu escolhe o adversário; /compare?a=pikachu&b=raichu mostra o duelo.
export default function CompareScreen() {
  const { a, b } = useLocalSearchParams<{ a: string; b?: string }>();

  if (!b) {
    return <OpponentPicker exclude={a} onPick={(name) => router.setParams({ b: name })} />;
  }

  return (
    <StatComparison first={a} second={b} onChangeOpponent={() => router.setParams({ b: '' })} />
  );
}
