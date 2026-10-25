import {
  Button,
  Collapsible,
  Column,
  FieldGroup,
  Host,
  RNHostView,
  Row,
  Spacer,
  Text,
} from '@expo/ui';
import { skipToken } from '@reduxjs/toolkit/query';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ScreenMessage } from '@/components/screen-message';
import { TypeBadge } from '@/components/type-badge';
import { selectIsFavorite, toggleFavorite } from '@/features/favorites/favorites-slice';
import { useGetPokemonQuery, useGetPokemonSpeciesQuery } from '@/features/pokemon/pokemon-api';
import {
  artworkUrl,
  capitalize,
  formatDexNumber,
  formatHeight,
  formatWeight,
  pickFlavorText,
  pickGenus,
  STAT_LABELS,
} from '@/features/pokemon/pokemon-utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Row>
      <Text>{label}</Text>
      <Spacer flexible />
      <Text textStyle={{ fontWeight: '600' }}>{value}</Text>
    </Row>
  );
}

export default function PokemonDetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const dispatch = useAppDispatch();
  const [showAbilities, setShowAbilities] = useState(false);

  const { data: pokemon, isLoading, isError, refetch } = useGetPokemonQuery(name);
  // Formas alternativas (ex.: deoxys-normal) têm outro nome de espécie.
  const { data: species } = useGetPokemonSpeciesQuery(pokemon?.species.name ?? skipToken);
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, name));

  if (isLoading) {
    return <ScreenMessage text="Carregando…" />;
  }

  if (isError || !pokemon) {
    return (
      <ScreenMessage
        text="Não foi possível carregar este Pokémon."
        actionLabel="Tentar de novo"
        onAction={refetch}
      />
    );
  }

  const summary = { id: pokemon.id, name: pokemon.name, imageUrl: artworkUrl(pokemon.id) };

  return (
    <>
      <Stack.Screen options={{ title: capitalize(pokemon.name) }} />
      <Host style={styles.host}>
        <FieldGroup>
          <FieldGroup.Section>
            <Column alignment="center" spacing={12}>
              <RNHostView matchContents>
                <Image source={summary.imageUrl} style={styles.artwork} contentFit="contain" />
              </RNHostView>
              <Text textStyle={{ fontSize: 15, color: '#8A8A8E' }}>
                {formatDexNumber(pokemon.id)}
              </Text>
              <Row spacing={8}>
                {pokemon.types.map(({ type }) => (
                  <TypeBadge key={type.name} type={type.name} />
                ))}
              </Row>
              {species ? (
                <Text textStyle={{ textAlign: 'center' }}>{pickFlavorText(species)}</Text>
              ) : null}
              <Button
                label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                variant={isFavorite ? 'outlined' : 'filled'}
                onPress={() => dispatch(toggleFavorite(summary))}
              />
            </Column>
          </FieldGroup.Section>

          <FieldGroup.Section title="Dados">
            <InfoRow label="Altura" value={formatHeight(pokemon.height)} />
            <InfoRow label="Peso" value={formatWeight(pokemon.weight)} />
            {species ? <InfoRow label="Categoria" value={pickGenus(species)} /> : null}
          </FieldGroup.Section>

          <FieldGroup.Section title="Status base">
            {pokemon.stats.map(({ stat, base_stat }) => (
              <InfoRow
                key={stat.name}
                label={STAT_LABELS[stat.name] ?? stat.name}
                value={String(base_stat)}
              />
            ))}
          </FieldGroup.Section>

          <FieldGroup.Section>
            <Collapsible label="Habilidades" isOpen={showAbilities} onOpenChange={setShowAbilities}>
              <Column spacing={8}>
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <Text key={ability.name}>
                    {`${capitalize(ability.name)}${is_hidden ? ' (oculta)' : ''}`}
                  </Text>
                ))}
              </Column>
            </Collapsible>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
  artwork: { width: 200, height: 200 },
});
