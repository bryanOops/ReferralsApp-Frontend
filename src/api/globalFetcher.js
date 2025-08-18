// SWR/Fetch helpers con soporte de BASE URL

const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';

const buildUrl = (url) => {
  if (typeof url !== 'string') return url;
  // Si ya es absoluta, no modificar
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : '';
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const defaultHeaders = { 'Content-Type': 'application/json' };

const getFetcher = (url, options = {}) =>
  fetch(buildUrl(url), {
    method: 'GET',
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch the data');
    }
    return res.json();
  });

const postFetcher = (url, body, options = {}) =>
  fetch(buildUrl(url), {
    method: 'POST',
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to post data');
    }
    return res.json();
  });

const putFetcher = (url, body, options = {}) =>
  fetch(buildUrl(url), {
    method: 'PUT',
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to update data');
    }
    return res.json();
  });

const patchFetcher = (url, body, options = {}) =>
  fetch(buildUrl(url), {
    method: 'PATCH',
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to update data');
    }
    return res.json();
  });

const deleteFetcher = (url, body, options = {}) =>
  fetch(buildUrl(url), {
    method: 'DELETE',
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to delete data');
    }
    return res.json();
  });

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };
