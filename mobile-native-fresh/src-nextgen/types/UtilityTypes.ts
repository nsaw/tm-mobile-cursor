export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (...args: unknown[]) => Promise<infer R> ? R : unknown;

export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type EventHandler<T = unknown> = (event: T) => void;

export type Callback<T = unknown> = (...args: T[]) => void;

export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

export type ID = string | number;

export type Timestamp = string | number;

export type Color = string;

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center'; 