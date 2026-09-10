import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { radius, shadows, spacing } from '../../constants/typography';

interface AppCardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onPress?: () => void;
}

export function AppCard({ children, style, elevated, padding = 'md' }: AppCardProps) {
  const { theme } = useThemeStore();

  const paddingValue = {
    sm: spacing.sm,
    md: spacing.lg,
    lg: spacing.xl,
    none: 0,
  }[padding];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: radius.lg,
          padding: paddingValue,
          borderColor: theme.colors.border,
        },
        elevated && { ...shadows.medium, backgroundColor: theme.colors.cardElevated },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
