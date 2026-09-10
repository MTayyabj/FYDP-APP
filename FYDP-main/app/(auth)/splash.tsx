import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { Character } from '../../src/components/common/Character';
import { mockCurrentUser } from '../../src/mockData';
import { config } from '../../src/constants/config';
import { AppText } from '../../src/components/common/AppText';

export default function SplashScreen() {
  const { theme } = useThemeStore();
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && isOnboardingComplete) {
        router.replace('/(tabs)');
      } else if (isAuthenticated && !isOnboardingComplete) {
        router.replace('/(onboarding)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboardingComplete]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.content}>
        <Character character={mockCurrentUser.character} size={140} expression="excited" />
        <AppText variant="headingXL" style={styles.appName}>
          {config.appName}
        </AppText>
        <AppText variant="body" style={styles.tagline}>
          {config.appTagline}
        </AppText>
        <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 24 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  appName: {
    color: '#FFFFFF',
    marginTop: 20,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
});
