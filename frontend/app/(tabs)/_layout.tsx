import { useCallback, useState } from 'react';
import { Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { House, Search, List, Bookmark, LucideIcon } from 'lucide-react-native';
import { BottomNavTabNameEnum, BottomNavTabName } from '../../types/bottom-nav-tab-enum';
import BottomNavTab from '@/components/tabs/BottomNavTab';

const TABS: { name: BottomNavTabName; icon: LucideIcon }[] = [
  { name: BottomNavTabNameEnum.HOME, icon: House },
  { name: BottomNavTabNameEnum.SEARCH, icon: Search },
  { name: BottomNavTabNameEnum.QUEUE, icon: List },
  { name: BottomNavTabNameEnum.DOWNLOADS, icon: Bookmark },
];

export default function TabLayout() {
  const [selectedTab, setSelectedTab] = useState<BottomNavTabName>(BottomNavTabNameEnum.HOME);

  const renderTabButton = useCallback(
    (name: BottomNavTabName, Icon: LucideIcon) => (props: any) => (
      <BottomNavTab
        {...props}
        icon={Icon}
        isSelected={selectedTab === name}
        onTabPress={() => {
          setSelectedTab(name);
        }}
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
