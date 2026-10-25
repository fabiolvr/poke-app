import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Sticker } from '@/components/sticker';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { useGetEvolutionChainQuery } from '@/features/pokemon/pokemon-api';
import { capitalize } from '@/features/pokemon/pokemon-utils';
import type { EvolutionStep } from '@/features/pokemon/types';

const COLUMNS = 3;
const CARD_GAP = 12;

type Props = {
  chainId: number;
  currentId: number;
};

export function EvolutionChain({ chainId, currentId }: Props) {
  const theme = useBrutalTheme();
  const { width } = useWindowDimensions();
  const { data: stages } = useGetEvolutionChainQuery(chainId);

  if (!stages) {
    return null;
  }

  // Arredonda para baixo: no Android a soma das larguras fracionárias passava do espaço e o
  // último card da linha descia para a linha seguinte.
  const cardWidth = Math.floor((width - Brutal.gap * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>EVOLUÇÕES</Text>
      {stages.length === 1 ? (
        <Text style={[styles.none, { color: theme.text }]}>Este Pokémon não evolui.</Text>
      ) : (
        stages.map((stage, index) => (
          <View key={stage[0]?.pokemon.name ?? index} style={styles.stage}>
            {index > 0 ? <Text style={[styles.arrow, { color: theme.text }]}>↓</Text> : null}
            <View style={styles.row}>
              {stage.map((step) => (
                <EvolutionCard
                  key={step.pokemon.name}
                  step={step}
                  width={cardWidth}
                  isCurrent={step.pokemon.id === currentId}
                />
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  );
}

type CardProps = {
  step: EvolutionStep;
  width: number;
  isCurrent: boolean;
};

function EvolutionCard({ step, width, isCurrent }: CardProps) {
  const theme = useBrutalTheme();
  const name = capitalize(step.pokemon.name);

  const renderCard = (pressed: boolean) => (
    <BrutalBox
      color={isCurrent ? theme.yellow : theme.surface}
      pressed={pressed}
      style={styles.card}>
      <Image source={step.pokemon.imageUrl} style={styles.image} contentFit="contain" />
      <Text
        style={[styles.name, { color: isCurrent ? theme.textOnColor : theme.text }]}
        numberOfLines={1}>
        {name.toUpperCase()}
      </Text>
      {step.how ? (
        <Sticker
          label={step.how}
          color={theme.white}
          size="small"
          style={[styles.how, { maxWidth: width - 12 }]}
        />
      ) : null}
    </BrutalBox>
  );

  if (isCurrent) {
    return (
      <View style={{ width }} accessible accessibilityLabel={`${name}, o Pokémon desta tela`}>
        {renderCard(false)}
      </View>
    );
  }

  return (
    <Pressable
      style={{ width }}
      accessibilityRole="button"
      accessibilityLabel={step.how ? `${name}, evolui por ${step.how}` : name}
      // Navega pelo id: o nome da espécie nem sempre é um nome válido em /pokemon.
      onPress={() =>
        router.push({ pathname: '/pokemon/[name]', params: { name: String(step.pokemon.id) } })
      }>
      {({ pressed }) => renderCard(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontFamily: Brutal.font.display, fontSize: 18, marginTop: 8 },
  none: { fontFamily: Brutal.font.body, fontSize: 16 },
  stage: { gap: 12, alignItems: 'center' },
  arrow: { fontFamily: Brutal.font.display, fontSize: 22 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: CARD_GAP },
  card: { padding: 8, paddingTop: 14, alignItems: 'center', gap: 4 },
  image: { width: '100%', aspectRatio: 1 },
  name: { fontFamily: Brutal.font.display, fontSize: 11 },
  how: { position: 'absolute', top: -12, right: 6 },
});
