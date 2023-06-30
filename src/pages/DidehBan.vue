<script setup lang="ts">
import downloadExcel from 'vue-json-excel3';
import { useGenerateDate } from './GenerateDates';
import { computedAsync } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { instance } from 'src/boot/axios';

import PieChart from '../components/PieChart.vue';
import BarChart from '../components/BarChart.vue';
import { grades } from './grades';
import { colors } from './colors';

const { dateForSignUp, dateOptions } = useGenerateDate();

const { dateForSignUp: dateForReport, dateOptions: dataOptionsForReport } =
  useGenerateDate();

const students = computedAsync(async () => {
  const res = await instance.get('/myadmin/student-list/');
  if (res.data) return res.data;
  return [];
}, []);

const orderNumberAmount = computedAsync(async () => {
  const res = await instance.get('/report/order-number-amount/');
  if (res.data) return res.data;
  return [];
}, []);
const lastOrder = computedAsync(async () => {
  const res = await instance.get('/report/last-order/');
  if (res.data) return res.data;
  return [];
}, []);
const discountReport = computedAsync(async () => {
  const res = await instance.get('/report/discount-report/');
  if (res.data) return res.data;
  return [];
}, []);

type OrderPercentType = {
  value: number;
  color: string;
  label: string;
};

const orderPercent = computedAsync<OrderPercentType[] | null>(async () => {
  const res = await instance.get('/report/order-percent/');
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
const paymentRequestReport = computedAsync(async () => {
  const res = await instance.get('/report/payment-request-report/');
  if (res.data) return res.data;
  return [];
}, []);

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


const date = new Date()
const start_date = ref(new Date(
  date.setFullYear(date.getFullYear() - 1)
).toISOString());
const end_date = ref(new Date().toISOString());

let keyForRegister = 0
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
    key:keyForRegister++,
    value:result
  };
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

const userGenderReport = computedAsync(async () => {
  const res = await instance.get('/report/user-role-user-gender/');
  if (res.data) return res.data;
  return {};
}, {});

const ordernumberReport = computedAsync(async () => {
  const res = await instance.get('/report/order-number-amount/');
  if (res.data) return res.data;
  return {};
}, {});

const userRoleByGenderChart = computed(() => {
  const result = [];
  for (let [key, value] of Object.entries(userGenderReport.value)) {
    if (key === 'boy') {
      result.push({
        label: 'پسر',
        value,
        color: '#01A72F'
      });
    } else if (key === 'girl') {
      result.push({
        label: 'دختر',
        value,
        color: '#FF3D00'
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

  return result;
});
const dataSetFromDiscount = computed(() => {
  const result = [];
  const res = discountReport.value;
  result.push({
    label: 'خرید با کد تخفیف',
    value: res.discount_orders,
    color: '#FDB462'
  });
  result.push({
    label: 'خرید بدون کد تخفیف',
    value: res.all_orders - res.discount_orders,
    color: '#B1DC68E5'
  });
  return result;
});

const getExcelFromUserObject = () => {

  return [
    {
      'مبلغ آخرین فروش':lastOrder?.value.total_price,
      'تعداد کل فروش':orderNumberAmount?.value?.orders_number,
      'مبلغ کل فروش پکیج ها':'',
      'کل مبلغ تخفیف داده شده':orderNumberAmount.value?.amount?.total_off_price__sum,
      'تعداد کل کاربران':userGenderReport.value?.users,
      'درخواست های برداشت':paymentRequestReport.value?.request,
      'تعداد خرید های اخیر':'',
    }
  ]
};
</script>

<template>
  <main>
    <div class="row q-px-sm q-pt-md q-col-gutter-sm">
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          مبلغ آخرین فروش: {{ lastOrder?.total_price ?? 0 }}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          تعداد کل فروش: {{ orderNumberAmount?.orders_number ?? 0 }}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          کل مبلغ تخفیف داده شده:
          {{ orderNumberAmount?.amount?.total_off_price__sum }}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          مبلغ کل فروش پکیج ها: {{}}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          تعداد کل کاربران: {{ userGenderReport?.users }}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          درخواست های برداشت: {{ paymentRequestReport?.request }}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3">
        <q-card class="fit q-pa-sm md-height">
          تعداد خرید های اخیر: {{}}
        </q-card>
      </div>
      <div class="col-xs-6 col-md-3 text-white">
        <download-excel
          class="fit bg-red"
          :data="getExcelFromUserObject(students)"
          worksheet="My Worksheet"
        >
          <q-btn style="background: #cd5b89 !important" class="fit">
            خروجی اکسل
          </q-btn>
        </download-excel>
      </div>
      <div class="col-lg-6 col-xs-12">
        <PieChart
          :label="`تعداد کاربران:${userGenderReport?.users}`"
          smallLabel="نقش کاربر"
          :dataset="userRoleByGenderChart"
          :key="userGenderReport?.users"
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
        <BarChart
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
        </BarChart>
      </div>

      <div class="col-lg-6 col-xs-12">
        <PieChart
          label="میزان استفاده از کد تخفیف"
          smallLabel="استان"
          :dataset="dataSetFromDiscount"
          :key="discountReport?.all_orders"
        />
      </div>

      <div class="col-12">
        <BarChart
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
        </BarChart>
      </div>
    </div>
  </main>
</template>
