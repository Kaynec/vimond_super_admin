<template>
  <q-card class="fit q-mt-xl">
    <div class="row items-center q-px-lg">
      <h6 class="q-mr-lg ml-lg">{{ label }}</h6>
      <div class="col">
        <slot></slot>
      </div>
    </div>
    <div class="row q-pa-md">
      <Line :data="data" :config="config" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Filler
);
ChartJS.defaults.font.family = 'IranSans';

const data = ref({
  scaleShowLabels: false,
  labels: [] as string[],
  datasets: [
    {
      label: '',
      data: [] as number[],
      backgroundColor: [] as string[]
    }
  ]
});

const config = {
  type: 'line',
  data: data,
  scaleShowLabels: false,

  options: {
    scales: {
      yAxes: [{ ticks: { display: false } }],
      y: [{ ticks: { display: false } }],
      Y: [{ ticks: { display: false } }],
      xAxes: [{ ticks: { displax: false } }],
      x: [{ ticks: { display: false } }],
      X: [{ ticks: { display: false } }]
    },
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
  dataset: {
    label: string;
    color: string;
    value: number;
  }[];
}>();

props.dataset.forEach(dataSet => {
  // console.log(data.value.datasets[idx]);

  data.value.datasets[0].data.push(dataSet.value);
  data.value.datasets[0].backgroundColor.push('#72E128');
  (data.value.datasets[0] as any).lineTension = 1;
  // data.value.datasets[0].fill = true
  data.value.labels.push(dataSet.label);
});
</script>
