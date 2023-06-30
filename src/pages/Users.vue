<script setup lang="ts">
import downloadExcel from 'vue-json-excel3';
import provinces from '../assets/provinces.json';
import cities from '../assets/cities.json';
import { computedAsync } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { instance } from 'src/boot/axios';
import { grades } from './grades';
import { columns, localeOBJ } from './consts';
import { newDate } from 'date-fns-jalali';


const age = computed(() => {
  let arr = [];
  for (let i = 1; i < 101; i++) arr.push(i);
  return arr;
});

const schools = computedAsync(async () => {
  const res = await instance.get('/school/school-list/');
  if (res.data) return res.data;
  return [];
}, []);

const students = computedAsync(async () => {
  const res = await instance.get('/myadmin/student-list/');
  if (res.data) return res.data;
  return [];
}, []);

const state = ref({
  text: '',
  date: '',
  age: 0,
  gender: '',
  city: '',
  state: '',
  school: '',
  grade: '',
});
const rows = computed(() => {
  return studentsWithOrders.value?.map((el: any) => {
    return {
      shaba: el?.sheba_number,
      name: el?.name,
      field: el?.firstname + ' ' + el?.lastname,
      phone: el?.phone_number,
      image: el?.profile_image,
      id: el?.id
    };
  });
});

const hideBottom = ref(false);
const hideSelectedBanner = ref(false);
const hideNoData = ref(false);
const hidePagination = ref(false);

const selected = ref([]);

const getExcelFromUserObject = (data: any) => {
  return data?.map(el => {
    const storeOBJ = {
      ...el.user,
      ...el
    } as any;
    const outputOBJ = {} as any;

    for (let key of Object.keys(storeOBJ)) {
      if (key === 'grade') {
        outputOBJ[localeOBJ[key]] = grades[storeOBJ['grade']];
      } else if (key === 'birthdate') {
        try {
          outputOBJ[localeOBJ['birthdate']] = new Date(
            storeOBJ['birthdate']
          ).toLocaleDateString('fa-Fa');
        } catch (error) {}
      } else if (key === 'active_package') {
        outputOBJ[localeOBJ[key]] =
          storeOBJ[key] === 3 ? 'خریده شده' : 'خریده نشده';
      } else if (key === 'gender') {
        outputOBJ[localeOBJ[key]] = storeOBJ[key] === 1 ? 'پسر' : 'دختر';
      } else if (localeOBJ[key]) {
        outputOBJ[localeOBJ[key]] = storeOBJ[key];
      }
    }

    return outputOBJ;
  });
};

const initialData = ref<any[]>([]);
const studentsWithOrders = ref<any[]>([]);

const getStudents = () => {
  shouldContinue.value = false;
  return students.value.map((el: any) => {
    return {
      ...el,
      ...el.user,
      name: el?.user?.firstname + ' ' + el?.user?.lastname
    };
  });
};

let shouldContinue = ref(true);
// watch the students for change on filter params
watch(students, () => {
  if (!shouldContinue.value) return;
  if (!students.value.length) return;
  initialData.value = getStudents();
  studentsWithOrders.value = initialData.value;
});
watch(
  () => state.value.text,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) =>
      student.name.includes(state.value.text)
    );
  }
);
watch(
  () => state.value.date,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) => {
      let year = +state.value.date.split('/')[0],
        month = +state.value.date.split('/')[1],
        day = +state.value.date.split('/')[2];
      const date = newDate(year, month, day);
      return (
        student.birthdate ===
        `${date.getFullYear()}-${('0' + date.getMonth()).slice(-2)}-${(
          '0' + date.getDay()
        ).slice(-2)}`
      );
    });
  }
);
watch(
  () => state.value.age,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) => {
      const currentYear = new Date().getFullYear();
      const birthDateYear = new Date(student.birthdate).getFullYear();
      return currentYear - birthDateYear === state.value.age;
    });
  }
);
watch(
  () => state.value.state,
  () => {
    studentsWithOrders.value = initialData.value.filter(
      (student: any) => student.province === (state.value.state as any).name
    );
  }
);
watch(
  () => state.value.city,
  () => {
    studentsWithOrders.value = initialData.value.filter(
      (student: any) => student.province === (state.value.city as any).name
    );
  }
);
watch(
  () => state.value.gender,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) => {
      return (
        +(state.value.gender as unknown as { value: number }).value ===
        +student.gender
      );
    });
  }
);
watch(
  () => state.value.school,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) => {
      return (
        +(state.value.school as unknown as { id: number }).id ===
        +student.school_name
      );
    });
  }
);
watch(
  () => state.value.grade,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) => {
      return (
        +(state.value.grade as unknown as { value: number }).value ===
        +student.grade
      );
    });
  }
);
</script>

<template>
  <main>
    <div class="row q-px-sm q-pt-md q-col-gutter-sm">
      <div class="md-height col-xs-12 col-xl-6">
        <q-input
          standout="bg-teal text-white"
          bg-color="white"
          v-model="state.text"
          label="جستجو..."
        ></q-input>
      </div>
      <div class="col-xs-12 col-xl-3 md-height">
        <q-input
          filled
          v-model="state.date"
          label="انتخاب تاریخ"
          mask="date"
          calendaar="persian"
          :rules="['date']"
          standout="bg-teal text-white"
          bg-color="white"
          input-class=""
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="state.date" calendar="persian" today-btn>
                  <div class="row flex-center">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-xl-2 text-white md-height">
        <download-excel
          class="fit"
          :data="getExcelFromUserObject(students)"
          worksheet="My Worksheet"
        >
          <q-btn class="fit custom-rounded-xs bg-primary"> خروجی اکسل </q-btn>
        </download-excel>
      </div>
      <div class="col-xs-12 col-xl-1 text-white md-height">
        <q-btn
          class="fit custom-rounded-xs bg-accent"
          @click="
            $router.push({
              name: 'Profile'
            })
          "
        >
          افزودن</q-btn
        >
      </div>
      <q-select
        class="md-height col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب سن"
        v-model="state.age"
        :options="age"
      >
      </q-select>
      <q-select
        class="md-height col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب جنسیت"
        v-model="state.gender"
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
        option-value="option-value"
      >
      </q-select>
      <q-select
        class="md-height col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب شهر"
        v-model="state.city"
        :options="cities"
        option-label="name"
        option-value="name"
      >
      </q-select>
      <q-select
        class="md-height col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب استان"
        v-model="state.state"
        :options="provinces"
        option-label="name"
        option-value="name"
      >
      </q-select>
      <!--  -->
      <q-select
        class="md-height col-xs-12 col-md-6"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب مدرسه"
        v-model="state.school"
        :options="schools"
        option-value="id"
        option-label="school_name"
      >
      </q-select>
      <q-select
        class="md-height col-xs-12 col-md-6"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب مقطع تحصیلی"
        v-model="state.grade"
        :options="Object.keys(grades).map(el=>({
          label:grades[el as any],
          value:el,
        }))"
        option-label="label"
        option-value="value"
      >
      </q-select>
      <!-- your filter section -->
      <div class="col-12">
        <q-card class="q-pa-xl shadow-0 row">
          <span class="text-deep-orange-9 q-mr-lg"> فیلتر انتخابی شما: </span>
          <div class="flex row q-gutter-lg">
            <span v-if="state.age"> سن : {{ state.age }} </span>
            <span v-if="state.date"> تاریخ : {{ state.date }} </span>
            <span v-if="state.city">
              شهر : {{ (state.city as any).name }}
            </span>
            <span v-if="state.state">
              استان : {{ (state.state as any).name }}
            </span>
            <span v-if="state.school">
              مدرسه : {{ (state.school as any).school_name }}
            </span>
            <span v-if="state.grade">
              مقطع : {{ (state.grade as any).label }}
            </span>
            <span v-if="state.gender">
              جنسیت : {{ (state.gender as any)?.label }}
            </span>
          </div>
        </q-card>
      </div>
      <div class="col-12">
        <q-table
          :rows="rows"
          :columns="columns"
          bordered
          flat
          row-key="name"
          selection="multiple"
          v-model:selected="selected"
          :hide-bottom="hideBottom"
          :hide-selected-banner="hideSelectedBanner"
          :hide-no-data="hideNoData"
          :hide-pagination="hidePagination"
          class="col-12"
          :expanded="expanded"
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <img
                style="padding: 5px; border-radius: 8px"
                width="45"
                height="45"
                loading="lazy"
                v-if="props.row.image"
                :src="props.row.image"
              />
              <img
                style="
                  padding: 5px;
                  border-radius: 8px;
                  width: 45px;
                  height: 45px;
                "
                v-else
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </main>
</template>
