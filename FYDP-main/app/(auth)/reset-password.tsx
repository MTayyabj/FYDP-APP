import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { AppInput } from '../../src/components/common/AppInput';
import { spacing } from '../../src/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { authService } from '../../src/services';

export default function ResetPasswordScreen() {
  const { theme } = useThemeStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleReset = async () => {
    const newErrors: { password?: string; confirm?: string } = {};
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirm = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await authService.resetPassword('mock_token', password);
      Alert.alert('Success', 'Your password has been reset successfully.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch {
      Alert.alert('Error', 'Could not reset password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <AppText variant="headingXL">Reset Password</AppText>
        <AppText variant="body" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
          Enter your new password below.
        </AppText>

        <View style={styles.form}>
          <AppInput
            label="New Password"
            placeholder="Enter new password"
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
          <AppInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            error={errors.confirm}
            leftIcon={<Lock size={20} color={theme.colors.textMuted} />}
          />
        </View>

        <AppButton title={loading ? 'Resetting...' : 'Reset Password'} onPress={handleReset} loading={loading} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xxxl },
  backBtn: { marginBottom: spacing.xl, paddingVertical: spacing.sm },
  form: { marginTop: spacing.xl, gap: spacing.lg },
});
