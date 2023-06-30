<template>
  <div class="q-pt-xl">
    <div v-if="noPayment" class="row q-gutter-lg justify-between">
      <div
        style="background: #707172; border-radius: 10px"
        class="text-white full-width shadow-6 q-pa-lg text-center"
      >
        هنوز پرداختی انجام نشده است.
      </div>

      <div
        class="full-width"
        style="display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr)"
      >
        <q-btn
          outline
          color="indigo-6"
          class="text-white border-red q-py-md q-px-lg"
          @click="paymentType = 'cash'"
        >
          پرداخت نقدی
        </q-btn>

        <q-btn
          outline
          color="indigo-6"
          @click="paymentType = 'nocash'"
          class="text-white border-red q-py-md q-px-lg"
        >
          پرداخت اقساط
        </q-btn>
      </div>
    </div>
    <div v-if="paymentType === 'cash'" class="row q-col-gutter-sm justify-end">
      <div
        style="background: #b1dc68e5; border-radius: 10px"
        class="text-white full-width shadow-6 q-pa-lg text-center col-12 q-mb-lg"
      >
        پرداخت به صورت نقدی انجام شده است.
      </div>

      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          مبلغ کل: {{ data?.order?.total_price }}
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          <!-- if special price then -->
          میزان تخفیف :
          {{ data?.order?.order?.total_price }}درصد
          {{ getDiscountPercent() }}
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          تاریخ پرداخت:
          {{ getDate(data?.order?.updated_at || data?.order?.create_at) }}
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          مبلغ پرداختی:
          {{ data?.order?.total_price - data?.order?.total_off_price || 0 }}
        </q-card>
      </div>
      <div class="text-white col-3 q-pt-md">
        <q-btn
          @click="
            $router.push({
              name: 'MainPage'
            })
          "
          style="background: #6969af"
          class="fit col-xs-6 q-pa-md q-mr-sm"
        >
          بازگشت
        </q-btn>
      </div>
    </div>
    <div
      v-if="paymentType === 'nocash'"
      class="row q-col-gutter-lg justify-between"
    >
      <div
        style="background: #b1dc68e5; border-radius: 10px"
        class="text-white full-width shadow-6 q-pa-lg text-center col-12 q-mb-lg"
      >
        پرداخت به صورت اقساطی انجام شده است.
      </div>

      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          مبلغ کل: {{ data?.order?.total_price }}
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          <!-- if special price then -->
          میزان تخفیف :
          {{ data?.order?.order?.total_price }}درصد
          {{ getDiscountPercent() }}
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          تاریخ پرداخت:
          {{ getDate(data?.order?.updated_at || data?.order?.create_at) }}
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="fit q-pa-lg" style="color: #707172">
          مبلغ پرداختی:
          {{ data?.order?.total_price - data?.order?.total_off_price || 0 }}
        </q-card>
      </div>

      <template
        :key="item.id"
        v-for="(item,index) in [
          ...installmentList,
          ...installmentList,
          ...installmentList
        ]"
      >
        <span class="text-h4 col-12 q-ma-0 q-pa-0" style="color: #707172;">قسط {{Num2persian(index+1)}}م</span>
        <div class="col-6">
          <q-card class="fit q-pa-lg" style="color: #707172">
            مبلغ : {{ item?.price || 0 }}
          </q-card>
        </div>
        <div class="col-6">
          <q-card class="fit q-pa-lg" style="color: #707172">
            تاریخ پرداخت:
            {{ getDate(item?.date) }}
          </q-card>
        </div>
      </template>
    </div>
    <!-- <div class="text-white col-3 q-pt-md">
      <q-btn
        @click="
          $router.push({
            name: 'MainPage'
          })
        "
        style="background: #6969af"
        class="fit col-xs-6 q-pa-md q-mr-sm"
      >
        بازگشت
      </q-btn>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core';
import { instance as axios } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import Num2persian from './NumberToPersian'

// this is a boolean

const route = useRoute();

const payment_type_query = +route.query.payment_type!;

const paymentType = ref<'cash' | 'nocash'>(
  payment_type_query === 1 ? 'cash' : 'nocash'
);
const noPayment = ref(!paymentType.value ? true : false);

const id = route.params.id;

const getDiscountPercent = () => {
  const price = parseInt(data.value?.order?.total_price);
  const specialPrice =
    parseInt(
      data.value?.order?.total_off_price || data.value?.order?.total_price
    ) - 2000000;
  return ((price - specialPrice) / price) * 100;
};
const getDate = (date: string) => new Date(date).toLocaleDateString('fa-Fa');

const data = computedAsync(async () => {
  const { data } = await axios(`/shop/order-detail-admin/${id}/`);

  if (data?.[0]) return data?.[0];
  return null;
}, null);

const installmentList = computedAsync(async () => {
  if (paymentType.value === 'cash') return null;

  const { data } = await axios(`/myadmin/installment-list-order/${id}/`);
  if (data) return data;
  return [];
}, []);
</script>

<style scoped></style>
