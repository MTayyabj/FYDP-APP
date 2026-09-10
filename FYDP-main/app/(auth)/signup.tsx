import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { AppInput } from '../../src/components/common/AppInput';
import { spacing } from '../../src/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react-native';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#EF4444' };
  if (score <= 2) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { score: 3, label: 'Good', color: '#FBBF24' };
  if (score <= 4) return { score: 4, label: 'Strong', color: '#22C55E' };
  return { score: 5, label: 'Very Strong', color: '#16A34A' };
}

export default function SignupScreen() {
  const { theme } = useThemeStore();
  const { signup, loginWithGoogle, loginWithFacebook, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  const handleSignup = async () => {
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!username) newErrors.username = 'Username is required';
    if (!email || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!acceptedTerms) newErrors.terms = 'Please accept the terms and conditions';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await signup({ fullName, username, email, password });
      router.replace('/(auth)/verify-email');
    } catch {
      Alert.alert('Signup failed', 'Could not create your account. Please try again.');
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithFacebook();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Signup failed', `Could not sign up with ${provider}.`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <AppText variant="headingXL">Create Account</AppText>
        <AppText variant="body" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
          Start your learning adventure today
        </AppText>

        <View style={styles.form}>
          <AppInput label="Full Name" placeholder="Alex Rivera" value={fullName} onChangeText={setFullName} error={errors.fullName} leftIcon={<User size={20} color={theme.colors.textMuted} />} />
          <AppInput label="Username" placeholder="alex123" value={username} onChangeText={setUsername} autoCapitalize="none" error={errors.username} leftIcon={<User size={20} color={theme.colors.textMuted} />} />
          <AppInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} leftIcon={<Mail size={20} color={theme.colors.textMuted} />} />
          <AppInput
            label="Password"
            placeholder="Create a password"
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
          {password.length > 0 && (
            <View style={styles.strengthBar}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthSegment,
                      { backgroundColor: i <= strength.score ? strength.color : theme.colors.border },
                    ]}
                  />
                ))}
              </View>
              <AppText variant="caption" style={{ color: strength.color }}>{strength.label}</AppText>
            </View>
          )}
          <AppInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            leftIcon={<Lock size={20} color={theme.colors.textMuted} />}
          />

          <TouchableOpacity style={styles.termsRow} onPress={() => setAcceptedTerms(!acceptedTerms)} activeOpacity={0.7}>
            <View style={[styles.checkbox, { borderColor: acceptedTerms ? theme.colors.primary : theme.colors.border, backgroundColor: acceptedTerms ? theme.colors.primary : 'transparent' }]}>
              {acceptedTerms && <Check size={16} color="#FFFFFF" />}
            </View>
            <AppText variant="bodySmall" style={{ flex: 1, color: theme.colors.textSecondary }}>
              I agree to the Terms & Conditions and Privacy Policy
            </AppText>
          </TouchableOpacity>
          {errors.terms && <AppText variant="caption" style={{ color: theme.colors.error }}>{errors.terms}</AppText>}
        </View>

        <AppButton title={isLoading ? 'Creating account...' : 'Sign Up'} onPress={handleSignup} loading={isLoading} fullWidth size="lg" />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <AppText variant="caption" style={{ color: theme.colors.textMuted, marginHorizontal: spacing.md }}>or sign up with</AppText>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialBtn, { borderColor: theme.colors.border }]} onPress={() => handleSocialSignup('google')} activeOpacity={0.7}>
            <AppText variant="button" style={{ fontSize: 14 }}>Google</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { borderColor: theme.colors.border }]} onPress={() => handleSocialSignup('facebook')} activeOpacity={0.7}>
            <AppText variant="button" style={{ fontSize: 14 }}>Facebook</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>Already have an account? </AppText>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <AppText variant="bodySmall" style={{ color: theme.colors.primary, fontFamily: 'Poppins-SemiBold' }}>Log in</AppText>
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
  form: { marginTop: spacing.lg, gap: spacing.lg },
  strengthBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1 },
  socialButtons: { flexDirection: 'row', gap: spacing.md },
  socialBtn: { flex: 1, paddingVertical: spacing.lg, borderWidth: 1.5, borderRadius: 12, alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
});
