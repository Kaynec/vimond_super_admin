
// export const localeOBJ = {
//   firstname: 'نام',
//   lastname: 'نام خانوادگی',
//   province: 'استان',
//   city: 'شهر',
//   birthdate: 'تاریخ تولد',
//   phone_number: 'شماره همراه',
//   score: 'امتیاز',
//   active_package: 'پکیج فعال',
//   national_code: 'کد ملی',
//   gender: 'جنسیت',
//   profile_image: 'تصویر پروفایل',
//   mother_phone_number: 'شماره موبایل مادر',
//   teacher_phone_number: 'شماره موبایل معلم',
//   father_phone_number: 'شماره موبایل پدر',
//   grade: 'مقطع تحصیلی',
//   sheba_number: 'شماره شبا'
// } as Record<string, string>;
// export const columns = [
//   {
//     name: 'name',
//     field: 'name',
//     label: 'نام'
//   },
//   {
//     name: 'id',
//     field: 'id',
//     label: '#'
//   },
//   {
//     name: 'image',
//     field: 'image',
//     label: 'عکس پروفایل'
//   },
//   {
//     name: 'phone',
//     field: 'phone',
//     label: 'شماره همراه'
//   },
//   {
//     name: 'shaba',
//     field: 'shaba',
//     label: 'شماره شبا'
//   },
//   {
//     name: 'payment_type',
//     field: 'payment_type',
//     label: 'نحوه پرداخت '
//   },
//   {
//     name: 'profile',
//     field: 'profile',
//     label: 'پروفایل'
//   }
// ];

// export const ORDER_TYPES = {
//   1:'نقدی' ,
//   2:'قسطی',
// }


export const localeOBJ = {
  firstname: 'نام',
  lastname: 'نام خانوادگی',
  province: 'استان',
  city: 'شهر',
  birthdate: 'تاریخ تولد',
  phone_number: 'شماره همراه',
  score: 'امتیاز',
  active_package: 'پکیج فعال',
  national_code: 'کد ملی',
  gender: 'جنسیت',
  profile_image: 'تصویر پروفایل',
  mother_phone_number: 'شماره موبایل مادر',
  teacher_phone_number: 'شماره موبایل معلم',
  father_phone_number: 'شماره موبایل پدر',
  grade: 'مقطع تحصیلی',
  sheba_number: 'شماره شبا'
} as Record<string, string>;
export const columns = [
  {
    name: 'name',
    field: 'name',
    label: 'نام'
  },
  {
    name: 'image',
    field: 'image',
    label: 'عکس پروفایل'
  },
  {
    name: 'phone',
    field: 'phone',
    label: 'شماره همراه'
  },
  {
    name: 'shaba',
    field: 'shaba',
    label: 'شماره شبا'
  },
  {
    name: 'profile',
    field: 'profile',
    label: 'پروفایل'
  }
];
export const columnsForShop = [
  {
    name: 'date',
    field: 'date',
    label: 'تاریخ'
  },
  {
    name: 'payment_type',
    field: 'payment_type',
    label: 'نوع خرید'
  },
  {
    name: 'total_price',
    field: 'total_price',
    label: 'قیمت'
  },
  {
    name: 'total_off_price',
    field: 'total_off_price',
    label: 'قیمت ویژه'
  },
  {
    name: 'platform',
    field: 'platform',
    label: 'پلتفرم خرید'
  },
  {
    name: 'discount',
    field: 'discount',
    label: 'کد تخفیف استفاده شده'
  },
  {
    name: 'id',
    field: 'id',
    label: 'جزییات پرداخت'
  },
];

export const ORDER_TYPES = {
  1:'نقدی' ,
  2:'قسطی',
}
