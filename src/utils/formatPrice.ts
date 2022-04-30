export const formatPrice = (price: number | string) => {
  if (price === null || price === undefined || price === '') return '';

  const formatted = +price;

  if (formatted === 0) return '$0';

  // handle all non-zero falsy values like NaN or ''
  if (!formatted) return '';

  return `$${price}`;
};
