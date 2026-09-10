import { themes, Theme } from '../constants/themes';
import { typography, fontFamilies } from '../constants/typography';

export type { Theme, ThemeColors } from '../constants/themes';

export function getTheme(name: string): Theme {
  return themes[name] || themes.ocean;
}

export { typography, fontFamilies };
export { themes } from '../constants/themes';
export { spacing, radius, shadows } from '../constants/typography';
