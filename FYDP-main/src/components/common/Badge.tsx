import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { AppText } from './AppText';
import { spacing, radius } from '../../constants/typography';
import { Flame, Star, Zap, Trophy } from 'lucide-react-native';

interface BadgeProps {
  type: 'streak' | 'xp' | 'level' | 'gems';
  value: string | number;
  size?: 'sm' | 'md';
}

export function Badge({ type, value, size = 'md' }: BadgeProps) {
  const { theme } = useThemeStore();

  const config = {
    streak: { icon: Flame, color: '#F97316', bg: '#FFF7ED' },
    xp: { icon: Zap, color: '#FBBF24', bg: '#FFFBEB' },
    level: { icon: Star, color: theme.colors.primary, bg: theme.colors.background },
    gems: { icon: Trophy, color: '#06B6D4', bg: '#ECFEFF' },
  };

  const { icon: Icon, color, bg } = config[type];
  const iconSize = size === 'sm' ? 14 : 18;
  const padding = size === 'sm' ? spacing.xs : spacing.sm;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, paddingHorizontal: padding, paddingVertical: padding, borderRadius: radius.round },
      ]}
    >
      <Icon size={iconSize} color={color} />
      <AppText
        variant="label"
        style={{ color, marginLeft: spacing.xs, fontSize: size === 'sm' ? 12 : 14 }}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
