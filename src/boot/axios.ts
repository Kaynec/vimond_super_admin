import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useUserStore } from 'src/stores/User';
import { useQuasar } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const baseUrl = import.meta.env.VITE_API_URL;

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
export const instance = axios.create({
  baseURL: baseUrl,
  // 5 minutes
  timeout: 300000,
  headers: {}
});
instance.interceptors.request.use(config => {
  const token = useUserStore().token;
  if (token) config.headers['X-Access-Token'] = token;
  return config;
});
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status == 401)
      useUserStore().setToken('');
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = instance;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { instance as api };
