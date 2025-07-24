const capitalize = require('../src/utils/capitalize');

test('capitalize capitalizes the first letter', () => {
  expect(capitalize('hello')).toBe('Hello');
  expect(capitalize('Hello')).toBe('Hello');
  expect(capitalize('')).toBe('');
}); 