/**
 * TypeTesting - Test data generators and testing utilities
 * Provides utilities for generating test data and validating types in tests
 */

import { typeValidator } from './TypeValidation';

export interface TestDataGenerator<T> {
  generate(): T;
  generateInvalid(): unknown;
  generateEdgeCases(): T[];
}

export class TypeTesting {
  private static instance: TypeTesting;

  private constructor() {}

  static getInstance(): TypeTesting {
    if (!TypeTesting.instance) {
      TypeTesting.instance = new TypeTesting();
    }
    return TypeTesting.instance;
  }

  // String generators
  generateString(options?: { minLength?: number; maxLength?: number; pattern?: RegExp }): string {
    const minLength = options?.minLength || 1;
    const maxLength = options?.maxLength || 10;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  generateEmail(): string {
    const username = this.generateString({ minLength: 3, maxLength: 10 });
    const domain = this.generateString({ minLength: 2, maxLength: 8 });
    const tld = ['com', 'org', 'net', 'io', 'co'][Math.floor(Math.random() * 5)];
    return `${username}@${domain}.${tld}`;
  }

  generateURL(): string {
    const protocol = ['http', 'https'][Math.floor(Math.random() * 2)];
    const domain = this.generateString({ minLength: 3, maxLength: 10 });
    const tld = ['com', 'org', 'net', 'io', 'co'][Math.floor(Math.random() * 5)];
    return `${protocol}://${domain}.${tld}`;
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Number generators
  generateNumber(options?: { min?: number; max?: number; integer?: boolean }): number {
    const min = options?.min || 0;
    const max = options?.max || 100;
    const value = Math.random() * (max - min) + min;
    return options?.integer ? Math.floor(value) : value;
  }

  generateInteger(options?: { min?: number; max?: number }): number {
    return this.generateNumber({ ...options, integer: true });
  }

  generateFloat(options?: { min?: number; max?: number; precision?: number }): number {
    const value = this.generateNumber(options);
    const precision = options?.precision || 2;
    return parseFloat(value.toFixed(precision));
  }

  // Boolean generators
  generateBoolean(): boolean {
    return Math.random() > 0.5;
  }

  // Array generators
  generateArray<T>(
    itemGenerator: () => T,
    options?: { minLength?: number; maxLength?: number }
  ): T[] {
    const minLength = options?.minLength || 0;
    const maxLength = options?.maxLength || 5;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    const result: T[] = [];
    for (let i = 0; i < length; i++) {
      result.push(itemGenerator());
    }
    return result;
  }

  generateStringArray(options?: { minLength?: number; maxLength?: number; itemOptions?: { minLength?: number; maxLength?: number } }): string[] {
    return this.generateArray(
      () => this.generateString(options?.itemOptions),
      { minLength: options?.minLength, maxLength: options?.maxLength }
    );
  }

  generateNumberArray(options?: { minLength?: number; maxLength?: number; itemOptions?: { min?: number; max?: number } }): number[] {
    return this.generateArray(
      () => this.generateNumber(options?.itemOptions),
      { minLength: options?.minLength, maxLength: options?.maxLength }
    );
  }

  // Object generators
  generateObject<T extends Record<string, unknown>>(
    schema: Record<string, () => unknown>
  ): T {
    const result: Record<string, unknown> = {};
    for (const [key, generator] of Object.entries(schema)) {
      result[key] = generator();
    }
    return result as T;
  }

  generateUser(): { id: string; name: string; email: string; age: number } {
    return this.generateObject({
      id: () => this.generateUUID(),
      name: () => this.generateString({ minLength: 2, maxLength: 20 }),
      email: () => this.generateEmail(),
      age: () => this.generateInteger({ min: 18, max: 100 }),
    });
  }

  generateThoughtmark(): { id: string; title: string; content: string; userId: string; createdAt: string } {
    return this.generateObject({
      id: () => this.generateUUID(),
      title: () => this.generateString({ minLength: 5, maxLength: 50 }),
      content: () => this.generateString({ minLength: 10, maxLength: 200 }),
      userId: () => this.generateUUID(),
      createdAt: () => new Date().toISOString(),
    });
  }

  generateBin(): { id: string; name: string; userId: string; thoughtmarkIds: string[] } {
    return this.generateObject({
      id: () => this.generateUUID(),
      name: () => this.generateString({ minLength: 3, maxLength: 30 }),
      userId: () => this.generateUUID(),
      thoughtmarkIds: () => this.generateArray(() => this.generateUUID(), { minLength: 0, maxLength: 10 }),
    });
  }

  generateTask(): { id: string; title: string; completed: boolean; priority: 'low' | 'medium' | 'high' } {
    return this.generateObject({
      id: () => this.generateUUID(),
      title: () => this.generateString({ minLength: 5, maxLength: 100 }),
      completed: () => this.generateBoolean(),
      priority: () => ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    });
  }

  // Date generators
  generateDate(options?: { start?: Date; end?: Date }): Date {
    const start = options?.start || new Date('2020-01-01');
    const end = options?.end || new Date();
    const time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(time);
  }

  generateDateString(options?: { start?: Date; end?: Date }): string {
    return this.generateDate(options).toISOString();
  }

  // Invalid data generators
  generateInvalidString(): unknown {
    const invalidTypes = [null, undefined, 123, true, {}, [], () => {}];
    return invalidTypes[Math.floor(Math.random() * invalidTypes.length)];
  }

  generateInvalidNumber(): unknown {
    const invalidTypes = [null, undefined, 'not a number', true, {}, [], () => {}];
    return invalidTypes[Math.floor(Math.random() * invalidTypes.length)];
  }

  generateInvalidEmail(): unknown {
    const invalidEmails = [
      'notanemail',
      '@domain.com',
      'user@',
      'user@domain',
      'user domain.com',
      123,
      null,
      undefined,
    ];
    return invalidEmails[Math.floor(Math.random() * invalidEmails.length)];
  }

  generateInvalidURL(): unknown {
    const invalidURLs = [
      'notaurl',
      'http://',
      'https://',
      'ftp://invalid',
      '://domain.com',
      123,
      null,
      undefined,
    ];
    return invalidURLs[Math.floor(Math.random() * invalidURLs.length)];
  }

  generateInvalidUUID(): unknown {
    const invalidUUIDs = [
      'not-a-uuid',
      '12345678-1234-1234-1234-123456789012',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      '12345678-1234-1234-1234-12345678901',
      123,
      null,
      undefined,
    ];
    return invalidUUIDs[Math.floor(Math.random() * invalidUUIDs.length)];
  }

  // Edge case generators
  generateStringEdgeCases(): string[] {
    return [
      '', // Empty string
      ' ', // Single space
      'a', // Single character
      'a'.repeat(1000), // Very long string
      '🚀', // Emoji
      '中文', // Non-ASCII
      'test\nnewline', // With newline
      'test\ttab', // With tab
      'test\r\ncrlf', // With CRLF
      'test"quote', // With quote
      "test'quote", // With single quote
      'test\\backslash', // With backslash
    ];
  }

  generateNumberEdgeCases(): number[] {
    return [
      0,
      -0,
      1,
      -1,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_VALUE,
      Number.MIN_VALUE,
      Infinity,
      -Infinity,
      NaN,
    ];
  }

  generateDateEdgeCases(): Date[] {
    return [
      new Date(0), // Unix epoch
      new Date('1970-01-01T00:00:00.000Z'),
      new Date('9999-12-31T23:59:59.999Z'),
      new Date('1900-01-01T00:00:00.000Z'),
      new Date('invalid'), // Invalid date
    ];
  }

  // Test data generators for specific types
  createTestDataGenerator<T>(
    generator: () => T,
    invalidGenerator: () => unknown,
    edgeCaseGenerator: () => T[]
  ): TestDataGenerator<T> {
    return {
      generate: generator,
      generateInvalid: invalidGenerator,
      generateEdgeCases: edgeCaseGenerator,
    };
  }

  // Utility methods
  generateRandomChoice<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  generateRandomSubset<T>(items: T[], options?: { minCount?: number; maxCount?: number }): T[] {
    const minCount = options?.minCount || 0;
    const maxCount = options?.maxCount || items.length;
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Validation helpers
  validateGeneratedData<T>(
    generator: () => T,
    validator: (value: unknown) => boolean,
    count: number = 100
  ): { valid: number; invalid: number; successRate: number } {
    let valid = 0;
    let invalid = 0;

    for (let i = 0; i < count; i++) {
      const data = generator();
      if (validator(data)) {
        valid++;
      } else {
        invalid++;
      }
    }

    return {
      valid,
      invalid,
      successRate: valid / count,
    };
  }
}

// Export singleton instance
export const typeTester = TypeTesting.getInstance(); 