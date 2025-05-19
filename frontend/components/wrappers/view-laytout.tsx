import clsx from 'clsx';
import { FC } from 'react';
import { Platform, SafeAreaView } from 'react-native';

interface ViewLayoutProps {
  children: React.ReactNode;
}

const ViewLayout: FC<ViewLayoutProps> = ({ children }) => {
  return (
    <SafeAreaView
      className={clsx('flex-1 bg-coffee-black p-[14px]', Platform.OS === 'android' && 'pt-10')}>
      {children}
    </SafeAreaView>
  );
};

export default ViewLayout;
