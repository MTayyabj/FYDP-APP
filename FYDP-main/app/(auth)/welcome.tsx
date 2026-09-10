import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { config } from '../../src/constants/config';
import { Character } from '../../src/components/common/Character';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { mockCurrentUser } from '../../src/mockData';
import { spacing } from '../../src/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const { theme } = useThemeStore();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Character character={mockCurrentUser.character} size={160} expression="excited" />
          <AppText variant="headingXL" style={styles.appName}>
            {config.appName}
          </AppText>
          <AppText variant="body" style={styles.tagline}>
            {config.appTagline}
          </AppText>
          <AppText variant="bodySmall" style={styles.description}>
            Learn anything, anywhere. Join thousands of learners on a gamified journey to mastery.
          </AppText>
        </View>
        <View style={styles.actions}>
          <AppButton
            title="Get Started"
            onPress={() => router.push('/(auth)/signup')}
            variant="secondary"
            size="lg"
            fullWidth
          />
          <View style={{ height: 12 }} />
          <AppButton
            title="I Already Have an Account"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    color: '#FFFFFF',
    marginTop: spacing.xl,
  },
  tagline: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.lg,
    textAlign: 'center',
    maxWidth: 280,
  },
  actions: {
    paddingBottom: spacing.xxl,
  },
});
