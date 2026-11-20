import axios from 'axios';
import { GATEWAY } from 'configs';
import { RequestUtils } from './strictRequest';

jest.mock('axios', () => ({ get: jest.fn() }));

afterEach(() => jest.resetAllMocks());

test.each([
  '/erp/dashboard/monthly-sales-summary',
  '/erp/dashboard/manufacture-weekly-summary',
  '/erp/dashboard/business-alerts',
  '/finance/debt-report',
])('uses the host gateway and returns exactly the envelope for %s', async (path) => {
  const envelope = { errorCode: 200, success: true, data: { report: true } };
  axios.get.mockResolvedValue({ data: envelope });
  await expect(RequestUtils.strict.get(path)).resolves.toBe(envelope);
  expect(axios.get).toHaveBeenCalledWith(`${GATEWAY.replace(/\/$/, '')}${path}`, {
    timeout: 15000,
    withCredentials: true,
  });
});

test('propagates HTTP/network failures instead of resolving them as data', async () => {
  const error = new Error('Network Error');
  axios.get.mockRejectedValue(error);
  await expect(RequestUtils.strict.get('/finance/debt-report')).rejects.toBe(error);
});
