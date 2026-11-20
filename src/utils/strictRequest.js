import axios from 'axios';
import { GATEWAY } from 'configs';

// Share the host's Axios defaults/interceptors (including its authenticated session).
// Unlike the legacy request helper, HTTP/network failures must reject.
export const RequestUtils = {
  strict: {
    async get(path) {
      const { data } = await axios.get(`${GATEWAY.replace(/\/$/, '')}${path}`, {
        timeout: 15000,
        withCredentials: true,
      });
      return data;
    },
  },
};
