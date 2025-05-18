import { Tabs } from 'expo-router';
import { Bookmark, House, List, LucideIcon, Search } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import BottomNavTab, { BottomNavTabProps } from '@/components/tabs/BottomNavTab';
import { BottomNavTabName } from '@/types/bottom-nav-tab-enum';

const TABS: { name: BottomNavTabName; icon: LucideIcon }[] = [
  { name: BottomNavTabName.HOME, icon: House },
  { name: BottomNavTabName.SEARCH, icon: Search },
  { name: BottomNavTabName.QUEUE, icon: List },
  { name: BottomNavTabName.DOWNLOADS, icon: Bookmark },
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
