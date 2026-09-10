import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { Character } from '../../src/components/common/Character';
import { spacing } from '../../src/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockCurrentUser } from '../../src/mockData';
import { Mail, RefreshCw } from 'lucide-react-native';
import { authService } from '../../src/services';

export default function VerifyEmailScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await authService.resendVerificationEmail(user?.email || '');
      setCountdown(60);
    } catch {
      // silently fail in mock
    }
    setResending(false);
  };

  const handleContinue = () => {
    // Mock: pretend email is verified
    router.replace('/(onboarding)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.illustration, { backgroundColor: theme.colors.primaryLight }]}>
          <Mail size={48} color={theme.colors.primary} />
        </View>

        <AppText variant="headingL" style={{ textAlign: 'center' }}>Check Your Email</AppText>
        <AppText variant="body" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
          We sent a verification link to
        </AppText>
        <AppText variant="headingS" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: spacing.xs }}>
          {user?.email || 'your email'}
        </AppText>

        <View style={styles.characterWrap}>
          <Character character={mockCurrentUser.character} size={80} expression="thinking" />
        </View>

        <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
          Click the link in your email to verify your account, then continue below.
        </AppText>

        <TouchableOpacity onPress={handleResend} disabled={countdown > 0 || resending} style={styles.resendBtn}>
          <RefreshCw size={16} color={countdown > 0 ? theme.colors.textMuted : theme.colors.primary} />
          <AppText variant="bodySmall" style={{ color: countdown > 0 ? theme.colors.textMuted : theme.colors.primary, marginLeft: spacing.xs }}>
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification email'}
          </AppText>
        </TouchableOpacity>

        <AppButton title="I've Verified — Continue" onPress={handleContinue} fullWidth size="lg" />

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
            Wrong email? <AppText variant="bodySmall" style={{ color: theme.colors.primary }}>Change it</AppText>
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.xxl, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  illustration: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  characterWrap: { marginVertical: spacing.lg },
  resendBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
});
