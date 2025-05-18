import '@/global.css';

/* eslint-disable */
import { RobotoMono_100Thin } from '@expo-google-fonts/roboto-mono/100Thin';
import { RobotoMono_200ExtraLight } from '@expo-google-fonts/roboto-mono/200ExtraLight';
import { RobotoMono_300Light } from '@expo-google-fonts/roboto-mono/300Light';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono/400Regular';
import { RobotoMono_500Medium } from '@expo-google-fonts/roboto-mono/500Medium';
import { RobotoMono_600SemiBold } from '@expo-google-fonts/roboto-mono/600SemiBold';
import { RobotoMono_700Bold } from '@expo-google-fonts/roboto-mono/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
/* eslint-enable */

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  /* eslint-disable */
  const [loaded] = useFonts({
    RobotoMono100: RobotoMono_100Thin,
    RobotoMono200: RobotoMono_200ExtraLight,
    RobotoMono300: RobotoMono_300Light,
    RobotoMono400: RobotoMono_400Regular,
    RobotoMono500: RobotoMono_500Medium,
    RobotoMono600: RobotoMono_600SemiBold,
    RobotoMono700: RobotoMono_700Bold,
  });
  /* eslint-enable */
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
