export type ShopCategory =
  | 'characters'
  | 'outfits'
  | 'hats'
  | 'accessories'
  | 'backgrounds'
  | 'badges';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  price: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
  equipped: boolean;
  previewColor?: string;
}

export interface ShopService {
  getShopItems(category?: ShopCategory): Promise<ShopItem[]>;
  purchaseItem(itemId: string): Promise<{ success: boolean; remainingGems: number }>;
  equipItem(itemId: string): Promise<void>;
  getInventory(): Promise<ShopItem[]>;
  getGems(): Promise<number>;
}
