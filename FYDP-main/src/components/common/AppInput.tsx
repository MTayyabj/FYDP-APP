import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { fontFamilies, radius, spacing } from '../../constants/typography';
import { AppText } from './AppText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function AppInput({ label, error, rightIcon, leftIcon, style, containerStyle, ...props }: AppInputProps) {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText variant="label" style={{ marginBottom: spacing.xs, color: theme.colors.textSecondary }}>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, fontFamily: fontFamilies.regular },
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <AppText variant="caption" style={{ color: theme.colors.error, marginTop: spacing.xs }}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    minHeight: 52,
  },
  leftIcon: {
    paddingLeft: spacing.md,
  },
  rightIcon: {
    paddingRight: spacing.md,
  },
});
