export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Nullable<T> = T | null;

export type Undefinable<T> = T | undefined;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type EventHandler<T = any> = (event: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

export type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export type ThrottledFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type ExtractState<T> = T extends React.ComponentClass<any, infer S> ? S : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type TupleToUnion<T extends readonly any[]> = T[number];

export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

export type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

export type FunctionParameters<T> = T extends (...args: infer P) => any ? P : never; 