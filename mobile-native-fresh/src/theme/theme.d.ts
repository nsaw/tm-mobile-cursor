import { TextStyle, ViewStyle } from 'react-native';

export interface TextVariant extends TextStyle {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  fontFamily: string;
  textTransform?: TextStyle['textTransform'];
}

export interface ThemeTokens {
  colors: {
    [key: string]: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextVariant;
    h2: TextVariant;
    h3: TextVariant;
    h4: TextVariant;
    body: TextVariant;
    caption: TextVariant;
  };
}

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeTokens {}
}
