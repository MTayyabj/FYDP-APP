import { ReactNode } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { fontFamilies } from '../../constants/typography';

type Variant = 'headingXL' | 'headingL' | 'headingM' | 'headingS' | 'body' | 'bodySmall' | 'caption' | 'button' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  children: ReactNode;
}

const variantFonts: Record<Variant, string> = {
  headingXL: fontFamilies.extraBold,
  headingL: fontFamilies.bold,
  headingM: fontFamilies.bold,
  headingS: fontFamilies.semiBold,
  body: fontFamilies.regular,
  bodySmall: fontFamilies.regular,
  caption: fontFamilies.regular,
  button: fontFamilies.bold,
  label: fontFamilies.semiBold,
};

const variantSizes: Record<Variant, number> = {
  headingXL: 32,
  headingL: 26,
  headingM: 22,
  headingS: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  button: 16,
  label: 13,
};

const variantLineHeights: Record<Variant, number> = {
  headingXL: 40,
  headingL: 34,
  headingM: 30,
  headingS: 26,
  body: 24,
  bodySmall: 20,
  caption: 18,
  button: 22,
  label: 18,
};

export function AppText({ variant = 'body', color, style, children, ...props }: AppTextProps) {
  const { theme } = useThemeStore();
  const textColor = color || theme.colors.text;

  return (
    <Text
      style={[
        {
          fontFamily: variantFonts[variant],
          fontSize: variantSizes[variant],
          lineHeight: variantLineHeights[variant],
          color: textColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
