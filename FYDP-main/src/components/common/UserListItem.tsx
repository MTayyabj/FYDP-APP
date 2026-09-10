import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { spacing, radius } from '../../constants/typography';
import { User } from '../../types/auth';
import { ChevronRight } from 'lucide-react-native';

interface UserListItemProps {
  user: User;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showBadges?: boolean;
  subtitle?: string;
}

export function UserListItem({ user, onPress, rightElement, showBadges = true, subtitle }: UserListItemProps) {
  const { theme } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: radius.lg,
        },
      ]}
    >
      <Avatar
        uri={user.avatar}
        name={user.displayName}
        size={48}
        showOnlineStatus={showBadges}
        isOnline={user.isOnline}
      />
      <View style={styles.info}>
        <AppText variant="headingS" style={{ fontSize: 16 }}>
          {user.displayName}
        </AppText>
        <AppText variant="caption" style={{ color: theme.colors.textMuted }}>
          {subtitle || `@${user.username}`}
        </AppText>
        {showBadges && (
          <View style={styles.badges}>
            <Badge type="level" value={`Lvl ${user.level}`} size="sm" />
            <Badge type="xp" value={`${user.xp} XP`} size="sm" />
          </View>
        )}
      </View>
      <View style={styles.right}>
        {rightElement || <ChevronRight size={20} color={theme.colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  right: {
    marginLeft: spacing.sm,
  },
});
