<template>
  <q-card class="fit">
    <h6 class="q-pa-md">{{ label }}</h6>
    <div class="row q-pl-md">
      <div class="col-7 q-pt-xl q-pl-lg">
        <span class="text-subtitle2 q-mb-md  flex" v-if="smallLabel">
          {{ smallLabel }}:
        </span>
          <div class="row items-center q-my-sm q-pr-sm" v-for="item in dataset"  :key="item.color">
            <span  style="margin-left: 0.4rem; width: 0.7rem;height: 0.7rem;border-radius: 9999em;" :style="`background:${item.color}`">
            </span>
            <span class="q-pr-xl">
              {{ item.label }}
            </span>
        </div>
      </div>
      <div class="col-5">
        <Pie v-if="dataset.length" :key="data.labels.length" :data="data" :config="config" size="100px" />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);
ChartJS.defaults.font.family = 'vazir';

const data = ref({
  labels: [] as string[],
  datasets: [
    {
      data: [] as number[],
      backgroundColor: [] as string[]
    }
  ]
});

const config = {
  type: 'pie',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      title: {
        display: false,
        text: 'Chart.js Pie Chart'
      }
    }
  }
};
//

const props = defineProps<{
  label: string;
  smallLabel?: string;
  dataset: {
    label: string;
    color: string;
    value: number;
  }[];
}>();

props.dataset.forEach((dataSet) => {
  data.value.datasets[0].data.push(dataSet.value);
  data.value.datasets[0].backgroundColor.push(dataSet.color);
  data.value.labels.push(dataSet.label);
});
</script>
