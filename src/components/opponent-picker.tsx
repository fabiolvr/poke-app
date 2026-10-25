import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrutalBox } from '@/components/brutal-box';
import { BrutalScreen } from '@/components/brutal-screen';
import { ScreenMessage } from '@/components/screen-message';
import { SearchBar } from '@/components/search-bar';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { useGetAllPokemonQuery } from '@/features/pokemon/pokemon-api';
import { capitalize, formatDexNumber, matchesQuery } from '@/features/pokemon/pokemon-utils';
import type { PokemonSummary } from '@/features/pokemon/types';

type Props = {
  exclude: string;
  onPick: (name: string) => void;
};

export function OpponentPicker({ exclude, onPick }: Props) {
  const theme = useBrutalTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, refetch } = useGetAllPokemonQuery();

  const results = useMemo(
    () =>
      (data ?? []).filter((pokemon) => pokemon.name !== exclude && matchesQuery(pokemon, query)),
    [data, exclude, query],
  );

  const renderItem = useCallback(
    ({ item }: { item: PokemonSummary }) => (
      <OpponentRow pokemon={item} onPress={() => onPick(item.name)} />
    ),
    [onPick],
  );

  const renderList = () => {
    if (isLoading) {
      return <ScreenMessage inline text="Carregando a lista…" />;
    }
    if (isError) {
      return (
        <ScreenMessage
          inline
          tone="error"
          text="Não foi possível carregar a lista."
          actionLabel="Tentar de novo"
          onAction={refetch}
        />
      );
    }
    return (
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(pokemon) => pokemon.name}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: Brutal.gap + insets.bottom }]}
      />
    );
  };

  return (
    <BrutalScreen>
      <View style={styles.controls}>
        <Text style={[styles.title, { color: theme.text }]}>
          {`QUEM ENFRENTA ${exclude.toUpperCase()}?`}
        </Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar adversário" />
      </View>
      {renderList()}
    </BrutalScreen>
  );
}

type RowProps = {
  pokemon: PokemonSummary;
  onPress: () => void;
};

function OpponentRow({ pokemon, onPress }: RowProps) {
  const theme = useBrutalTheme();
  const name = capitalize(pokemon.name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, número ${pokemon.id}`}
      onPress={onPress}>
      {({ pressed }) => (
        <BrutalBox pressed={pressed} style={styles.row}>
          <Image source={pokemon.imageUrl} style={styles.image} contentFit="contain" />
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {name.toUpperCase()}
          </Text>
          <Text style={[styles.number, { color: theme.muted }]}>{formatDexNumber(pokemon.id)}</Text>
        </BrutalBox>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controls: { padding: Brutal.gap, gap: 12 },
  title: { fontFamily: Brutal.font.display, fontSize: 18 },
  list: { paddingHorizontal: Brutal.gap, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8 },
  image: { width: 48, height: 48 },
  name: { flex: 1, fontFamily: Brutal.font.display, fontSize: 15 },
  number: { fontFamily: Brutal.font.bold, fontSize: 14 },
});
