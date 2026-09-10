import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { Character } from '../../src/components/common/Character';
import { AppCard } from '../../src/components/common/AppCard';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { ArrowLeft, Check, ShoppingBag, Shirt, Crown, Glasses, Image as ImageIcon } from 'lucide-react-native';

const characterColors: { id: string; name: string; color: string }[] = [
  { id: 'lumi_default', name: 'Sunny', color: '#FBBF24' },
  { id: 'lumi_blue', name: 'Ocean', color: '#0EA5E9' },
  { id: 'lumi_green', name: 'Forest', color: '#16A34A' },
  { id: 'lumi_pink', name: 'Bloom', color: '#EC4899' },
  { id: 'lumi_orange', name: 'Sunset', color: '#F97316' },
  { id: 'lumi_purple', name: 'Lavender', color: '#8B5CF6' },
  { id: 'lumi_teal', name: 'Teal', color: '#14B8A6' },
];

const outfits: { id: string; name: string }[] = [
  { id: 'outfit_default', name: 'Default' },
  { id: 'outfit_scholar', name: 'Scholar' },
  { id: 'outfit_coder', name: 'Coder' },
  { id: 'outfit_explorer', name: 'Explorer' },
  { id: 'outfit_adventurer', name: 'Adventurer' },
];

const accessories: { id: string; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'hat_crown', name: 'Crown' },
  { id: 'hat_cap', name: 'Cap' },
  { id: 'hat_wizard', name: 'Wizard Hat' },
  { id: 'acc_glasses', name: 'Glasses' },
];

const expressions: { id: 'happy' | 'excited' | 'proud' | 'thinking' | 'sad'; name: string }[] = [
  { id: 'happy', name: 'Happy' },
  { id: 'excited', name: 'Excited' },
  { id: 'proud', name: 'Proud' },
  { id: 'thinking', name: 'Thinking' },
  { id: 'sad', name: 'Sad' },
];

type Tab = 'character' | 'outfit' | 'accessory' | 'expression';

export default function CharacterCustomizeScreen() {
  const { theme } = useThemeStore();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('character');
  const [config, setConfig] = useState(user?.character || { characterId: 'lumi_default', outfit: 'outfit_default', accessory: 'none', background: 'bg_default', expression: 'happy' as const });
  const [saving, setSaving] = useState(false);

  const updateConfig = (key: 'characterId' | 'outfit' | 'accessory' | 'expression', value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    updateUser({ character: config });
    setSaving(false);
    router.back();
  };

  const tabs: { id: Tab; label: string; icon: typeof Shirt }[] = [
    { id: 'character', label: 'Character', icon: ShoppingBag },
    { id: 'outfit', label: 'Outfit', icon: Shirt },
    { id: 'accessory', label: 'Accessory', icon: Crown },
    { id: 'expression', label: 'Mood', icon: Glasses },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <AppText variant="headingS">Customize</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Preview */}
        <View style={[styles.previewCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.medium]}>
          <View style={[styles.previewBg, { backgroundColor: theme.colors.primaryLight }]}>
            <Character character={config} size={140} expression={config.expression as 'happy' | 'excited' | 'proud' | 'thinking' | 'sad'} />
          </View>
          <AppText variant="headingS" style={{ marginTop: spacing.md, textAlign: 'center' }}>
            {characterColors.find((c) => c.id === config.characterId)?.name || 'Lumi'}
          </AppText>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabSwitcher, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
                style={[styles.tab, activeTab === tab.id && { backgroundColor: theme.colors.primary }]}
              >
                <Icon size={16} color={activeTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary} />
                <AppText
                  variant="caption"
                  style={{ color: activeTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary, marginLeft: 4, fontSize: 11 }}
                >
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Options Grid */}
        {activeTab === 'character' && (
          <View style={styles.optionsGrid}>
            {characterColors.map((char) => {
              const selected = config.characterId === char.id;
              return (
                <TouchableOpacity
                  key={char.id}
                  onPress={() => updateConfig('characterId', char.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: selected ? theme.colors.primaryLight : theme.colors.card,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.colorPreview, { backgroundColor: char.color }]}>
                    {selected && <Check size={20} color="#FFFFFF" />}
                  </View>
                  <AppText variant="caption" style={{ textAlign: 'center', marginTop: spacing.xs }}>{char.name}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === 'outfit' && (
          <View style={styles.listOptions}>
            {outfits.map((outfit) => {
              const selected = config.outfit === outfit.id;
              return (
                <TouchableOpacity
                  key={outfit.id}
                  onPress={() => updateConfig('outfit', outfit.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.listOption,
                    {
                      backgroundColor: selected ? theme.colors.primaryLight : theme.colors.card,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <Shirt size={20} color={selected ? theme.colors.primary : theme.colors.textMuted} />
                  <AppText variant="body" style={{ flex: 1, marginLeft: spacing.md }}>{outfit.name}</AppText>
                  {selected && <Check size={20} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === 'accessory' && (
          <View style={styles.listOptions}>
            {accessories.map((acc) => {
              const selected = config.accessory === acc.id;
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => updateConfig('accessory', acc.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.listOption,
                    {
                      backgroundColor: selected ? theme.colors.primaryLight : theme.colors.card,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  {acc.id === 'none' ? <ImageIcon size={20} color={selected ? theme.colors.primary : theme.colors.textMuted} /> : <Crown size={20} color={selected ? theme.colors.primary : theme.colors.textMuted} />}
                  <AppText variant="body" style={{ flex: 1, marginLeft: spacing.md }}>{acc.name}</AppText>
                  {selected && <Check size={20} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === 'expression' && (
          <View style={styles.optionsGrid}>
            {expressions.map((expr) => {
              const selected = config.expression === expr.id;
              return (
                <TouchableOpacity
                  key={expr.id}
                  onPress={() => updateConfig('expression', expr.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: selected ? theme.colors.primaryLight : theme.colors.card,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.expressionPreview, { backgroundColor: theme.colors.surface }]}>
                    <Character
                      character={{ ...config, expression: expr.id }}
                      size={50}
                      expression={expr.id}
                    />
                  </View>
                  <AppText variant="caption" style={{ textAlign: 'center', marginTop: spacing.xs }}>{expr.name}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <AppButton
          title="Save Character"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          style={{ marginTop: spacing.xxl }}
        />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  previewCard: { borderRadius: radius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center' },
  previewBg: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  tabSwitcher: { flexDirection: 'row', padding: 4, borderRadius: radius.lg, borderWidth: 1, gap: 2, marginTop: spacing.lg },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, borderRadius: radius.md },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg, justifyContent: 'space-between' },
  optionCard: { width: '31%', flexGrow: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 2, alignItems: 'center' },
  colorPreview: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  expressionPreview: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  listOptions: { gap: spacing.sm, marginTop: spacing.lg },
  listOption: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 2 },
});
