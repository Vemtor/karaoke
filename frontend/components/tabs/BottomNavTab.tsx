import React, { useRef, useEffect } from 'react';
import { GestureResponderEvent, Platform, Animated } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';

export interface BottomNavTabProps extends BottomTabBarButtonProps {
  icon: LucideIcon;
  isSelected: boolean;
  onTabPress: () => void;
}

export default function BottomNavTab({
  icon: Icon,
  isSelected,
  onTabPress,
  ...props
}: BottomNavTabProps) {
  const backgroundColorAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(backgroundColorAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isSelected, backgroundColorAnim]);

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.quartz, Colors['slate-gray']],
  });

  return (
    <Animated.View style={{ backgroundColor, flex: 1 }}>
      <PlatformPressable
        {...props}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 60 }}
        onPressIn={(ev: GestureResponderEvent) => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onTabPress();
          props.onPressIn?.(ev);
        }}>
        <Icon color={Colors.onyx} size={40} />
      </PlatformPressable>
    </Animated.View>
  );
}
