<template>
  <q-layout
    class="bg-page window-height"
    style="overflow: auto"
    view="hHh lpR fFf"
  >
    <div
      class="bg-primary text-white show-on-desktop"
      style="position: fixed !important; width: 13rem"
    >
      <ul
        style="list-style: none; padding-top: 8rem"
        class="column window-height q-col-gutter-xl"
      >
        <li style="padding: 1.5rem 0.7rem !important">
          <router-link
            style="text-decoration: none"
            to="/dashboard"
            class="items-center flex text-white"
            exact-active-class="active"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 2.5H7.5C6.125 2.5 5 3.625 5 5V25C5 26.375 6.125 27.5 7.5 27.5H22.5C23.875 27.5 25 26.375 25 25V10L17.5 2.5ZM22.5 25H7.5V5H16.25V11.25H22.5V25ZM11.25 16.25V23.75H8.75V16.25H11.25ZM18.75 18.75V23.75H21.25V18.75H18.75ZM13.75 13.75V23.75H16.25V13.75H13.75Z"
                fill="white"
              />
            </svg>
            <span> گزارش ساز </span>
          </router-link>
        </li>
        <li style="padding: 1.5rem 0.7rem !important">
          <router-link
            style="text-decoration: none"
            to="/didehban"
            class="items-center flex self-start"
            exact-active-class="active"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6.25H7.5C6.83696 6.25 6.20107 6.51339 5.73223 6.98223C5.26339 7.45107 5 8.08696 5 8.75V23.75C5 24.413 5.26339 25.0489 5.73223 25.5178C6.20107 25.9866 6.83696 26.25 7.5 26.25H14.6212M22.5 17.5V22.5H27.5M22.5 13.75V8.75C22.5 8.08696 22.2366 7.45107 21.7678 6.98223C21.2989 6.51339 20.663 6.25 20 6.25H17.5"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 13.75H15M10 18.75H13.75M10 6.25C10 5.58696 10.2634 4.95107 10.7322 4.48223C11.2011 4.01339 11.837 3.75 12.5 3.75H15C15.663 3.75 16.2989 4.01339 16.7678 4.48223C17.2366 4.95107 17.5 5.58696 17.5 6.25C17.5 6.91304 17.2366 7.54893 16.7678 8.01777C16.2989 8.48661 15.663 8.75 15 8.75H12.5C11.837 8.75 11.2011 8.48661 10.7322 8.01777C10.2634 7.54893 10 6.91304 10 6.25ZM17.5 22.5C17.5 23.8261 18.0268 25.0979 18.9645 26.0355C19.9021 26.9732 21.1739 27.5 22.5 27.5C23.8261 27.5 25.0979 26.9732 26.0355 26.0355C26.9732 25.0979 27.5 23.8261 27.5 22.5C27.5 21.1739 26.9732 19.9021 26.0355 18.9645C25.0979 18.0268 23.8261 17.5 22.5 17.5C21.1739 17.5 19.9021 18.0268 18.9645 18.9645C18.0268 19.9021 17.5 21.1739 17.5 22.5Z"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-white"> دیده بان </span>
          </router-link>
        </li>
        <li style="padding: 1.5rem 0.7rem !important">
          <router-link
            style="text-decoration: none"
            to="/users"
            class="items-center flex self-start"
            exact-active-class="active"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 -960 960 960"
              fill="white"
            >
              <path
                d="M38-160v-94q0-35 18-63.5t50-42.5q73-32 131.5-46T358-420q62 0 120 14t131 46q32 14 50.5 42.5T678-254v94H38Zm700 0v-94q0-63-32-103.5T622-423q69 8 130 23.5t99 35.5q33 19 52 47t19 63v94H738ZM358-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42Zm360-150q0 66-42 108t-108 42q-11 0-24.5-1.5T519-488q24-25 36.5-61.5T568-631q0-45-12.5-79.5T519-774q11-3 24.5-5t24.5-2q66 0 108 42t42 108ZM98-220h520v-34q0-16-9.5-31T585-306q-72-32-121-43t-106-11q-57 0-106.5 11T130-306q-14 6-23 21t-9 31v34Zm260-321q39 0 64.5-25.5T448-631q0-39-25.5-64.5T358-721q-39 0-64.5 25.5T268-631q0 39 25.5 64.5T358-541Zm0 321Zm0-411Z"
              />
            </svg>
            <span class="text-white"> کاربران </span>
          </router-link>
        </li>
        <li
          style="padding: 1.5rem 0.7rem !important; cursor: pointer"
          @click="
            () => {
              store.setToken(''), $router.replace('login');
            }
          "
          class="items-center flex self-start"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.495 2.80488C15.8162 2.28238 17.5 4.27738 17.5 6.24988V23.7499C17.5 25.7224 15.8162 27.7174 13.495 27.1949C7.9175 25.9399 3.75 20.9574 3.75 14.9999C3.75 9.04238 7.9175 4.05988 13.495 2.80488ZM20.3662 10.3661C20.6007 10.1318 20.9185 10.0001 21.25 10.0001C21.5815 10.0001 21.8993 10.1318 22.1338 10.3661L25.8838 14.1161C26.1181 14.3505 26.2497 14.6684 26.2497 14.9999C26.2497 15.3313 26.1181 15.6492 25.8838 15.8836L22.1338 19.6336C21.898 19.8613 21.5822 19.9873 21.2545 19.9845C20.9268 19.9816 20.6132 19.8502 20.3815 19.6184C20.1497 19.3866 20.0183 19.0731 20.0154 18.7454C20.0126 18.4176 20.1386 18.1019 20.3662 17.8661L21.9825 16.2499H11.25C10.9185 16.2499 10.6005 16.1182 10.3661 15.8838C10.1317 15.6493 10 15.3314 10 14.9999C10 14.6684 10.1317 14.3504 10.3661 14.116C10.6005 13.8816 10.9185 13.7499 11.25 13.7499H21.9825L20.3662 12.1336C20.1319 11.8992 20.0003 11.5813 20.0003 11.2499C20.0003 10.9184 20.1319 10.6005 20.3662 10.3661Z"
              fill="white"
            />
          </svg>
          <span> خروج از حساب کاربری </span>
        </li>
      </ul>
    </div>
    <q-page-container class="container fit q-px-lg desktop">
      <q-page class="fit">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/User';
const store = useUserStore();
</script>

<style lang="scss" scoped>
.bg-page {
  background: $page-background;
}
.active {
  border-left: 4px solid red;
}

.show-on-desktop {
  display: none;
}

@media screen and (min-width: 850px) {
  .show-on-desktop {
    display: block;
    width: 220px;
  }
  .desktop {
    width: calc(100vw - 220px);
  }
}
</style>
