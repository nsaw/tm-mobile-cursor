export type ComponentVariant = 'primary'|'secondary'|'tertiary';
export type ComponentSize = 'xs'|'sm'|'md'|'lg'|'xl';
export type ComponentState = 'default'|'hover'|'active'|'disabled';
export interface ThemeConfig { colors: Record<string,string>; spacing: Record<ComponentSize,number>; radius: Record<ComponentSize,number>; }
export const defaultTheme: ThemeConfig = { colors:{primary:'#007AFF',secondary:'#5856D6'}, spacing:{xs:2,sm:4,md:8,lg:12,xl:16}, radius:{xs:2,sm:4,md:6,lg:8,xl:10} }; 