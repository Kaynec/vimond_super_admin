<script setup lang="ts">
import downloadExcel from 'vue-json-excel3';
import provinces from '../assets/provinces.json';
import cities from '../assets/cities.json';
import { computedAsync } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { instance } from 'src/boot/axios';
import PieChart from '../components/PieChart.vue';
import BarChart from '../components/BarChart.vue';
import LineChart from '../components/LineChart.vue';
import { grades } from './grades';
import { colors } from './colors';
import { useGenerateDate } from './GenerateDates';
import { columns, localeOBJ, columnsForShop } from './consts';
import { newDate } from 'date-fns-jalali';

type OrderPercentType = {
  value: number;
  color: string;
  label: string;
};

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

const order_list = computedAsync(async () => {
  const res = await instance.get('/shop/order-list-admin/');
  if (res.data) return res.data;
  return [];
}, []);

const students = computedAsync(async () => {
  const res = await instance.get('/myadmin/student-list/');
  if (res.data) return res.data;
  return [];
}, []);

const voucherCodes = computedAsync(async () => {
  const res = await instance.get('/discount/code-list/');
  if (res.data) return res.data;
  return [];
}, []);

const { dateForSignUp, dateOptions } = useGenerateDate();

const { dateForSignUp: dateForReport, dateOptions: dataOptionsForReport } =
  useGenerateDate();

// watch the dates for change and refresh the data based on them changes
watch(dateForSignUp, () => {
  const start = dateForSignUp.value?.value[0],
    end = dateForSignUp.value?.value[1];
  (start_date.value = start), (end_date.value = end);
});

watch(dateForReport, () => {
  const index = dataOptionsForReport.value.findIndex(
    el => JSON.stringify(el.value) === JSON.stringify(dateForReport.value.value)
  );
  valueForSellGrowthReport.value = index + 1;
});

dateForReport.value = dataOptionsForReport.value[0];

const date = new Date();
const start_date = ref(
  new Date(date.setFullYear(date.getFullYear() - 1)).toISOString()
);
const end_date = ref(new Date().toISOString());

let keyForRegister = 0;
const registerReportGraph = computedAsync(async () => {
  const res = await instance.get(
    `/report/register-report/?start_date=${start_date.value}&end_date=${end_date.value}`
  );

  const result = [];
  for (let [key, value] of Object.entries(res.data)) {
    if (key === 'student') {
      result.push({
        label: 'دانش آموز',
        value,
        color: '#01A72F'
      });
    } else if (key === 'school') {
      result.push({
        label: 'مدرسه',
        value,
        color: colors[8]
      });
    } else if (key === 'parent') {
      result.push({
        label: 'والدین',
        value,
        color: colors[1]
      });
    } else if (key === 'teacher') {
      result.push({
        label: 'معلم',
        value,
        color: colors[15]
      });
    } else if (key === 'coach') {
      result.push({
        label: 'کوچ',
        value,
        color: '#2E246C'
      });
    }
  }

  return {
    key: keyForRegister++,
    value: result
  };
});

const state = ref({
  text: '',
  date: '',
  age: 0,
  gender: '',
  city: '',
  state: '',
  school: '',
  grade: '',
  payment_type: '',
  voucherCode: ''
});

const orderPercent = computedAsync<OrderPercentType[] | null>(async () => {
  const res = await instance.get('/report/order-percent/');
  // console.log(res.data);
  if (res.data)
    return [
      {
        value: res.data.shop,
        label: 'فروشگاه',
        color: '#DE163A'
      },
      {
        value: res.data.package,
        color: '#FFEC43',
        label: 'پکیج'
      }
    ];
  return null;
}, null);

// const rows = computed(() => {
//   return studentsWithOrders.value?.map(el => {
//     return {
//       shaba: el?.sheba_number,
//       name: el?.firstname + ' ' + el?.lastname,
//       field: el?.firstname + ' ' + el?.lastname,
//       phone: el?.phone_number,
//       image: el?.profile_image,
//       id: el?.id
//     };
//   });
// });

const rows = computed(() => {
  return studentsWithOrders.value?.map((el: any) => {
    return {
      shaba: el?.sheba_number,
      name: el?.name,
      field: el?.firstname + ' ' + el?.lastname,
      phone: el?.phone_number,
      image: el?.profile_image,
      id: el?.id,
      orders: el.orders
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fix This Later Step
const dataSetFromProvinces = computed(()=>{
  const res :any[]= []
  studentsWithOrders.value.forEach((el,idx)=>{
    const element  = res.findIndex(child=>child.province === el.province)

    if (element && element !== idx) {
      res[element].value += el.orders.length
    }else {
      res.push({
        label:el.province,
        // 35 is the colos array length
        color:colors[element % 35],
        value: el.orders.length
      })
    }
  })
  return studentsWithOrders.value.map(el=>({
    label:el.province,
    value:el.orders.reduce((acc:number,current:number)=>acc+=current,0)
  }))
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const dataSetFromStudents = computed(() => {
  const map = {} as Record<string, number>;
  if (students.value.length) {
    students.value.forEach((element: { province: string }) => {
      if (!element.province) return;
      map[element.province] = map[element.province]
        ? map[element.province]++
        : 1;
    });
  }
  let result = [];
  let idx = 0;

  for (let [key, value] of Object.entries(map)) {
    result.push({
      value: value,
      label: key,
      color: colors[idx]
    });
    idx++;
  }

  return result;
});
const dataSetFromSchoolStudents = computed(() => {
  const map = {} as Record<string, number>;
  if (students.value.length) {
    students.value.forEach((element: { school_name: string }) => {
      if (!element.school_name) return;
      const school = schools.value.find(el => el.id === element.school_name);
      if (!school) return;
      map[school.school_name] = map[school.school_name]
        ? map[school.school_name]++
        : 1;
    });
  }
  let result = [];
  let idx = 0;

  for (let [key, value] of Object.entries(map)) {
    result.push({
      value: value,
      label: key,
      color: colors[idx]
    });
    idx++;
  }

  return result;
});

const valueForSellGrowthReport = ref(1);

const sellGrowthReport = computedAsync(async () => {
  const res = await instance.get(
    `/report/sell-growth-report/?value=${valueForSellGrowthReport.value}`
  );
  if (res.data) return res.data;
  return {};
}, {});

let key = 0;
const growthReportChartData = computed(() => {
  const res = sellGrowthReport.value;

  if (res) {
    return {
      key: key++,
      value: [
        {
          label: 'مقدار فروش بازه اول',
          value: res.first_range_order_numbers
        },
        {
          label: 'مقدار فروش بازه دوم',
          value: res.second_range_order_numbers
        }
      ]
    };
  }

  return {
    key,
    value: []
  };
});


const filterDuplicates = (array: any[], property = 'phone_number') => {
  return array.filter((el: any, idx: number, arr: any[]) => {
    const foundEL = arr.findIndex(item => item[property] === el[property]);
    if (foundEL >= 0 && foundEL !== idx) return false;
    return true;
  });
};

const initialData = ref<any[]>([]);
const studentsWithOrders = ref<any[]>([]);

const getStudents = () => {
  shouldContinue.value = false;
  const res = order_list.value.map((el: any) => {
    return {
      ...el.order
    };
  });

  let allUsers = order_list.value.map((el: any) => {
    const orders = res
      .filter(
        (ele: any) => ele.user.phone_number === el.order.user.phone_number
      )
      .map(el => {
        const { user, ...rest } = el;
        return {
          ...rest,
          date: rest?.updated_at || rest?.create_at
        };
      });
    const restOfElementProperties = students.value.find(
      (student: any) => student.user.phone_number === el.order.user.phone_number
    );
    return {
      ...el.order.user,
      name: el?.order?.user?.firstname + ' ' + el?.order?.user?.lastname,
      ...restOfElementProperties,
      ...restOfElementProperties.user,
      orders
    };
  });
  allUsers = filterDuplicates(allUsers);
  return allUsers;
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
    studentsWithOrders.value = initialData.value.filter((student: any) => student.province === (state.value.state as any).name);
  }
);
watch(
  () => state.value.city,
  () => {
    studentsWithOrders.value = initialData.value.filter((student: any) => student.province === (state.value.city as any).name);
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
watch(
  () => state.value.payment_type,
  () => {
    const newVal = JSON.parse(JSON.stringify(initialData.value));
    newVal.forEach((element: any) => {
      element.orders = element.orders.filter(
        (order: { payment_type: number }) =>
          order.payment_type ===
          (state.value.payment_type as unknown as { value: number }).value
      );
    });
    studentsWithOrders.value = newVal;
  }
);
watch(
  () => state.value.voucherCode,
  () => {
    const newVal = JSON.parse(JSON.stringify(initialData.value));
    newVal.forEach((element: any) => {
      element.orders = element.orders.filter(
        (order: { discount: string }) =>
          order.discount === state.value.voucherCode
      );
    });
    studentsWithOrders.value = newVal;
  }
);

const expanded = ref<any[]>([]);
const toggleExpanded = val =>
  (expanded.value = expanded.value[0] === val ? [] : [val]);
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
        class="md-height col-xs-12 col-lg-3"
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
        class="md-height col-xs-12 col-lg-3"
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
      <q-select
        class="md-height col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب  نوع خرید"
        v-model="state.payment_type"
        :options="[
          {
            label: 'قسطی',
            value: 2
          },
          {
            label: 'نقدی',
            value: 1
          }
        ]"
      >
      </q-select>
      <q-select
        class="md-height col-xs-12 col-lg-3"
        bg-color="white"
        standout="bg-teal text-white"
        label="انتخاب کد تخفیف"
        v-model="state.voucherCode"
        :options="voucherCodes.map((el:any) => el.code)"
      >
      </q-select>
      <!-- your filter section -->
      <div class="col-12">
        <q-card class="q-pa-xl shadow-0 row">
          <span class="text-deep-orange-9 q-mr-lg"> فیلتر انتخابی شما: </span>
          <div class="flex row q-gutter-lg">
            <span v-if="state.age"> سن : {{ state.age }} </span>
            <span v-if="state.date"> تاریخ : {{ state.date }} </span>
            <span v-if="state.voucherCode"> کد تخفیف : {{ state.voucherCode }} </span>
            <span v-if="state.city"> شهر : {{ (state.city as any).name }} </span>
            <span v-if="state.state"> استان : {{ (state.state as any).name }} </span>
            <span v-if="state.payment_type"> نوع خرید : {{ +(state.payment_type as any ).value === 1 ? 'نقدی':'قسطی' }} </span>
            <span v-if="state.school"> مدرسه : {{ (state.school as any ).school_name }} </span>
            <span v-if="state.grade"> مقطع : {{ (state.grade as any ).label }} </span>
            <span v-if="state.gender"> جنسیت : {{ (state.gender as any )?.label }} </span>
          </div>
        </q-card>
      </div>
      <!--  -->
      <!-- Table  -->
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
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="md"
                  color="accent"
                  dense
                  class="q-pa-sm"
                  @click="toggleExpanded(props.row.name)"
                  >مشاهده خریدها</q-btn
                >
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'image'">
                  <img
                    style="padding: 5px; border-radius: 8px"
                    width="45"
                    height="45"
                    loading="lazy"
                    v-if="col.value"
                    :src="col.value"
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
                </template>

                <div v-else-if="col.name === 'profile'">
                  <q-btn
                    class="bg-primary text-white"
                    @click="
                      $router.push({
                        name: 'Profile',
                        query: {
                          id: props.row.id
                        }
                      })
                    "
                    >مشاهده</q-btn
                  >
                </div>
                <span v-else>
                  {{ col.value }}
                </span>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <td colspan="100%">
                <q-table
                  :rows="props.row.orders"
                  :columns="columnsForShop"
                  bordered
                  flat
                  row-key="name"
                  class="col-12"
                >
                  <template v-slot:body-cell-payment_type="props">
                    <q-td :props="props">
                      {{ props.row.payment_type === 1 ? 'نقدی' : 'قسطی' }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-date="props">
                    <q-td :props="props">
                      {{ new Date(props.row.date).toLocaleDateString('fa-Fa') }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-platform="props">
                    <q-td :props="props">
                      {{ props.row.platform === 1 ? 'وب' : 'اپلیکیشن' }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-id="props">
                    <q-td :props="props">
                      <div>
                        <q-btn
                          class="bg-primary text-white"
                          @click="
                            $router.push({
                              name: 'Payment',
                              params: {
                                id: props.row.id
                              },
                              query:{
                                payment_type: props.row.payment_type
                              }
                            })
                          "
                          >جزییات پرداخت</q-btn
                        >
                      </div>
                    </q-td>
                  </template>
                </q-table>
              </td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-lg-6 col-xs-12">
        <PieChart
          label="فروش به تفکیک مدارس"
          smallLabel="مدرسه"
          :dataset="dataSetFromSchoolStudents"
          :key="schools.length + students.length"
        />
      </div>
      <div class="col-lg-6 col-xs-12">
        <PieChart
          label="کاربران به تفکیک استان"
          smallLabel="استان"
          :dataset="dataSetFromStudents"
          :key="students.length"
        />
      </div>
      <div class="col-lg-6 col-xs-12">
        <PieChart
          label="فروش به تفکیک محصول"
          smallLabel="محصول"
          v-if="orderPercent !== null"
          :dataset="orderPercent"
        />
      </div>
      <div class="col-lg-6 col-xs-12">
        <LineChart
          label="نرخ ثبت نام"
          :dataset="registerReportGraph?.value"
          :key="registerReportGraph?.key"
          v-if="registerReportGraph?.value"
        >
          <div>
            <q-select
              class="md-height col-xs-12 col-lg-3"
              bg-color="#F3F4F9"
              standout="bg-teal text-white"
              label="تاریخ"
              :options="dateOptions"
              v-model="dateForSignUp"
              optionLabel="label"
              optionValue="value"
            >
            </q-select>
          </div>
        </LineChart>
      </div>
      <div class="col-12">
        <LineChart
          label="نمودار روند فروش به تفکیک تاریخ"
          :dataset="growthReportChartData.value"
          :key="growthReportChartData.key"
        >
          <div>
            <q-select
              class="md-height col-xs-12 col-lg-3"
              bg-color="#F3F4F9"
              standout="bg-teal text-white"
              label="تاریخ"
              :options="dataOptionsForReport"
              v-model="dateForReport"
              optionLabel="label"
              optionValue="value"
            >
            </q-select>
          </div>
        </LineChart>
      </div>

       <!-- <div class="col-12">
        <BarChart
          :dataset="growthReportChartData.value"
          :key="growthReportChartData.key"
        >
      </div>
      </BarChart> -->
    </div>
  </main>
</template>
