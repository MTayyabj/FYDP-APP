import { ShopService } from '../../types/shop';
import { ShopItem, ShopCategory } from '../../types/shop';
import { mockShopItems, mockGems } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let currentGems = mockGems;
let inventory: ShopItem[] = mockShopItems.filter((i) => i.owned);

export const mockShopApi: ShopService = {
  async getShopItems(category?: ShopCategory): Promise<ShopItem[]> {
    await delay(500);
    if (category) return mockShopItems.filter((i) => i.category === category);
    return mockShopItems;
  },

  async purchaseItem(itemId: string): Promise<{ success: boolean; remainingGems: number }> {
    await delay(600);
    const item = mockShopItems.find((i) => i.id === itemId);
    if (!item) throw { success: false, message: 'Item not found.', code: 'ITEM_NOT_FOUND' };
    if (item.owned) return { success: true, remainingGems: currentGems };
    if (currentGems < item.price) {
      throw { success: false, message: 'Not enough gems to purchase this item.', code: 'INSUFFICIENT_GEMS' };
    }
    currentGems -= item.price;
    item.owned = true;
    inventory = [...inventory, item];
    return { success: true, remainingGems: currentGems };
  },

  async equipItem(itemId: string): Promise<void> {
    await delay(300);
    const item = mockShopItems.find((i) => i.id === itemId);
    if (!item) throw { success: false, message: 'Item not found.', code: 'ITEM_NOT_FOUND' };
    if (!item.owned) throw { success: false, message: 'You do not own this item.', code: 'NOT_OWNED' };
    mockShopItems.forEach((i) => {
      if (i.category === item.category) i.equipped = false;
    });
    item.equipped = true;
  },

  async getInventory(): Promise<ShopItem[]> {
    await delay(300);
    return inventory;
  },

  async getGems(): Promise<number> {
    await delay(200);
    return currentGems;
  },
};
