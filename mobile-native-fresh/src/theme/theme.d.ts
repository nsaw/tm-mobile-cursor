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
    xxl: number;
    xxxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      body: number;
      lg: number;
      xl: number;
      heading: number;
      '2xl': number;
      '3xl': number;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    heading2: {
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      textTransform: 'uppercase';
      letterSpacing: number;
    };
  };
  shadows: {
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
    inner: ViewStyle;
  };
  animations: {
    fast: number;
    normal: number;
    slow: number;
  };
  iconSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  zIndex: {
    base: number;
    card: number;
    overlay: number;
    modal: number;
    tooltip: number;
    toast: number;
  };
}

export interface ThemeVariants {
  buttonVariants: any;
  cardVariants: any;
  inputVariants: any;
  textVariants: any;
  badgeVariants: any;
}

export interface Theme {
  tokens: ThemeTokens;
  variants: ThemeVariants;
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
