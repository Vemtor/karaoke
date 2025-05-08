import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { RobotoMono_100Thin } from '@expo-google-fonts/roboto-mono/100Thin';
import { RobotoMono_200ExtraLight } from '@expo-google-fonts/roboto-mono/200ExtraLight';
import { RobotoMono_300Light } from '@expo-google-fonts/roboto-mono/300Light';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono/400Regular';
import { RobotoMono_500Medium } from '@expo-google-fonts/roboto-mono/500Medium';
import { RobotoMono_600SemiBold } from '@expo-google-fonts/roboto-mono/600SemiBold';
import { RobotoMono_700Bold } from '@expo-google-fonts/roboto-mono/700Bold';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    RobotoMono_100Thin,
    RobotoMono_200ExtraLight,
    RobotoMono_300Light,
    RobotoMono_400Regular,
    RobotoMono_500Medium,
    RobotoMono_600SemiBold,
    RobotoMono_700Bold,
  });

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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
