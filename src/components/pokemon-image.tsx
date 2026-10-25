import { Image, type ImageStyle } from 'expo-image';
import { useState } from 'react';
import type { StyleProp } from 'react-native';

const FALLBACK = require('@/assets/images/pokeball.png');

type Props = {
  uri: string;
  style: StyleProp<ImageStyle>;
};

// Arte oficial do Pokémon; algumas formas não têm (ex.: Koraidon Limited Build) e mostram a Poké Bola.
export function PokemonImage({ uri, style }: Props) {
  // Guarda qual URL falhou, para voltar a tentar se o componente passar a mostrar outro Pokémon.
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <Image
      source={failedUri === uri ? FALLBACK : uri}
      style={style}
      contentFit="contain"
      onError={() => setFailedUri(uri)}
    />
  );
}
