import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { AppInput } from '../../src/components/common/AppInput';
import { spacing } from '../../src/constants/typography';
import { config } from '../../src/constants/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const { theme } = useThemeStore();
  const { login, loginWithGoogle, loginWithFacebook, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  const handleDemoLogin = async () => {
    setEmail(config.demoEmail);
    setPassword(config.demoPassword);
    try {
      await login(config.demoEmail, config.demoPassword);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Login failed', 'Could not log in with demo account.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithFacebook();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Login failed', `Could not log in with ${provider}.`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <AppText variant="headingXL">Welcome Back!</AppText>
        <AppText variant="body" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
          Log in to continue your learning journey
        </AppText>

        <View style={styles.form}>
          <AppInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Mail size={20} color={theme.colors.textMuted} />}
          />
          <AppInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            error={errors.password}
            leftIcon={<Lock size={20} color={theme.colors.textMuted} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={theme.colors.textMuted} /> : <Eye size={20} color={theme.colors.textMuted} />}
              </TouchableOpacity>
            }
          />
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
            <AppText variant="bodySmall" style={{ color: theme.colors.primary }}>
              Forgot password?
            </AppText>
          </TouchableOpacity>
        </View>

        <AppButton title={isLoading ? 'Logging in...' : 'Log In'} onPress={handleLogin} loading={isLoading} fullWidth size="lg" />

        <TouchableOpacity onPress={handleDemoLogin} style={styles.demoBtn}>
          <AppText variant="bodySmall" style={{ color: theme.colors.primary, textAlign: 'center' }}>
            Use demo account
          </AppText>
          <AppText variant="caption" style={{ color: theme.colors.textMuted, textAlign: 'center' }}>
            {config.demoEmail} / {config.demoPassword}
          </AppText>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <AppText variant="caption" style={{ color: theme.colors.textMuted, marginHorizontal: spacing.md }}>
            or continue with
          </AppText>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.socialBtn, { borderColor: theme.colors.border }]}
            onPress={() => handleSocialLogin('google')}
            activeOpacity={0.7}
          >
            <AppText variant="button" style={{ fontSize: 14 }}>Google</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialBtn, { borderColor: theme.colors.border }]}
            onPress={() => handleSocialLogin('facebook')}
            activeOpacity={0.7}
          >
            <AppText variant="button" style={{ fontSize: 14 }}>Facebook</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>
            Don't have an account?{' '}
          </AppText>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <AppText variant="bodySmall" style={{ color: theme.colors.primary, fontFamily: 'Poppins-SemiBold' }}>
              Sign up
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxxl },
  backBtn: { marginBottom: spacing.xl, paddingVertical: spacing.sm },
  form: { marginTop: spacing.xl, gap: spacing.lg },
  forgotBtn: { alignSelf: 'flex-end', paddingVertical: spacing.xs },
  demoBtn: { marginTop: spacing.lg, alignItems: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1 },
  socialButtons: { flexDirection: 'row', gap: spacing.md },
  socialBtn: { flex: 1, paddingVertical: spacing.lg, borderWidth: 1.5, borderRadius: 12, alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
});
