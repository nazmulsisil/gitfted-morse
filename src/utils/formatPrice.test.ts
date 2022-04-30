import { formatPrice } from './formatPrice';

describe('Price should be formatted correctly', () => {
  test('Format price from string', () => {
    const formatted = formatPrice('109');
    expect(formatted).toBe('$109');
  });

  test('Format price from number', () => {
    const formatted = formatPrice(109);
    expect(formatted).toBe('$109');
  });

  test('Format price from zero', () => {
    const formatted = formatPrice('0');
    expect(formatted).toBe('$0');
  });

  test('Format price from undefined', () => {
    // @ts-ignore
    const formatted = formatPrice();
    expect(formatted).toBe('');
  });

  test('Format price from null', () => {
    // @ts-ignore
    const formatted = formatPrice(null);
    expect(formatted).toBe('');
  });

  test('Format price from empty string', () => {
    const formatted = formatPrice('');
    expect(formatted).toBe('');
  });
});
