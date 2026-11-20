import axios from 'axios';
import { imageCredentials, resolveImageUrl } from './imageUrl';
const original = axios.defaults.baseURL;
afterEach(() => {
  axios.defaults.baseURL = original;
});
test('resolves persisted logo metadata and API paths to full URLs', () => {
  axios.defaults.baseURL = 'https://api.example.com/api';
  expect(resolveImageUrl({ fileName: 'brand/logo.png' })).toBe(
    'https://api.example.com/api/erp/folder/view/brand/logo.png',
  );
  expect(resolveImageUrl('/api/erp/folder/view/brand/logo.png')).toBe(
    'https://api.example.com/api/erp/folder/view/brand/logo.png',
  );
  expect(
    imageCredentials(
      resolveImageUrl({ url: 'https://api.example.com/uploads/brand.png' }),
    ),
  ).toBe('use-credentials');
});
test('keeps local previews and external CDN URLs intact', () => {
  expect(resolveImageUrl('blob:https://example.com/image')).toBe(
    'blob:https://example.com/image',
  );
  expect(imageCredentials('blob:https://example.com/image')).toBeUndefined();
  expect(resolveImageUrl('https://cdn.example.com/brand.png')).toBe(
    'https://cdn.example.com/brand.png',
  );
  expect(imageCredentials('https://cdn.example.com/brand.png')).toBeUndefined();
});
test('does not persist a preview URL in place of the uploaded response path', () => {
  axios.defaults.baseURL = '/api';
  expect(
    resolveImageUrl({ url: 'blob:temporary', response: 'brand/logo.png' }),
  ).toBe(`${window.location.origin}/api/erp/folder/view/brand/logo.png`);
});

test('root uploads URLs follow the backend origin rather than the frontend origin', () => {
  axios.defaults.baseURL = 'https://api.example.com/api';
  expect(resolveImageUrl('/uploads/brand/logo.png')).toBe(
    'https://api.example.com/uploads/brand/logo.png',
  );
  expect(resolveImageUrl({ url: '/uploads/brand/logo.png' })).toBe(
    'https://api.example.com/uploads/brand/logo.png',
  );
});

test('persisted backend asset URLs use the active gateway so proxy login cookies apply', () => {
  axios.defaults.baseURL = '/api';
  expect(
    resolveImageUrl(
      'http://157.10.199.138:9080/api/erp/folder/view/brand/logo.png',
    ),
  ).toBe(`${window.location.origin}/api/erp/folder/view/brand/logo.png`);
  expect(
    resolveImageUrl('http://157.10.199.138:9080/uploads/brand/logo.png'),
  ).toBe(`${window.location.origin}/uploads/brand/logo.png`);
});

test('preserves a local file preview object before a server response exists', () => {
  expect(resolveImageUrl({ url: 'blob:local-file', originFileObj: {} })).toBe(
    'blob:local-file',
  );
});
