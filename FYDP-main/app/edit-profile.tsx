import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../src/store/themeStore';
import { useAuthStore } from '../src/store/authStore';
import { AppText } from '../src/components/common/AppText';
import { AppButton } from '../src/components/common/AppButton';
import { AppInput } from '../src/components/common/AppInput';
import { Avatar } from '../src/components/common/Avatar';
import { AppCard } from '../src/components/common/AppCard';
import { spacing, radius, shadows } from '../src/constants/typography';
import { userService } from '../src/services';
import { ArrowLeft, Camera, Check } from 'lucide-react-native';

export default function EditProfileScreen() {
  const { theme } = useThemeStore();
  const { user, updateUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await userService.updateUser(user.id, {
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
      });
      updateUser({
        displayName: updated.displayName,
        username: updated.username,
        bio: updated.bio,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error
    }
    setSaving(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <AppText variant="headingS">Edit Profile</AppText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
              <Avatar name={displayName || 'User'} size={88} showOnlineStatus isOnline={user?.isOnline} />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={[styles.changeAvatarBtn, { backgroundColor: theme.colors.primary }]}>
              <Camera size={16} color="#FFFFFF" />
              <AppText variant="label" style={{ color: '#FFFFFF', marginLeft: spacing.xs }}>Change Photo</AppText>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <AppInput
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your display name"
              maxLength={30}
            />
            <View style={{ height: spacing.lg }} />
            <AppInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="your_username"
              autoCapitalize="none"
              maxLength={20}
            />
            <View style={{ height: spacing.lg }} />
            <AppInput
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself..."
              multiline
              maxLength={150}
              containerStyle={{ minHeight: 80 }}
            />
            <AppText variant="caption" style={{ color: theme.colors.textMuted, textAlign: 'right', marginTop: spacing.xs }}>
              {bio.length}/150
            </AppText>
          </View>

          {/* Account Info */}
          <AppCard padding="md" style={{ marginTop: spacing.lg }}>
            <AppText variant="label" style={{ color: theme.colors.textSecondary }}>Email</AppText>
            <AppText variant="body" style={{ marginTop: spacing.xs }}>{user?.email || 'N/A'}</AppText>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AppText variant="label" style={{ color: theme.colors.textSecondary }}>Member Since</AppText>
            <AppText variant="body" style={{ marginTop: spacing.xs }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </AppText>
          </AppCard>

          {/* Save Button */}
          <AppButton
            title={saved ? 'Saved!' : 'Save Changes'}
            onPress={handleSave}
            variant={saved ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            loading={saving}
            icon={saved ? <Check size={20} color="#FFFFFF" /> : undefined}
            style={{ marginTop: spacing.xxl }}
          />

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarRing: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  changeAvatarBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.round, marginTop: spacing.md },
  form: { marginTop: spacing.lg },
  divider: { height: 1, marginVertical: spacing.md },
});
