import axios from 'axios';
import { GATEWAY } from 'configs';
import { RequestUtils, profileApiUrl } from './profileRequest';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));
afterEach(() => jest.resetAllMocks());

test('inherits the host gateway and envelope for legacy GET and POST requests', async () => {
  const envelope = { errorCode: 200, data: { id: 5 } };
  axios.get.mockResolvedValue({ data: envelope });
  axios.post.mockResolvedValue({ data: envelope });
  await expect(
    RequestUtils.Get('/auth/user-bussiness/find-info', { bizId: 5 }),
  ).resolves.toBe(envelope);
  expect(axios.get).toHaveBeenCalledWith(
    `${GATEWAY}/auth/user-bussiness/find-info?bizId=5`,
  );
  const body = { id: 7, sipExt: '1001' };
  await expect(
    RequestUtils.Post('/auth/user-bussiness/save-user', body, { id: 7 }),
  ).resolves.toBe(envelope);
  expect(axios.post).toHaveBeenCalledWith(
    `${GATEWAY}/auth/user-bussiness/save-user?id=7`,
    body,
  );
});

test('adds DELETE with the same legacy envelope and transport error semantics', async () => {
  const envelope = { errorCode: 200, data: null };
  axios.delete.mockResolvedValueOnce({ data: envelope });
  await expect(RequestUtils.Delete('/omni/channel-account/7')).resolves.toBe(
    envelope,
  );
  expect(axios.delete).toHaveBeenCalledWith(
    profileApiUrl('/omni/channel-account/7'),
  );
  const failure = new Error('Network error');
  axios.delete.mockRejectedValueOnce(failure);
  await expect(RequestUtils.Delete('/omni/channel-account/7')).resolves.toBe(
    failure,
  );
});
