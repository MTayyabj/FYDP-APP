import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { AppText } from './AppText';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  radius?: number;
}

export function Skeleton({ width = '100%', height = 16, radius = 8 }: SkeletonProps) {
  const { theme } = useThemeStore();
  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius: radius, backgroundColor: theme.colors.border },
      ]}
    />
  );
}

export function LoadingSpinner({ message }: { message?: string }) {
  const { theme } = useThemeStore();
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <AppText variant="bodySmall" style={{ marginTop: 12, color: theme.colors.textSecondary }}>
          {message}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
