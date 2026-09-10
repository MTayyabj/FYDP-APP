import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { fontFamilies } from '../../constants/typography';

SplashScreen.preventAutoHideAsync();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore();

  const [fontsLoaded, fontError] = useFonts({
    [fontFamilies.regular]: Poppins_400Regular,
    [fontFamilies.medium]: Poppins_500Medium,
    [fontFamilies.semiBold]: Poppins_600SemiBold,
    [fontFamilies.bold]: Poppins_700Bold,
    [fontFamilies.extraBold]: Poppins_800ExtraBold,
    [fontFamilies.nunitoRegular]: Nunito_400Regular,
    [fontFamilies.nunitoBold]: Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
