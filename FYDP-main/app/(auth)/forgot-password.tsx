import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { AppInput } from '../../src/components/common/AppInput';
import { spacing } from '../../src/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { authService } from '../../src/services';

export default function ForgotPasswordScreen() {
  const { theme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      // still show success in mock
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.illustration, { backgroundColor: theme.colors.primaryLight }]}>
            <CheckCircle size={48} color={theme.colors.primary} />
          </View>
          <AppText variant="headingL" style={{ textAlign: 'center' }}>Check Your Email</AppText>
          <AppText variant="body" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
            We sent a password reset link to{'\n'}
            <AppText variant="headingS" style={{ color: theme.colors.primary }}>{email}</AppText>
          </AppText>
          <AppText variant="bodySmall" style={{ color: theme.colors.textMuted, textAlign: 'center' }}>
            Follow the link in your email to reset your password.
          </AppText>
          <AppButton title="Back to Login" onPress={() => router.replace('/(auth)/login')} fullWidth size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <AppText variant="headingXL">Forgot Password?</AppText>
        <AppText variant="body" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
          No worries! Enter your email and we'll send you a reset link.
        </AppText>

        <View style={styles.form}>
          <AppInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={theme.colors.textMuted} />}
          />
        </View>

        <AppButton title={loading ? 'Sending...' : 'Send Reset Link'} onPress={handleSend} loading={loading} fullWidth size="lg" />

        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <AppText variant="bodySmall" style={{ color: theme.colors.primary }}>Back to login</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xxxl },
  content: { flex: 1, paddingHorizontal: spacing.xxl, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  backBtn: { marginBottom: spacing.xl, paddingVertical: spacing.sm },
  form: { marginTop: spacing.xl, gap: spacing.lg },
  illustration: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  backLink: { alignItems: 'center', marginTop: spacing.xl },
});
