import axios from 'axios';
import { GATEWAY } from 'configs';
import { RequestUtils } from 'utils/profileRequest';
import {
  getBusinessInfo,
  saveBusinessInfo,
  uploadBusinessFiles,
} from './businessProfileService';

jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), defaults: {} }));
afterEach(() => jest.restoreAllMocks());

test('requires errorCode 200 and keeps the business request body wrapped', async () => {
  const userBusiness = { id: 5, name: 'Company' };
  const envelope = { errorCode: 200, data: userBusiness };
  const get = jest.spyOn(RequestUtils, 'Get').mockResolvedValue(envelope);
  const post = jest.spyOn(RequestUtils, 'Post').mockResolvedValue(envelope);
  await expect(getBusinessInfo(5)).resolves.toBe(envelope);
  expect(get).toHaveBeenCalledWith('/auth/user-bussiness/find-info', {
    bizId: 5,
  });
  await expect(saveBusinessInfo(userBusiness)).resolves.toBe(envelope);
  expect(post).toHaveBeenCalledWith('/auth/user-bussiness/save-info', {
    userBusiness,
  });
  get.mockResolvedValue({ success: true, errorCode: 500, message: 'Rejected' });
  await expect(getBusinessInfo(5)).rejects.toThrow('Rejected');
});

test('uploads all selected files once to the host gateway and reads files from the response body', async () => {
  const files = [
    new File(['a'], ' photo one.png '),
    new File(['b'], 'document two.pdf'),
  ];
  const result = {
    success: true,
    count: 2,
    files: ['test/a.png', 'test/b.pdf'],
  };
  axios.post.mockResolvedValue({ data: result });
  await expect(uploadBusinessFiles(files)).resolves.toBe(result);
  const [url, body, options] = axios.post.mock.calls[0];
  expect(url).toBe(`${GATEWAY}/erp/folder/multiple`);
  expect(body.getAll('files').map((file) => file.name)).toEqual([
    'photo-one.png',
    'document-two.pdf',
  ]);
  expect(body.get('folder')).toBe('test');
  expect(options.withCredentials).toBe(true);
  expect(axios.post).toHaveBeenCalledTimes(1);
});
