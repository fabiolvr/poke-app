import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { BrutalButton } from '@/components/brutal-button';
import { BrutalScreen } from '@/components/brutal-screen';
import { PokemonGrid } from '@/components/pokemon-grid';
import { ScreenMessage } from '@/components/screen-message';
import { SearchBar } from '@/components/search-bar';
import { TypeBadge } from '@/components/type-badge';
import { TypeFilterSheet } from '@/components/type-filter-sheet';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { typeName } from '@/features/pokemon/translations';
import { usePokedexSource } from '@/features/pokemon/use-pokedex-source';

export default function PokedexScreen() {
  const theme = useBrutalTheme();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isFiltered, isLoading, isError, refetch, loadMore, isFetchingMore } =
    usePokedexSource(query, type);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleSelectType = (selected: string) => {
    setType(selected);
    setIsFilterOpen(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ScreenMessage inline text="Carregando a Pokédex…" />;
    }
    if (isError) {
      return (
        <ScreenMessage
          inline
          tone="error"
          text="Não foi possível carregar a Pokédex. Confira sua conexão."
          actionLabel="Tentar de novo"
          onAction={refetch}
        />
      );
    }
    return (
      <PokemonGrid
        data={data}
        onEndReached={loadMore}
        refreshControl={
          isFiltered ? undefined : (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.line}
            />
          )
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.text }]}>
            Nenhum Pokémon com “{query.trim()}”{type ? ` do tipo ${typeName(type)}` : ''}.
          </Text>
        }
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator color={theme.line} style={styles.footer} />
          ) : undefined
        }
      />
    );
  };

  return (
    <BrutalScreen>
      <View style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nome" />
        <View style={styles.filterRow}>
          {type ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover filtro ${typeName(type)}`}
              onPress={() => setType(null)}
              style={styles.activeType}>
              <TypeBadge type={type} />
              <Text style={[styles.remove, { color: theme.text }]}>✕</Text>
            </Pressable>
          ) : null}
          <BrutalButton
            label={type ? 'Trocar tipo' : 'Filtrar por tipo'}
            color={theme.blue}
            onPress={() => setIsFilterOpen(true)}
          />
        </View>
      </View>
      {renderContent()}
      <TypeFilterSheet
        isPresented={isFilterOpen}
        onDismiss={() => setIsFilterOpen(false)}
        onSelect={handleSelectType}
      />
    </BrutalScreen>
  );
}

const styles = StyleSheet.create({
  controls: { padding: Brutal.gap, gap: 12 },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12 },
  activeType: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 'auto' },
  remove: { fontFamily: Brutal.font.bold, fontSize: 18 },
  empty: { fontFamily: Brutal.font.bold, fontSize: 16, textAlign: 'center', paddingVertical: 32 },
  footer: { paddingVertical: 16 },
});
