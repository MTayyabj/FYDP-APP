import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/src/components/common/ThemeProvider';
import { useThemeStore } from '@/src/store/themeStore';

export default function RootLayout() {
  useFrameworkReady();
  const { theme } = useThemeStore();

  return (
    <ThemeProvider>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[lessonId]" />
        <Stack.Screen name="test/[levelId]" />
        <Stack.Screen name="test-result" />
        <Stack.Screen name="friend/[userId]" />
        <Stack.Screen name="chatbot" />
        <Stack.Screen name="shop" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="character-customize" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
