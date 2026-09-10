import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { AppText } from './AppText';
import { spacing } from '../../constants/typography';
import { Character } from './Character';
import { CharacterConfig } from '../../types/auth';

interface StateProps {
  type: 'empty' | 'error' | 'loading';
  character?: CharacterConfig;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function StateView({ type, character, title, message, action }: StateProps) {
  const { theme } = useThemeStore();
  const expression = type === 'error' ? 'sad' : type === 'loading' ? 'thinking' : 'happy';

  return (
    <View style={styles.container}>
      <View style={[styles.characterWrap, { backgroundColor: theme.colors.background }]}>
        {character ? (
          <Character character={character} size={100} expression={expression} />
        ) : (
          <View style={[styles.circle, { backgroundColor: theme.colors.primaryLight }]}>
            <AppText variant="headingL" style={{ color: theme.colors.primary }}>
              {type === 'error' ? '!' : type === 'loading' ? '...' : ''}
            </AppText>
          </View>
        )}
      </View>
      <AppText variant="headingM" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
        {title}
      </AppText>
      {message && (
        <AppText
          variant="body"
          style={{ marginTop: spacing.sm, textAlign: 'center', color: theme.colors.textSecondary, maxWidth: 300 }}
        >
          {message}
        </AppText>
      )}
      {action && <View style={{ marginTop: spacing.xl }}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  characterWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
