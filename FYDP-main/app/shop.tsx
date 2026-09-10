import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { Badge } from '../../src/components/common/Badge';
import { Skeleton } from '../../src/components/common/Skeleton';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { shopService } from '../../src/services';
import { ShopItem, ShopCategory } from '../../src/types/shop';
import { ArrowLeft, Gem, Check, Lock, Sparkles } from 'lucide-react-native';

const categories: { id: ShopCategory; label: string }[] = [
  { id: 'characters', label: 'Characters' },
  { id: 'outfits', label: 'Outfits' },
  { id: 'hats', label: 'Hats' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'backgrounds', label: 'Backgrounds' },
  { id: 'badges', label: 'Badges' },
];

const rarityColors: Record<string, string> = {
  common: '#94A3B8',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#FBBF24',
};

const iconMap: Record<string, string> = {
  Bot: 'Bot', Rocket: 'Rocket', User: 'User', GraduationCap: 'GraduationCap',
  Code: 'Code', Compass: 'Compass', Crown: 'Crown', HardHat: 'HardHat',
  Sparkles: 'Sparkles', Glasses: 'Glasses', Feather: 'Feather',
  Galaxy: 'Galaxy', Palmtree: 'Palmtree', Medal: 'Medal',
};

export default function ShopScreen() {
  const { theme } = useThemeStore();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [gems, setGems] = useState(1250);
  const [activeCategory, setActiveCategory] = useState<ShopCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadShop = useCallback(async () => {
    setLoading(true);
    try {
      const [shopItems, currentGems] = await Promise.all([
        shopService.getShopItems(),
        shopService.getGems(),
      ]);
      setItems(shopItems);
      setGems(currentGems);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShop();
    setRefreshing(false);
  };

  const handlePurchase = (item: ShopItem) => {
    if (item.owned) return;
    if (gems < item.price) {
      Alert.alert('Not enough gems', `You need ${item.price - gems} more gems to purchase ${item.name}.`);
      return;
    }
    Alert.alert(
      'Confirm Purchase',
      `Buy ${item.name} for ${item.price} gems?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            try {
              const result = await shopService.purchaseItem(item.id);
              setGems(result.remainingGems);
              setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, owned: true } : i));
            } catch {
              Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleEquip = async (item: ShopItem) => {
    try {
      await shopService.equipItem(item.id);
      setItems((prev) => prev.map((i) =>
        i.category === item.category
          ? { ...i, equipped: i.id === item.id }
          : i
      ));
    } catch {
      Alert.alert('Equip failed', 'Something went wrong.');
    }
  };

  const filteredItems = activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <AppText variant="headingS">Shop</AppText>
        <View style={[styles.gemsBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Gem size={16} color="#06B6D4" />
          <AppText variant="label" style={{ color: '#06B6D4', marginLeft: spacing.xs }}>{gems}</AppText>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryTabs}>
        <TouchableOpacity
          onPress={() => setActiveCategory('all')}
          activeOpacity={0.7}
          style={[styles.categoryTab, activeCategory === 'all' && { backgroundColor: theme.colors.primary }]}
        >
          <AppText variant="label" style={{ color: activeCategory === 'all' ? '#FFFFFF' : theme.colors.textSecondary }}>All</AppText>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            activeOpacity={0.7}
            style={[styles.categoryTab, { backgroundColor: activeCategory === cat.id ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }, activeCategory !== cat.id && { borderWidth: 1 }]}
          >
            <AppText variant="label" style={{ color: activeCategory === cat.id ? '#FFFFFF' : theme.colors.textSecondary }}>{cat.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {loading ? (
          <View style={styles.shopGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} width="48%" height={180} radius={radius.lg} />
            ))}
          </View>
        ) : (
          <View style={styles.shopGrid}>
            {filteredItems.map((item) => {
              const rarityColor = rarityColors[item.rarity];
              return (
                <View
                  key={item.id}
                  style={[styles.shopItemCard, { backgroundColor: theme.colors.card, borderColor: rarityColor + '40' }, shadows.small]}
                >
                  {/* Rarity bar */}
                  <View style={[styles.rarityBar, { backgroundColor: rarityColor }]} />

                  {/* Preview */}
                  <View style={[styles.itemPreview, { backgroundColor: item.previewColor || theme.colors.surface }]}>
                    <Sparkles size={32} color="#FFFFFF" />
                  </View>

                  {/* Info */}
                  <View style={styles.itemInfo}>
                    <AppText variant="label" style={{ fontSize: 13 }} numberOfLines={1}>{item.name}</AppText>
                    <AppText variant="caption" style={{ color: theme.colors.textMuted, textTransform: 'capitalize' }}>{item.rarity}</AppText>
                  </View>

                  {/* Action */}
                  {item.owned ? (
                    item.equipped ? (
                      <View style={[styles.ownedBtn, { backgroundColor: theme.colors.success + '15' }]}>
                        <Check size={16} color={theme.colors.success} />
                        <AppText variant="caption" style={{ color: theme.colors.success, marginLeft: spacing.xs }}>Equipped</AppText>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleEquip(item)}
                        activeOpacity={0.7}
                        style={[styles.equipBtn, { backgroundColor: theme.colors.primary }]}
                      >
                        <AppText variant="label" style={{ color: '#FFFFFF', fontSize: 12 }}>Equip</AppText>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      onPress={() => handlePurchase(item)}
                      activeOpacity={0.7}
                      style={[styles.buyBtn, { backgroundColor: gems >= item.price ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }]}
                    >
                      <Gem size={14} color={gems >= item.price ? '#FFFFFF' : theme.colors.textMuted} />
                      <AppText variant="label" style={{ color: gems >= item.price ? '#FFFFFF' : theme.colors.textMuted, fontSize: 12, marginLeft: spacing.xs }}>
                        {item.price}
                      </AppText>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  gemsBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.round },
  categoryTabs: { paddingHorizontal: spacing.xxl, gap: spacing.sm, paddingBottom: spacing.md },
  categoryTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.round },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  shopItemCard: { width: '48%', borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', paddingBottom: spacing.md },
  rarityBar: { height: 3, width: '100%' },
  itemPreview: { height: 80, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  ownedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  equipBtn: { alignItems: 'center', marginHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  buyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1 },
});
