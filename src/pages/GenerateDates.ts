import { ref } from 'vue';

export const useGenerateDate = () => {
  const dateOptions = ref<any[]>([]);

  const dateForSignUp = ref();

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    dateOptions.value.push(date.toISOString());
  }

  dateOptions.value = dateOptions.value.reverse();

  const res: any[] = [];

  for (let i = 0; i < 12; i += 2) {
    const date = dateOptions.value[i];
    const date2 = dateOptions.value[i + 1];
    res.push({
      value: [date, date2],
      label: `${new Date(date).toLocaleDateString('fa-Fa')}__${new Date(
        date2
      ).toLocaleDateString('fa-Fa')}`
    });
  }

  dateOptions.value = res;
  return {
    dateOptions,
    dateForSignUp
  };
};
