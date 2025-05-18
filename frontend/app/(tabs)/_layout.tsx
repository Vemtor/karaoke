import { Tabs } from 'expo-router';
import { Bookmark, House, List, LucideIcon, Search } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
<<<<<<< HEAD
import { Tabs } from 'expo-router';
import { House, Search, List, Bookmark, LucideIcon, MicVocal } from 'lucide-react-native';
import { BottomNavTabNameEnum, BottomNavTabName } from '@/types/bottom-nav-tab-enum';
=======

>>>>>>> origin/develop
import BottomNavTab, { BottomNavTabProps } from '@/components/tabs/BottomNavTab';
import { BottomNavTabName } from '@/types/bottom-nav-tab-enum';

const TABS: { name: BottomNavTabName; icon: LucideIcon }[] = [
<<<<<<< HEAD
  { name: BottomNavTabNameEnum.HOME, icon: House },
  { name: BottomNavTabNameEnum.SEARCH, icon: Search },
  { name: BottomNavTabNameEnum.QUEUE, icon: List },
  { name: BottomNavTabNameEnum.DOWNLOADS, icon: Bookmark },
  { name: BottomNavTabNameEnum.KARAOKE, icon: MicVocal },
=======
  { name: BottomNavTabName.HOME, icon: House },
  { name: BottomNavTabName.SEARCH, icon: Search },
  { name: BottomNavTabName.QUEUE, icon: List },
  { name: BottomNavTabName.DOWNLOADS, icon: Bookmark },
>>>>>>> origin/develop
];

export default function TabLayout() {
  const [selectedTab, setSelectedTab] = useState<BottomNavTabName>(BottomNavTabName.HOME);

  const renderTabButton = useCallback(
    (name: BottomNavTabName, icon: LucideIcon) =>
      // eslint-disable-next-line
      (props: Omit<BottomNavTabProps, 'isSelected' | 'onTabPress' | 'icon'>) => (
        <BottomNavTab
          {...props}
          icon={icon}
          isSelected={selectedTab === name}
          onTabPress={() => setSelectedTab(name)}
        />
      ),
    [selectedTab],
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {
            minHeight: 60,
            borderTopWidth: 0,
          },
        }),
      }}>
      {TABS.map(({ name, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarButton: renderTabButton(name, icon),
          }}
        />
      ))}
    </Tabs>
  );
}
