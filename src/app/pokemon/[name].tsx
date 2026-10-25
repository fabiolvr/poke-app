import { skipToken } from '@reduxjs/toolkit/query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrutalAccordion } from '@/components/brutal-accordion';
import { BrutalBox } from '@/components/brutal-box';
import { BrutalButton } from '@/components/brutal-button';
import { EvolutionChain } from '@/components/evolution-chain';
import { FactBox } from '@/components/fact-box';
import { ScreenMessage } from '@/components/screen-message';
import { StatBar } from '@/components/stat-bar';
import { Sticker } from '@/components/sticker';
import { TypeBadge } from '@/components/type-badge';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { getTypeColor } from '@/constants/type-colors';
import { selectIsFavorite, toggleFavorite } from '@/features/favorites/favorites-slice';
import { useGetPokemonQuery, useGetPokemonSpeciesQuery } from '@/features/pokemon/pokemon-api';
import {
  artworkUrl,
  capitalize,
  formatDexNumber,
  formatHeight,
  formatWeight,
  idFromUrl,
  pickFlavorText,
  pickGenus,
  STAT_LABELS,
} from '@/features/pokemon/pokemon-utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function PokemonDetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const theme = useBrutalTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { data: pokemon, isLoading, isError, refetch } = useGetPokemonQuery(name);
  // Formas alternativas (ex.: deoxys-normal) têm outro nome de espécie.
  const { data: species } = useGetPokemonSpeciesQuery(pokemon?.species.name ?? skipToken);
  // A rota pode chegar com o id (vindo da linha evolutiva); o favorito é guardado pelo nome.
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, pokemon?.name ?? name));

  if (isLoading) {
    return <ScreenMessage text="Carregando…" />;
  }

  if (isError || !pokemon) {
    return (
      <ScreenMessage
        tone="error"
        text="Não foi possível carregar este Pokémon."
        actionLabel="Tentar de novo"
        onAction={refetch}
      />
    );
  }

  const summary = { id: pokemon.id, name: pokemon.name, imageUrl: artworkUrl(pokemon.id) };
  const mainType = getTypeColor(pokemon.types[0]?.type.name ?? '');

  const handleToggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(toggleFavorite(summary));
  };

  return (
    <>
      <Stack.Screen options={{ title: pokemon.name.toUpperCase() }} />
      <ScrollView
        style={[styles.screen, { backgroundColor: theme.paper, borderTopColor: theme.line }]}
        contentContainerStyle={[styles.content, { paddingBottom: Brutal.gap * 2 + insets.bottom }]}>
        <BrutalBox color={mainType.fill} style={styles.hero}>
          <Sticker label={formatDexNumber(pokemon.id)} color={theme.white} style={styles.number} />
          <Image source={summary.imageUrl} style={styles.artwork} contentFit="contain" />
          <View style={styles.types}>
            {pokemon.types.map(({ type }, index) => (
              <TypeBadge key={type.name} type={type.name} tilt={index % 2 === 0 ? -3 : 3} />
            ))}
          </View>
        </BrutalBox>

        {species ? (
          <Text style={[styles.flavor, { color: theme.text }]}>{pickFlavorText(species)}</Text>
        ) : null}

        <BrutalButton
          label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
          color={isFavorite ? theme.pink : theme.yellow}
          onPress={handleToggleFavorite}
        />
        <BrutalButton
          label="Comparar status"
          color={theme.blue}
          onPress={() => router.push({ pathname: '/compare', params: { a: pokemon.name } })}
        />

        <Text style={[styles.section, { color: theme.text }]}>DADOS</Text>
        <View style={styles.facts}>
          <FactBox label="Altura" value={formatHeight(pokemon.height)} />
          <FactBox label="Peso" value={formatWeight(pokemon.weight)} />
        </View>
        {species ? <FactBox label="Categoria" value={pickGenus(species)} /> : null}

        <Text style={[styles.section, { color: theme.text }]}>STATUS BASE</Text>
        <BrutalBox style={styles.stats}>
          {pokemon.stats.map(({ stat, base_stat }) => (
            <StatBar
              key={stat.name}
              label={STAT_LABELS[stat.name] ?? stat.name}
              value={base_stat}
              color={mainType.fill}
            />
          ))}
        </BrutalBox>

        <BrutalAccordion title="Habilidades">
          {pokemon.abilities.map(({ ability, is_hidden }) => (
            <Text key={ability.name} style={[styles.ability, { color: theme.text }]}>
              {`${capitalize(ability.name)}${is_hidden ? ' (oculta)' : ''}`}
            </Text>
          ))}
        </BrutalAccordion>

        {species ? (
          <EvolutionChain chainId={idFromUrl(species.evolution_chain.url)} currentId={pokemon.id} />
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, borderTopWidth: Brutal.border },
  content: { padding: Brutal.gap, paddingTop: Brutal.gap + 12, gap: Brutal.gap },
  hero: { padding: 16, alignItems: 'center', gap: 12 },
  number: { position: 'absolute', top: -12, right: 12 },
  artwork: { width: 220, height: 220 },
  types: { flexDirection: 'row', gap: 10 },
  flavor: { fontFamily: Brutal.font.body, fontSize: 16, lineHeight: 23 },
  section: { fontFamily: Brutal.font.display, fontSize: 18, marginTop: 8 },
  facts: { flexDirection: 'row', gap: Brutal.gap },
  stats: { padding: 14, gap: 10 },
  ability: { fontFamily: Brutal.font.body, fontSize: 16 },
});
