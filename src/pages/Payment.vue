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
  </div>
</template>

<script setup lang="ts">
import { instance as axios } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// this is a boolean

const noPayment = ref(true);

const paymentType = ref<'cash' | 'nocash'>();

const id = useRoute().params.id;

onMounted(async () => {
  axios(`/myadmin/user-installment-order/${id}/`).then(r => {
    console.log(r.data);
  });
});
</script>

<style scoped></style>
