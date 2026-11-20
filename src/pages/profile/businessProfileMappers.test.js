import axios from 'axios';
import {
  buildBusinessInfoPayload,
  toCertificateFile,
} from './businessProfileMappers';

const original = axios.defaults.baseURL;
afterEach(() => {
  axios.defaults.baseURL = original;
});

test('company logo metadata renders a full cookie-authenticated ERP URL', () => {
  axios.defaults.baseURL = '/api';
  const file = toCertificateFile({ fileName: 'brand/company.png' }, 0);
  expect(file.url).toBe(
    `${window.location.origin}/api/erp/folder/view/brand/company.png`,
  );
  expect(file.crossOrigin).toBe('use-credentials');
});

test('saving Profile retains the uploaded path instead of its display or preview URL', () => {
  axios.defaults.baseURL = '/api';
  const file = toCertificateFile(
    {
      uid: 'logo',
      status: 'done',
      url: 'blob:temporary',
      response: 'brand/company.png',
    },
    0,
  );
  expect(file.url).toBe(
    `${window.location.origin}/api/erp/folder/view/brand/company.png`,
  );
  const payload = buildBusinessInfoPayload({
    bizId: 1645,
    businessInfo: {},
    certificates: [],
    logoFile: file,
    values: { displayName: 'Company' },
  });
  expect(payload.logo).toBe('brand/company.png');
  expect(JSON.stringify(payload)).not.toContain('blob:');
});

test('separates a server-provided image URL from its stored filename', () => {
  axios.defaults.baseURL = '/api';
  const file = toCertificateFile(
    { fileName: 'brand/company.png', url: '/uploads/brand/company.png' },
    0,
  );
  expect(file.url).toBe(`${window.location.origin}/uploads/brand/company.png`);
  const payload = buildBusinessInfoPayload({
    bizId: 1645,
    businessInfo: {},
    certificates: [],
    logoFile: file,
    values: {},
  });
  expect(payload.logo).toBe('brand/company.png');
});
