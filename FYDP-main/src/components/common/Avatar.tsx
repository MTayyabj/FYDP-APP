import { Image, View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { AppText } from './AppText';
import { radius } from '../../constants/typography';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

export function Avatar({ uri, name, size = 48, showOnlineStatus, isOnline }: AvatarProps) {
  const { theme } = useThemeStore();
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <View style={{ position: 'relative', width: size, height: size }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.colors.primaryLight,
            },
          ]}
        >
          <AppText
            variant="headingS"
            style={{ color: theme.colors.primaryDark, fontSize: size * 0.35 }}
          >
            {initials}
          </AppText>
        </View>
      )}
      {showOnlineStatus && (
        <View
          style={[
            styles.onlineDot,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              borderColor: theme.colors.card,
              backgroundColor: isOnline ? theme.colors.success : theme.colors.textMuted,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
