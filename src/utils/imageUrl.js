import axios from 'axios';
import { GATEWAY } from 'configs';
import {
  resolveRuntimeAssetUrl,
  resolveUploadUrl,
} from 'containers/PreviewModal/uploadUtils';

// Persist server URLs, not object URLs. Keep local preview/data URLs usable before upload.
export const resolveImageUrl = (value) => {
  const localPreview = value?.url || value?.thumbUrl || '';
  const source =
    typeof value === 'string' && /^(?:https?:|data:|blob:|\/)/i.test(value)
      ? resolveRuntimeAssetUrl(value)
      : resolveUploadUrl(value) ||
        (/^(?:blob:|data:)/i.test(localPreview) ? localPreview : '');
  if (!source || /^(?:data:|blob:)/i.test(source)) return source;
  try {
    const url = new URL(source, window.location.origin);
    const api = new URL(
      axios.defaults.baseURL || GATEWAY,
      window.location.origin,
    );
    // Managed ERP assets follow the current API gateway, including its login cookies.
    // Persisted direct backend URLs must not bypass the development cookie proxy.
    if (/^\/api\/(?:erp|upload)\/folder\/view(?:\/|$)/i.test(url.pathname)) {
      return new URL(
        resolveRuntimeAssetUrl(`${url.pathname}${url.search}${url.hash}`),
        api.origin,
      ).href;
    }
    if (/^\/uploads(?:\/|$)/i.test(url.pathname)) {
      return new URL(`${url.pathname}${url.search}${url.hash}`, api.origin)
        .href;
    }
    return url.href;
  } catch {
    return '';
  }
};

export const imageCredentials = (source) => {
  if (!source || /^(?:data:|blob:)/i.test(source)) return undefined;
  try {
    const url = new URL(source, window.location.origin);
    const api = new URL(
      axios.defaults.baseURL || GATEWAY,
      window.location.origin,
    );
    return [api.origin, window.location.origin].includes(url.origin)
      ? 'use-credentials'
      : undefined;
  } catch {
    return undefined;
  }
};
