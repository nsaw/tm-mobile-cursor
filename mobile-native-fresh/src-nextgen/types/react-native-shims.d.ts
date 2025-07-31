import type {ViewStyle,TextStyle,ImageStyle} from 'react-native';
export type StyleProp<T extends ViewStyle|TextStyle|ImageStyle>=T|T[]|null|undefined; 