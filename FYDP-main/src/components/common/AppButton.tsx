import { ReactNode } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { fontFamilies, radius, spacing } from '../../constants/typography';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
}: AppButtonProps) {
  const { theme } = useThemeStore();

  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, fontSize: 14 },
    md: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: 16 },
    lg: { paddingVertical: spacing.xl, paddingHorizontal: spacing.xxl, fontSize: 18 },
  };

  const getBgColor = () => {
    if (disabled || loading) return theme.colors.textMuted;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'danger': return theme.colors.error;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return '#FFFFFF';
    if (variant === 'outline' || variant === 'ghost') return theme.colors.primary;
    return '#FFFFFF';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 2 : 0,
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          borderRadius: radius.lg,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {icon}
          <AppText
            variant="button"
            style={{
              color: getTextColor(),
              fontSize: sizeStyles[size].fontSize,
              fontFamily: fontFamilies.bold,
            }}
          >
            {title}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
});
