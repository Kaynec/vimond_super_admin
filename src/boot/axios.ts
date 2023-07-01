import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useUserStore } from 'src/stores/User';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

async function logUserOut () {
  useUserStore().setToken('');
}

function convertError (error: string) {
  let newError = '';
  switch (error.trim()) {
    case 'user with this phone number already exists.':
      newError = 'شماره وارد شده قبلا ثبت نام شده است';
      return newError;
    case 'you have open request wait for result of that':
      newError = 'منتظر حواب درخواست خود باشید';
      return newError;
    case 'Invalid credentails':
      newError = 'شماره موبایل یا رمز عبور اشتباه است';
      return newError;
    case 'you should verified your phone_number':
      newError = 'لطفا شماره همراه خود را وریفای کنید';
      return newError;
    case 'challenge capacity is full ':
      newError = 'ظرفیت چالش پر شده است';
      return newError;
    case 'duel capacity is full':
      newError = 'ظرفیت دوئل پر شده است';
      return newError;
    case 'you have open request wait for result of that':
      newError = 'لطفا تا بررسی درخواست خود صبر کنید';
      return newError;
    case 'you have send request before wait for coach':
      newError = 'لطفا تا بررسی درخواست خود صبر کنید';
      return newError;
    case 'you have a coach before':
      newError = 'شما با کوچ دیگری در ارتباط هستید';
      return newError;
    case 'coach has been reject you':
      newError = 'درخواست ارتباط شما رد شده است';
      return newError;
    case 'this space has been taken':
      newError = 'بازه تکراری را حذف کنید';
      return newError;
    case 'user not found':
      newError = 'کاربری با مشخصات داده شده پیدا نشد';
      return newError;
    case 'user with this national code already exists.':
      newError = 'کاربری با این کد ملی وجود دارد';
      return newError;
    case 'this is not a valid national_code':
      newError = 'کد ملی وارد شده معتبر نیست';
      return newError;
    case 'login limitation is full':
      newError = 'لطفا برای استفاده از دیگر نسخه های اپلیکیشن خارج شوید';
      return newError;
    case 'the code expired request for new one':
      newError = 'کد بازیابی منقظی شده است';
      return newError;
    case 'this code is not correct  or user not found':
      newError = 'کد بازیابی اشتباه  است';
      return newError;
    case 'user is not active':
      newError = 'لطفا اکانت خود را وریفای کنید';
      return newError;
    case 'request exists':
      newError = 'درخواست شما قبلا ثبت شده است';
      return newError;
    case 'not found':
      error;
    case 'package discount is not 100':
      error;
    case 'Not found.':
      error;

    default:
      return error;
  }
}

function isJsonString (str: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
function extractError (context: any) {
  const contextData = isJsonString(context?.response?.data ?? '');
  let error = '';

  if (typeof contextData === 'string') {
    error = contextData;
  } else if (!Array.isArray(contextData) && typeof contextData === 'object') {
    error = [...Object.values(contextData)]?.[0] as string;
  } else if (Array.isArray(contextData)) {
    error = [...Object.values(contextData?.[0])]?.[0] as string;
  }

  //
  if (typeof error === 'object')
    error = [...Object.values(error)]?.[0] as string;
  if (Array.isArray(error)) error = [...error]?.[0] as string;

  return error;
}

const handleError = async (context: any) => {
  if (!context || !context?.response?.data) return context;

  // Initiall Error
  let error = extractError(context);

  // Show Error Here Instead of Another Place
  error = convertError(error);

  if (
    // register first
    error === 'Not found.' ||
    error === 'not found' ||
    error === 'this user exsits' ||
    error === 'request is not correct'
  ) {
    // in THis Case Don't Show Any Error
    return context;
  }
  // if it's a url we don't wanna show error
  try {
    //
    if (new URL(`${error}`)) {
      error = '';
      return context;
    }
  } catch (error) {}
  if (
    (context?.response?.status === 403 && error === 'unauthenticated') ||
    error === 'Authentication credentials were not provided.'
  ) {
    return logUserOut();
  }
  Notify.create({
    type: 'negative',
    message: error || 'خطایی در دریافت اطلاعات رخ داده است'
  });
  return context;
};

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
    const ctx = handleError(error)
    if (error.response && error.response.status == 401)
      useUserStore().setToken('');
    return Promise.reject(ctx);
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
