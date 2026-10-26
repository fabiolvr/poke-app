import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { BrutalAccordion } from '@/components/brutal-accordion';
import { ChoiceGroup } from '@/components/choice-group';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { gameName, learnset, type LearnMethod } from '@/features/pokemon/moves';
import { moveName, word } from '@/features/pokemon/translations';
import type { Pokemon } from '@/features/pokemon/types';
import { useLanguage } from '@/hooks/use-language';

type Props = {
  pokemon: Pick<Pokemon, 'moves'>;
};

// Golpes que o Pokémon aprende no jogo mais recente em que aparece, uma aba por forma de aprender.
export function MoveList({ pokemon }: Props) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const language = useLanguage();
  const moves = learnset(pokemon);
  const [chosen, setChosen] = useState<LearnMethod>();

  if (!moves) {
    return null;
  }

  // A aba escolhida pode não existir no Pokémon seguinte (ex.: sem golpes de ovo).
  const current = moves.methods.find(({ method }) => method === chosen) ?? moves.methods[0];
  const textStyle = [styles.move, { color: theme.text }];

  return (
    <BrutalAccordion title={t('moves.title')}>
      <Text style={[styles.hint, { color: theme.muted }]}>
        {t('moves.game', { game: gameName(moves.game) })}
      </Text>
      <ChoiceGroup
        options={moves.methods.map(({ method }) => ({
          value: method,
          label: t(`moves.methods.${method}`),
        }))}
        value={current.method}
        onChange={setChosen}
      />
      <View style={styles.list}>
        {current.moves.map(({ name, level }) => (
          <View key={`${name}-${level}`} style={styles.row}>
            {current.method === 'level-up' ? (
              <Text style={[styles.level, { color: theme.muted }]}>
                {level === 0 ? t('moves.evolution') : `${word('level', language)} ${level}`}
              </Text>
            ) : null}
            <Text style={textStyle}>{moveName(name)}</Text>
          </View>
        ))}
      </View>
    </BrutalAccordion>
  );
}

const styles = StyleSheet.create({
  hint: { fontFamily: Brutal.font.body, fontSize: 14, lineHeight: 20 },
  list: { gap: 8, marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  level: { fontFamily: Brutal.font.bold, fontSize: 14, width: 56 },
  move: { fontFamily: Brutal.font.body, fontSize: 16, flex: 1 },
});
