import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { radius } from '../../constants/typography';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({ progress, height = 8, color, trackColor, style }: ProgressBarProps) {
  const { theme } = useThemeStore();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor || theme.colors.border,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color || theme.colors.primary,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
