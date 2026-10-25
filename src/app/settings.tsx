import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrutalBox } from '@/components/brutal-box';
import { BrutalButton } from '@/components/brutal-button';
import { ChoiceGroup } from '@/components/choice-group';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import {
  clearCachedResponses,
  getCacheSummary,
  type CacheSummary,
} from '@/features/pokemon/response-cache';
import {
  selectSettings,
  setLanguage,
  setTheme,
  type ThemeSetting,
} from '@/features/settings/settings-slice';
import { useLanguage } from '@/hooks/use-language';
import type { Language, LanguageSetting } from '@/i18n/language';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const POKEAPI_URL = 'https://pokeapi.co';
// Assinatura do autor: igual nos dois idiomas, com o coração em emoji (vermelho).
const SIGNATURE = 'Made with \u2764\uFE0F in Belford Roxo';

function formatBytes(bytes: number, language: Language) {
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const [value, unit] = bytes >= 1024 * 1024 ? [bytes / 1024 / 1024, 'MB'] : [bytes / 1024, 'KB'];
  return `${value.toLocaleString(locale, { maximumFractionDigits: 1 })} ${unit}`;
}

export default function SettingsScreen() {
  const theme = useBrutalTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [summary, setSummary] = useState<CacheSummary | null>(null);

  const refreshSummary = useCallback(() => {
    getCacheSummary().then(setSummary, () => setSummary(null));
  }, []);

  useEffect(refreshSummary, [refreshSummary]);

  const confirmClear = () => {
    Alert.alert(t('settings.clearTitle'), t('settings.clearMessage'), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.clearConfirm'),
        style: 'destructive',
        onPress: async () => {
          await Promise.all([clearCachedResponses(), Image.clearDiskCache()]);
          refreshSummary();
        },
      },
    ]);
  };

  const sectionStyle = [styles.section, { color: theme.text }];
  const textStyle = [styles.text, { color: theme.text }];
  const hintStyle = [styles.hint, { color: theme.muted }];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.paper, borderTopColor: theme.line }]}
      contentContainerStyle={[styles.content, { paddingBottom: Brutal.gap * 2 + insets.bottom }]}>
      <Text style={sectionStyle}>{t('settings.theme')}</Text>
      <ChoiceGroup<ThemeSetting>
        value={settings.theme}
        onChange={(value) => dispatch(setTheme(value))}
        options={[
          { value: 'system', label: t('settings.themes.system') },
          { value: 'light', label: t('settings.themes.light') },
          { value: 'dark', label: t('settings.themes.dark') },
        ]}
      />

      <Text style={sectionStyle}>{t('settings.language')}</Text>
      <ChoiceGroup<LanguageSetting>
        value={settings.language}
        onChange={(value) => dispatch(setLanguage(value))}
        options={[
          { value: 'system', label: t('settings.languages.system') },
          { value: 'pt', label: t('settings.languages.pt') },
          { value: 'en', label: t('settings.languages.en') },
        ]}
      />
      <Text style={hintStyle}>{t('settings.languageHint')}</Text>

      <Text style={sectionStyle}>{t('settings.data')}</Text>
      <BrutalBox style={styles.box}>
        <Text style={textStyle}>
          {summary === null || summary.count === 0
            ? t('settings.dataEmpty')
            : t('settings.dataSummary', {
                count: summary.count,
                size: formatBytes(summary.bytes, language),
              })}
        </Text>
        <Text style={hintStyle}>{t('settings.dataHint')}</Text>
        <BrutalButton label={t('settings.clear')} color={theme.red} onPress={confirmClear} />
      </BrutalBox>

      <Text style={sectionStyle}>{t('settings.about')}</Text>
      <BrutalBox style={styles.box}>
        <Text style={textStyle}>
          {t('settings.version', { version: Constants.expoConfig?.version ?? '—' })}
        </Text>
        <Text style={textStyle}>{t('settings.credits')}</Text>
        <BrutalButton
          label={t('settings.openPokeApi')}
          color={theme.blue}
          onPress={() => Linking.openURL(POKEAPI_URL)}
        />
        <Text style={hintStyle}>{t('settings.trademark')}</Text>
      </BrutalBox>

      <Text style={[styles.signature, { color: theme.text }]}>{SIGNATURE}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, borderTopWidth: Brutal.border },
  content: { padding: Brutal.gap, gap: 12 },
  section: { fontFamily: Brutal.font.display, fontSize: 18, marginTop: 12 },
  box: { padding: 16, gap: 12 },
  text: { fontFamily: Brutal.font.bold, fontSize: 16, lineHeight: 22 },
  hint: { fontFamily: Brutal.font.body, fontSize: 14, lineHeight: 20 },
  signature: { fontFamily: Brutal.font.bold, fontSize: 15, textAlign: 'center', marginTop: 12 },
});
