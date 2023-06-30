<template>
  <div class="row" style="overflow: hidden;">
    <div class="col-md-7 row justify-center items-center content-center">
      <q-card>
        <q-card-section>
          <div class="q-mt-sm q-mr-sm full-width">ورود</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="login" class="q-col-gutter-md items-center row">
            <div class="col-12">
              <q-input
                label="نام کاربری"
                v-model="state.phone_number"
                filled
                standout="bg-teal text-white"
                bg-color="#ccc"
              >
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                type="password"
                label="رمز عبور"
                v-model="state.password"
                filled
                standout="bg-teal text-white"
                bg-color="#ccc"
              >
              </q-input>
            </div>
            <div class="col-12">
              <q-btn
                class="bg-primary text-white full-width"
                type="submit"
                label="ورود"
                :loading="loading"
              >
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-5 responsive-photo-login">
      <img class="photo-login" style="border-radius: 10px" src="../assets/login.jpg" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const q$ = useQuasar();

const loading = ref(false);

const state = ref({
  phone_number: '',
  password: ''
});

const router = useRouter();

import { instance } from '../boot/axios';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/User';
import { useRouter } from 'vue-router';
async function login () {
  loading.value = true;

  instance
    .post('/myadmin/login/', state.value)
    .then(r => {
      useUserStore().setToken(r.data.access_token);
      useUserStore().setRefreshToken(r.data.refresh_token);
      q$.notify({
        type: 'positive',
        message: 'ورود با موفقیت انجام شد'
      });

      router.push({ name: 'MainPage' });
    })
    .catch(e => {
      q$.notify({
        type: 'negative',
        message: 'نام کاربری یا رمز عبور اشتباه است'
      });
      return;
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
<style scoped>
.content-login {
  display: flex;
  flex-wrap: wrap;
  max-height: 100vh !important;
  overflow-y: hidden !important;
  background-color: #f1f1f1;
}
.photo-login {
  width: 100% !important;
  height: 100% !important;
  max-height: 100vh;
}
.sidebar {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
.user-Name {
  border: 1px solid #f1f1f1 !important;
  width: 95vw;
  max-width: 440px;
  height: 60px;
  border-radius: 10px;
  background-color: #f1f1f1 !important;
}
.password-user {
  border: 1px solid #f1f1f1 !important;
  width: 95vw;
  max-width: 440px;
  height: 60px;
  border-radius: 10px;
  background-color: #f1f1f1 !important;
}
.flex.show-error {
  background: #fff0f0;
  padding: 15px;
  color: #c96d6d;
  border-radius: 8px;
  justify-content: center;
}
.w-45.responsive-photo-login {
  height: 100vh;
}
.show-error-login {
  display: none;
}
/* responsive */
@media screen and (max-width: 600px) {
  .content-login.w-100 {
    min-height: 100vh;
    max-height: 100vh;
  }
  .responsive-photo-login {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .responsive-photo-login {
    display: none;
  }
}
@media only screen and (min-width: 820px) and (max-width: 1180px) {
  .content-login.w-100 {
    min-height: 100vh;
  }
  .responsive-photo-login {
    display: none;
  }
  .w-55.show-form-login {
    width: 100% !important;
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .content-login.w-100 {
    min-height: 100vh;
  }
  .responsive-photo-login {
    display: none;
  }
  .w-55.show-form-login {
    width: 100% !important;
  }
}
</style>
