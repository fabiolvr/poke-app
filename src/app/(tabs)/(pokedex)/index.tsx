import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useIsOffline } from '@/hooks/use-is-offline';
import { useLanguage } from '@/hooks/use-language';

export default function PokedexScreen() {
  const theme = useBrutalTheme();
  const isOffline = useIsOffline();
  const { t } = useTranslation();
  const language = useLanguage();
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
          <Text style={[styles.empty, { color: theme.text }]}>
            {type
              ? t('pokedex.emptyWithType', { query: query.trim(), type: typeName(type, language) })
              : t('pokedex.empty', { query: query.trim() })}
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
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('pokedex.search')} />
        <View style={styles.filterRow}>
          {type ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('pokedex.removeFilter', { type: typeName(type, language) })}
              onPress={() => setType(null)}
              style={styles.activeType}>
              <TypeBadge type={type} />
              <Text style={[styles.remove, { color: theme.text }]}>✕</Text>
            </Pressable>
          ) : null}
          <BrutalButton
            label={type ? t('pokedex.changeType') : t('pokedex.filter')}
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
