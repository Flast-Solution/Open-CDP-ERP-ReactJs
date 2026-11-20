/**************************************************************************/
/*  @/services/omniService.js                                             */
/**************************************************************************/
/*                       Tệp này là một phần của:                         */
/*                             Open CDP                                   */
/*                        https://flast.vn                                */
/**************************************************************************/
/* REST cho các kênh trong Profile; không khởi tạo inbox hoặc socket.     */
/**************************************************************************/

import { CHANNEL_TYPE } from 'store/omniStore';
import { RequestUtils } from 'utils/profileRequest';
import { SUCCESS_CODE } from 'configs';
import { normalizeOmniTime } from 'utils/omniMessageTime';

const isTimeKey = (key) =>
  /(At|_at)$/.test(key) || key === 'timestamp' || key === 'time';

/* 10 chữ số = giây, 13 chữ số = mili giây. Mốc 10^11 nằm giữa hai
 * khoảng nên phân biệt được mà không cần BE nói trước. */
const toISO = normalizeOmniTime;

/* Đi đệ quy qua payload, chỉ đụng vào trường thời gian.
 * Giữ nguyên mảng, object lồng nhau và mọi kiểu dữ liệu khác. */
export const normalizeTimes = (input) => {
  if (Array.isArray(input)) {
    return input.map(normalizeTimes);
  }
  if (input === null || typeof input !== 'object') {
    return input;
  }
  /* Date, File, FormData... không phải object dữ liệu thuần */
  if (input instanceof Date || input instanceof Blob) {
    return input;
  }

  const out = {};
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (isTimeKey(key)) {
      out[key] = toISO(value);
      return;
    }
    out[key] = normalizeTimes(value);
  });
  return out;
};

const unwrap = (res) => {
  const { data, errorCode, message } = res || {};
  if (errorCode === SUCCESS_CODE) {
    return normalizeTimes(data);
  }
  const err = new Error(message || 'Có lỗi xảy ra');
  err.errorCode = errorCode;
  err.payload = data;
  throw err;
};

export const omniApi = {
  fetchChannels: () => RequestUtils.Get('/omni/channel-account').then(unwrap),
  startConnect: async (channelType) => {
    const path = channelType === CHANNEL_TYPE.ZALO_OA ? 'zalo' : 'fb';
    return RequestUtils.Get(`/omni/oauth/${path}/authorize-url`).then(unwrap);
  },
  disconnectChannel: (channelAccountId) =>
    RequestUtils.Post(
      `/omni/channel-account/${channelAccountId}/disconnect`,
    ).then(unwrap),
  deleteChannel: (channelAccountId) =>
    RequestUtils.Delete(`/omni/channel-account/${channelAccountId}`).then(
      unwrap,
    ),
};
