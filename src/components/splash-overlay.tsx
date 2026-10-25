import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { BrutalThemes } from '@/constants/brutal';

const DURATION = 600;

// Mesmo amarelo e mesma Poké Bola da splash nativa (app.json): a troca não aparece.
const SPLASH_BACKGROUND = BrutalThemes.light.yellow;
const SPLASH_IMAGE_SIZE = 160;

const exitKeyframe = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  30: {
    opacity: 1,
    transform: [{ scale: 1.08 }],
    easing: Easing.out(Easing.quad),
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0.6 }],
    easing: Easing.in(Easing.quad),
  },
});

// Cobre a tela enquanto o app monta, esconde a splash nativa e sai com a bola encolhendo.
export function SplashOverlay() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const ball = <Image style={styles.ball} source={require('@/assets/images/splash-icon.png')} />;

  if (isLeaving) {
    return (
      <Animated.View
        entering={exitKeyframe.duration(DURATION).withCallback((finished) => {
          'worklet';
          if (finished) {
            scheduleOnRN(setIsVisible, false);
          }
        })}
        style={styles.overlay}>
        {ball}
      </Animated.View>
    );
  }

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => setIsLeaving(true));
      }}
      style={styles.overlay}>
      {ball}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SPLASH_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  ball: {
    width: SPLASH_IMAGE_SIZE,
    height: SPLASH_IMAGE_SIZE,
  },
});
