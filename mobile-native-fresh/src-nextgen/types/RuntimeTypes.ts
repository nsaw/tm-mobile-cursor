export interface RuntimeTypeCheck {
  typeName: string;
  value: unknown;
  isValid: boolean;
  errors: string[];
}

export interface RuntimeTypeValidator {
  validate: (value: unknown) => RuntimeTypeCheck;
  isType: (value: unknown) => boolean;
}

export function createRuntimeValidator<T>(typeName: string, validator: (value: unknown) => value is T): RuntimeTypeValidator {
  return {
    validate: (value: unknown): RuntimeTypeCheck => {
      const isValid = validator(value);
      return {
        typeName,
        value,
        isValid,
        errors: isValid ? [] : [`Value does not match type ${typeName}`],
      };
    },
    isType: validator,
  };
}

export const runtimeValidators = {
  string: createRuntimeValidator('string', (value): value is string => typeof value === 'string'),
  number: createRuntimeValidator('number', (value): value is number => typeof value === 'number'),
  boolean: createRuntimeValidator('boolean', (value): value is boolean => typeof value === 'boolean'),
  object: createRuntimeValidator('object', (value): value is object => typeof value === 'object' && value !== null),
  array: createRuntimeValidator('array', (value): value is unknown[] => Array.isArray(value)),
}; 