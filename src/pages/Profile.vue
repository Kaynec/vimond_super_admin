<script setup lang="ts">
import logo from '../assets/logo.png';
import { useRoute, useRouter } from 'vue-router';
import { instance as axios, instance } from '../boot/axios';
import { grades } from './grades';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import { requiredIf } from '@vuelidate/validators';
import { required } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';
import { minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useQuasar } from 'quasar';
import { newDate , format } from 'date-fns-jalali';

import provinces from '../assets/provinces.json';
import cities from '../assets/cities.json';

const $q = useQuasar();

const router = useRouter();

const id = useRoute().query.id;

const model = reactive({
  user: {
    firstname: '',
    lastname: '',
    birthdate: '',
    profile_image: '' as unknown as File,
    phone_number: '',
    gender: 'پسر'
  },
  mother_phone_number: '',
  father_phone_number: '',
  teacher_phone_number: '',
  province: '',
  city: '',
  school_name: '',
  grade: '',
  sheba_number: '',
  password: ''
});
const img = ref<string | File>(model.user.profile_image || logo);
onMounted(async () => {
  if (!id) return;
  const { data } = await axios(`/myadmin/student-list/${id}/`);
  // const { mother_phone_number , father_phone_number , teacher_phone_number , province , city , school_name , grade , sheba_number , password  } = data
  for (let [key, value] of Object.entries(data)) {
    model[key] = value;
  }
  model.user.birthdate = format(new Date(model.user.birthdate) , 'yyyy-MM-dd');
  console.log(model.user.birthdate);
  (model.user.gender as any) === 1 ? model.user.gender  = 'پسر' : model.user.gender = 'دختر'
});

const fileRef = ref();

const schools = computedAsync(async () => {
  const res = await instance.get('/school/school-list/');
  if (res.data) return res.data;
  return [];
}, []);

function toggleClick(e: any) {
  const file = e.target?.files?.[0];
  if (!file) return;
  img.value = URL.createObjectURL(file);
  console.log(img.value);
  model.user.profile_image = file;
}

onBeforeUnmount(() => {
  URL.revokeObjectURL(img.value as any);
});

const limitSize = (value: any) => {
  if (value && value.size) return value.size < 10485760;
  return true;
};

const computedCities = computed(() => {
  return cities.filter(el => el.province_id === (model.province as any)?.id);
});

const showThisWhileUplading = ref(false);


console.log( newDate(+'1402/04/10'.split('/')[0] , +'1402/04/10'.split('/')[1] , +'1402/04/10'.split('/')[2]) )

const form = ref();

const onSubmit = async () => {
  const DataToPost = JSON.parse(JSON.stringify(model));

  DataToPost.province = DataToPost.province.name;
  DataToPost.city = DataToPost.city.name;
  DataToPost.grade = DataToPost.grade.id;
  DataToPost.school_name = DataToPost.school_name.id;
  DataToPost.user.gender = DataToPost.user.gender.id;
  DataToPost.user.password = DataToPost.password;

  const {profile_image , ...rest} = DataToPost.user
  DataToPost.user = rest


  DataToPost.user.birthdate = newDate(
    +DataToPost.user.birthdate.split('/')[0],
    +DataToPost.user.birthdate.split('/')[1],
    +DataToPost.user.birthdate.split('/')[2]
  ).toISOString().split('T')[0]

  try {
    const { data, statusText } = await instance.post(
      '/student/register/',
      DataToPost
    );

    showThisWhileUplading.value = false;

    if (typeof model.user.profile_image !== 'string') {
      const fm = new FormData();
      frameElement?.append(
        'user.profile_image',
        model.user.profile_image as any
      );
      await instance.patch(`/myadmin/student-list/${data.id}/`, fm, {
        headers: {
          'Content-Type': 'multipart/formdata'
        }
      });
    }

    if (statusText === 'ok') {
      console.log(data);
      $q.notify({
        type: 'positive',
        message: 'کاربر با موفقیت ویرایش شد'
      });
      router.push({ name: 'Profile' });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: Object.values(error as Record<string, any>)[0] as string
    });
  }
};
</script>
<template>
  <q-form
    @submit.prevent="onSubmit"
    class="row q-px-sm q-pt-md q-col-gutter-sm"
    ref="form"
    :readonly="id"
  >
    <input type="file" @change="toggleClick" class="hidden" ref="fileRef" />
    <div class="col-12 row items-end">
      <img
        style="aspect-ratio: 1; max-width: 15rem"
        :src="img"
        alt="profile image"
      />
      <q-btn
        @click="fileRef.click()"
        style="background: #b1dc68; margin-right: 1rem; margin-bottom: 0.8rem"
        class="text-white q-py-md q-px-xl"
      >
        افزودن تصویر
      </q-btn>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        v-model="model.user.firstname"
        label="نام"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'لطفا نام خود را وارد کنید']"
      ></q-input>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        v-model="model.user.lastname"
        label="نام خانوادگی"
        lazy-rules
        :rules="[
          val => (val && val.length > 0) || 'لطفا نام خانوادگی خود را وارد کنید'
        ]"
      ></q-input>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-select
        class="col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب جنسیت"
        v-model="model.user.gender"
        :options="[
          {
            label: 'پسر',
            value: 1
          },
          {
            label: 'دختر',
            value: 2
          }
        ]"
        option-label="label"
        option-value="value"
      >
      </q-select>
    </div>
    <div class="col-xs-12 col-md-6">
      <q-input
        filled
        v-model="model.user.birthdate"
        label="تاریخ تولد"
        mask="date"
        calendaar="persian"
        standout="bg-teal text-white"
        bg-color="white"
        input-class=""
        lazy-rules
        :rules="[
          val => (val && val.length > 0) || 'لطفا  تاریخ تولد خود را وارد کنید'
        ]"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="model.user.birthdate"
                calendar="persian"
                today-btn
              >
                <div class="row flex-center">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-select
        :options="provinces"
        standout="bg-teal text-white"
        bg-color="white"
        v-model="model.province"
        label="استان"
        option-label="name"
        option-value="id"
      ></q-select>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-select
        standout="bg-teal text-white"
        bg-color="white"
        v-model="model.city"
        label="شهر"
        :options="computedCities"
        option-label="name"
        option-value="id"
      ></q-select>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-select
        class="col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب مدرسه"
        v-model="model.school_name"
        :options="schools"
        option-value="id"
        option-label="school_name"
        lazy-rules
        :rules="[val => !!val || 'لطفا   مدرسه خود را انتخاب کنید']"
      >
      </q-select>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-select
        class="col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب مقطع تحصیلی"
        v-model="model.grade"
        :options="Object.keys(grades).map(el=>({
          label:grades[el as any],
          value:el,
        }))"
        option-label="label"
        option-value="value"
        lazy-rules
        :rules="[val => !!val || 'لطفا   مقطع تحصیلی خود را انتخاب کنید']"
      >
      </q-select>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        type="number"
        maxlength="11"
        v-model="model.user.phone_number"
        label="شماره همراه کودک"
        lazy-rules
        :rules="[
          val =>
            (!!val && val.length > 0) || 'لطفا شمراه همراه خود را وارد کنید'
        ]"
      ></q-input>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        v-model="model.sheba_number"
        max-length="24"
        label="شماره شبا"
      ></q-input>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        type="number"
        maxlength="11"
        v-model="model.mother_phone_number"
        label="شماره همراه مادر"
      ></q-input>
    </div>
    <div class="col-xs-12 col-xl-6">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        type="number"
        maxlength="11"
        v-model="model.father_phone_number"
        label="شماره همراه پدر"
      ></q-input>
    </div>
    <div class="col-12">
      <q-input
        standout="bg-teal text-white"
        bg-color="white"
        maxlength="25"
        v-model="model.password"
        lazy-rules
        :rules="[
          val => (!!val && val.length > 0) || 'لطفا رمز عبور خود را وارد کنید'
        ]"
        v-if="!id"
        label="رمز عبور"
      ></q-input>
    </div>

    <div class="text-white col-12 q-pt-md row justify-end">
      <q-btn
        @click="
          $router.push({
            name: 'MainPage'
          })
        "
        style="background: #ff5e62"
        class="col-md-3 col-xs-6 q-pa-md q-mr-sm"
      >
        بازگشت
      </q-btn>
      <q-btn
        type="submit"
        style="background: #b1dc68"
        v-if="!id"
        class="col-md-3 col-xs-6 q-pa-sm"
      >
        افزودن کاربر
      </q-btn>
    </div>
  </q-form>
</template>
