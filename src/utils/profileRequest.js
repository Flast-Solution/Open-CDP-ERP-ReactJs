import axios from 'axios';
import { GATEWAY } from 'configs';
import HostRequestUtils from './RequestUtils';

export const profileApiUrl = (path) => `${GATEWAY.replace(/\/+$/, '')}${path}`;

// Profile uses the legacy envelope semantics, independently of the strict dashboard API.
export class RequestUtils extends HostRequestUtils {
  static Delete(service, input = {}) {
    return axios
      .delete(profileApiUrl(service) + this.encodeQueryData(input))
      .then(({ data }) => data)
      .catch((error) => error);
  }
}
