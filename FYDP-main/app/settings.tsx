import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { usePreferencesStore } from '../../src/store/preferencesStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { spacing, radius } from '../../src/constants/typography';
import { themes } from '../../src/constants/themes';
import { ArrowLeft, Bell, Volume2, Sparkles, Eye, UserPlus, CircleUser, Palette, LogOut, ChevronRight, Shield, HelpCircle, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, currentTheme, setTheme } = useThemeStore();
  const { preferences, updatePreferences } = usePreferencesStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/welcome'); } },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <AppText variant="headingS">Settings</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <SectionLabel label="Account" />
        <AppCard padding="none">
          <SettingRow
            icon={CircleUser}
            label="Edit Profile"
            onPress={() => router.push('/edit-profile')}
            theme={theme}
          />
          <SettingRow
            icon={Palette}
            label="Customize Character"
            onPress={() => router.push('/character-customize')}
            theme={theme}
            isLast
          />
        </AppCard>

        {/* Preferences Section */}
        <SectionLabel label="Preferences" />
        <AppCard padding="none">
          <SettingRow
            icon={Bell}
            label="Notifications"
            theme={theme}
            rightElement={
              <Switch
                value={preferences.notificationsEnabled}
                onValueChange={(v) => updatePreferences({ notificationsEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
          <SettingRow
            icon={Volume2}
            label="Sound Effects"
            theme={theme}
            rightElement={
              <Switch
                value={preferences.soundEnabled}
                onValueChange={(v) => updatePreferences({ soundEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
          <SettingRow
            icon={Sparkles}
            label="Animations"
            theme={theme}
            rightElement={
              <Switch
                value={preferences.animationsEnabled}
                onValueChange={(v) => updatePreferences({ animationsEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
            isLast
          />
        </AppCard>

        {/* Privacy Section */}
        <SectionLabel label="Privacy" />
        <AppCard padding="none">
          <SettingRow
            icon={Eye}
            label="Profile Visibility"
            theme={theme}
            rightElement={
              <TouchableOpacity
                onPress={() => updatePreferences({ profileVisibility: preferences.profileVisibility === 'public' ? 'private' : 'public' })}
                activeOpacity={0.7}
                style={[styles.visibilityToggle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              >
                <AppText variant="caption" style={{ color: theme.colors.textSecondary, textTransform: 'capitalize' }}>
                  {preferences.profileVisibility}
                </AppText>
              </TouchableOpacity>
            }
          />
          <SettingRow
            icon={UserPlus}
            label="Friend Requests"
            theme={theme}
            rightElement={
              <Switch
                value={preferences.friendRequestsEnabled}
                onValueChange={(v) => updatePreferences({ friendRequestsEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
          <SettingRow
            icon={Eye}
            label="Show Online Status"
            theme={theme}
            rightElement={
              <Switch
                value={preferences.showOnlineStatus}
                onValueChange={(v) => updatePreferences({ showOnlineStatus: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
            isLast
          />
        </AppCard>

        {/* Theme Section */}
        <SectionLabel label="Appearance" />
        <AppCard padding="md">
          <AppText variant="label" style={{ color: theme.colors.textSecondary, marginBottom: spacing.md }}>Theme</AppText>
          <View style={styles.themeGrid}>
            {Object.values(themes).map((t) => (
              <TouchableOpacity
                key={t.name}
                onPress={() => setTheme(t.name)}
                activeOpacity={0.7}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: t.colors.surface,
                    borderColor: currentTheme === t.name ? t.colors.primary : theme.colors.border,
                    borderWidth: currentTheme === t.name ? 3 : 1,
                  },
                ]}
              >
                <View style={styles.themeColorRow}>
                  <View style={[styles.themeColorDot, { backgroundColor: t.colors.primary }]} />
                  <View style={[styles.themeColorDot, { backgroundColor: t.colors.secondary }]} />
                  <View style={[styles.themeColorDot, { backgroundColor: t.colors.accent }]} />
                </View>
                <AppText variant="caption" style={{ color: t.colors.text, textAlign: 'center', marginTop: spacing.xs }}>
                  {t.displayName}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </AppCard>

        {/* About Section */}
        <SectionLabel label="About" />
        <AppCard padding="none">
          <SettingRow
            icon={Info}
            label="App Version"
            theme={theme}
            rightElement={<AppText variant="caption" style={{ color: theme.colors.textMuted }}>1.0.0</AppText>}
          />
          <SettingRow
            icon={HelpCircle}
            label="Help & Support"
            theme={theme}
            onPress={() => {}}
          />
          <SettingRow
            icon={Shield}
            label="Privacy Policy"
            theme={theme}
            onPress={() => {}}
            isLast
          />
        </AppCard>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={{ marginTop: spacing.xxl }}>
          <AppCard padding="md" style={{ borderColor: theme.colors.error + '40' }}>
            <View style={styles.logoutRow}>
              <LogOut size={20} color={theme.colors.error} />
              <AppText variant="body" style={{ color: theme.colors.error, marginLeft: spacing.md }}>Log Out</AppText>
            </View>
          </AppCard>
        </TouchableOpacity>

        {user && (
          <AppText variant="caption" style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: spacing.lg }}>
            Signed in as {user.email}
          </AppText>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  const { theme } = useThemeStore();
  return (
    <View style={styles.sectionLabel}>
      <AppText variant="label" style={{ color: theme.colors.textSecondary, textTransform: 'uppercase', fontSize: 11 }}>{label}</AppText>
    </View>
  );
}

function SettingRow({
  icon: Icon,
  label,
  onPress,
  rightElement,
  theme,
  isLast,
}: {
  icon: typeof Bell;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  theme: ReturnType<typeof useThemeStore.getState>['theme'];
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={[
        styles.settingRow,
        { borderBottomColor: theme.colors.border },
        !isLast && { borderBottomWidth: 1 },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
        <Icon size={18} color={theme.colors.primary} />
      </View>
      <AppText variant="body" style={{ flex: 1 }}>{label}</AppText>
      {rightElement || (onPress && <ChevronRight size={20} color={theme.colors.textMuted} />)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  sectionLabel: { marginTop: spacing.xl, marginBottom: spacing.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  settingIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  visibilityToggle: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.md, borderWidth: 1 },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  themeCard: { width: '31%', flexGrow: 1, padding: spacing.md, borderRadius: radius.lg, alignItems: 'center' },
  themeColorRow: { flexDirection: 'row', gap: 6 },
  themeColorDot: { width: 18, height: 18, borderRadius: 9 },
  logoutRow: { flexDirection: 'row', alignItems: 'center' },
});
