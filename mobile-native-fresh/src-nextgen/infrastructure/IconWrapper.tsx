import React from 'react';
import { TextProps } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

export type IconName = 
  | 'MaterialCommunityIcons'
  | 'Ionicons'
  | 'Feather'
  | 'FontAwesome'
  | 'Entypo'
  | 'AntDesign'
  | 'EvilIcons'
  | 'Fontisto'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export interface IconWrapperProps extends Omit<TextProps, 'children'> {
  name: IconName;
  iconName: string;
  size?: number;
  color?: string;
}

const iconComponents = {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  FontAwesome,
  Entypo,
  AntDesign,
  EvilIcons,
  Fontisto,
  Foundation,
  Octicons,
  SimpleLineIcons,
  Zocial,
} as const;

export const IconWrapper: React.FC<IconWrapperProps> = ({
  name,
  iconName,
  size = 24,
  color = '#000000',
  style,
  ...props
}) => {
  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    console.warn(`Icon component '${name}' not found`);
    return null;
  }
  
  return (
    <IconComponent
      name={iconName}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
}; 