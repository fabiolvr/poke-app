import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { BrutalButton } from '@/components/brutal-button';
import { BrutalScreen } from '@/components/brutal-screen';
import { FilterSheet } from '@/components/filter-sheet';
import { PokemonGrid } from '@/components/pokemon-grid';
import { ScreenMessage } from '@/components/screen-message';
import { SearchBar } from '@/components/search-bar';
import { Sticker } from '@/components/sticker';
import { TypeBadge } from '@/components/type-badge';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { findGeneration } from '@/features/pokemon/generations';
import { typeName } from '@/features/pokemon/translations';
import { usePokedexSource, type PokedexFilters } from '@/features/pokemon/use-pokedex-source';
import { useIsOffline } from '@/hooks/use-is-offline';
import { useLanguage } from '@/hooks/use-language';

export default function PokedexScreen() {
  const theme = useBrutalTheme();
  const isOffline = useIsOffline();
  const { t } = useTranslation();
  const language = useLanguage();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<PokedexFilters>({ types: [], generation: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isFiltered, isLoading, isError, refetch, loadMore, isFetchingMore } =
    usePokedexSource(query, filters);
  const generation = findGeneration(filters.generation);
  const hasFilters = filters.types.length > 0 || generation !== undefined;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const removeType = (type: string) =>
    setFilters({ ...filters, types: filters.types.filter((item) => item !== type) });

  const emptyText = () => {
    const trimmed = query.trim();
    if (!hasFilters) {
      return t('pokedex.empty', { query: trimmed });
    }
    return trimmed ? t('pokedex.emptyWithFilters', { query: trimmed }) : t('pokedex.emptyFilters');
  };

  const renderContent = () => {
    if (isLoading) {
      return <ScreenMessage inline text={t('pokedex.loading')} />;
    }
    if (isError) {
      return (
        <ScreenMessage
          inline
          tone="error"
          text={isOffline ? t('pokedex.offlineError') : t('pokedex.error')}
          actionLabel={t('common.retry')}
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
          <Text style={[styles.empty, { color: theme.text }]}>{emptyText()}</Text>
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
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('pokedex.search')} />
        <View style={styles.filterRow}>
          {/* Cada filtro ativo vira um adesivo que sai com um toque. */}
          <View style={styles.activeFilters}>
            {filters.types.map((type) => (
              <Pressable
                key={type}
                accessibilityRole="button"
                accessibilityLabel={t('pokedex.removeFilter', { filter: typeName(type, language) })}
                onPress={() => removeType(type)}
                style={styles.activeFilter}>
                <TypeBadge type={type} />
                <Text style={[styles.remove, { color: theme.text }]}>✕</Text>
              </Pressable>
            ))}
            {generation ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('pokedex.removeFilter', { filter: generation.region })}
                onPress={() => setFilters({ ...filters, generation: null })}
                style={styles.activeFilter}>
                <Sticker label={generation.region} color={theme.white} />
                <Text style={[styles.remove, { color: theme.text }]}>✕</Text>
              </Pressable>
            ) : null}
          </View>
          <BrutalButton
            label={hasFilters ? t('pokedex.changeFilters') : t('pokedex.filter')}
            color={theme.blue}
            onPress={() => setIsFilterOpen(true)}
          />
        </View>
      </View>
      {renderContent()}
      <FilterSheet
        isPresented={isFilterOpen}
        filters={filters}
        onChange={setFilters}
        onDismiss={() => setIsFilterOpen(false)}
      />
    </BrutalScreen>
  );
}

const styles = StyleSheet.create({
  controls: { padding: Brutal.gap, gap: 12 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeFilters: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  activeFilter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  remove: { fontFamily: Brutal.font.bold, fontSize: 18 },
  empty: { fontFamily: Brutal.font.bold, fontSize: 16, textAlign: 'center', paddingVertical: 32 },
  footer: { paddingVertical: 16 },
});
