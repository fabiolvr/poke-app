import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonImage } from '@/components/pokemon-image';
import { BrutalBox } from '@/components/brutal-box';
import { BrutalButton } from '@/components/brutal-button';
import { FactBox } from '@/components/fact-box';
import { ScreenMessage } from '@/components/screen-message';
import { StatBar } from '@/components/stat-bar';
import { Sticker } from '@/components/sticker';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { getTypeColor } from '@/constants/type-colors';
import { useGetPokemonQuery } from '@/features/pokemon/pokemon-api';
import { artworkUrl, dexLabel, formatName } from '@/features/pokemon/pokemon-utils';
import { statName } from '@/features/pokemon/translations';
import type { Pokemon } from '@/features/pokemon/types';
import { useLanguage } from '@/hooks/use-language';

type Props = {
  first: string;
  second: string;
  onChangeOpponent: () => void;
};

function totalOf(pokemon: Pokemon) {
  return pokemon.stats.reduce((sum, { base_stat }) => sum + base_stat, 0);
}

function describeResult(left: Pokemon, right: Pokemon, t: TFunction) {
  const leftTotal = totalOf(left);
  const rightTotal = totalOf(right);
  if (leftTotal === rightTotal) {
    return t('compare.tie', { total: leftTotal });
  }
  const [winner, loser] = leftTotal > rightTotal ? [left, right] : [right, left];
  return t('compare.win', {
    winner: formatName(winner),
    winnerTotal: totalOf(winner),
    loserTotal: totalOf(loser),
  });
}

export function StatComparison({ first, second, onChangeOpponent }: Props) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const language = useLanguage();
  const insets = useSafeAreaInsets();
  const leftQuery = useGetPokemonQuery(first);
  const rightQuery = useGetPokemonQuery(second);

  if (leftQuery.isLoading || rightQuery.isLoading) {
    return <ScreenMessage text={t('compare.loading')} />;
  }

  const left = leftQuery.data;
  const right = rightQuery.data;
  if (!left || !right) {
    return (
      <ScreenMessage
        tone="error"
        text={t('compare.error')}
        actionLabel={t('common.retry')}
        onAction={() => {
          leftQuery.refetch();
          rightQuery.refetch();
        }}
      />
    );
  }

  const leftColor = getTypeColor(left.types[0]?.type.name ?? '');
  const rightColor = getTypeColor(right.types[0]?.type.name ?? '');

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.paper, borderTopColor: theme.line }]}
      contentContainerStyle={[styles.content, { paddingBottom: Brutal.gap * 2 + insets.bottom }]}>
      <View style={styles.versus}>
        <Contender pokemon={left} fill={leftColor.fill} text={leftColor.text} />
        <Contender pokemon={right} fill={rightColor.fill} text={rightColor.text} />
        <Sticker label="VS" color={theme.yellow} style={styles.vs} />
      </View>

      {left.stats.map(({ stat, base_stat }) => (
        <BrutalBox key={stat.name} style={styles.stat}>
          <Text style={[styles.statTitle, { color: theme.text }]}>
            {statName(stat.name, language).toUpperCase()}
          </Text>
          <StatBar label={formatName(left)} value={base_stat} color={leftColor.fill} />
          <StatBar
            label={formatName(right)}
            value={right.stats.find((other) => other.stat.name === stat.name)?.base_stat ?? 0}
            color={rightColor.fill}
          />
        </BrutalBox>
      ))}

      <View style={styles.totals}>
        <FactBox
          label={t('compare.total', { name: formatName(left) })}
          value={String(totalOf(left))}
        />
        <FactBox
          label={t('compare.total', { name: formatName(right) })}
          value={String(totalOf(right))}
        />
      </View>
      <Text style={[styles.result, { color: theme.text }]}>{describeResult(left, right, t)}</Text>

      <BrutalButton
        label={t('compare.changeOpponent')}
        color={theme.pink}
        onPress={onChangeOpponent}
      />
    </ScrollView>
  );
}

type ContenderProps = {
  pokemon: Pokemon;
  fill: string;
  text: string;
};

function Contender({ pokemon, fill, text }: ContenderProps) {
  const language = useLanguage();
  return (
    <BrutalBox color={fill} style={styles.contender}>
      <PokemonImage uri={artworkUrl(pokemon.id)} style={styles.image} />
      <Text style={[styles.name, { color: text }]} numberOfLines={1}>
        {formatName(pokemon).toUpperCase()}
      </Text>
      <Text style={[styles.number, { color: text }]}>{dexLabel(pokemon, language)}</Text>
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, borderTopWidth: Brutal.border },
  content: { padding: Brutal.gap, gap: Brutal.gap },
  versus: { flexDirection: 'row', gap: Brutal.gap },
  vs: { position: 'absolute', alignSelf: 'center', left: '50%', marginLeft: -22, top: '40%' },
  contender: { flex: 1, padding: 10, alignItems: 'center', gap: 2 },
  image: { width: '100%', aspectRatio: 1 },
  name: { fontFamily: Brutal.font.display, fontSize: 14 },
  number: { fontFamily: Brutal.font.bold, fontSize: 13 },
  stat: { padding: 12, gap: 8 },
  statTitle: { fontFamily: Brutal.font.display, fontSize: 14 },
  totals: { flexDirection: 'row', gap: Brutal.gap },
  result: { fontFamily: Brutal.font.bold, fontSize: 17, lineHeight: 23 },
});
