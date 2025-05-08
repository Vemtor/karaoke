import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { House, Search, List, Bookmark, LucideIcon } from 'lucide-react-native';
import { BottomNavTabNameEnum, BottomNavTabName } from '@/types/bottom-nav-tab-enum';
import BottomNavTab, { BottomNavTabProps } from '@/components/tabs/BottomNavTab';

const TABS: { name: BottomNavTabName; icon: LucideIcon }[] = [
  { name: BottomNavTabNameEnum.HOME, icon: House },
  { name: BottomNavTabNameEnum.SEARCH, icon: Search },
  { name: BottomNavTabNameEnum.QUEUE, icon: List },
  { name: BottomNavTabNameEnum.DOWNLOADS, icon: Bookmark },
];

export default function TabLayout() {
  const [selectedTab, setSelectedTab] = useState<BottomNavTabName>(BottomNavTabNameEnum.HOME);

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
<<<<<<< HEAD
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
=======
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
>>>>>>> origin/develop
    </Tabs>
  );
}
