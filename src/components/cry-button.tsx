import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Sticker } from '@/components/sticker';
import { useBrutalTheme } from '@/constants/brutal';

type Props = {
  // Em ordem de preferência: se uma falhar (ex.: a forma não tem grito próprio), tenta a seguinte.
  uris: string[];
  style?: StyleProp<ViewStyle>;
};

// Adesivo que toca o grito do Pokémon. Sem internet, ou se nenhum arquivo existir, não aparece.
export function CryButton({ uris, style }: Props) {
  const [attempt, setAttempt] = useState(0);
  const uri = uris[attempt];

  if (!uri) {
    return null;
  }

  // A key recria o player a cada tentativa, sem carregar o erro da anterior.
  return <CryPlayer key={uri} uri={uri} onError={() => setAttempt((n) => n + 1)} style={style} />;
}

type PlayerProps = {
  uri: string;
  onError: () => void;
  style?: StyleProp<ViewStyle>;
};

function CryPlayer({ uri, onError, style }: PlayerProps) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const hasError = status.error !== null;

  useEffect(() => {
    if (hasError) {
      onError();
    }
  }, [hasError, onError]);

  if (hasError) {
    return null;
  }

  // Volta ao início para tocar de novo, mesmo se o toque anterior ainda não acabou.
  const play = async () => {
    await player.seekTo(0);
    player.play();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('details.cry')}
      accessibilityState={{ disabled: !status.isLoaded, busy: status.playing }}
      disabled={!status.isLoaded}
      onPress={play}
      hitSlop={8}
      style={style}>
      <Sticker
        label={`🔊 ${t('details.cryLabel').toUpperCase()}`}
        color={status.playing ? theme.pink : theme.white}
        tilt={-3}
      />
    </Pressable>
  );
}
