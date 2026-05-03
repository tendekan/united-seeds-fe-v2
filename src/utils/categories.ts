export type CategoryKey =
  | 'gardening'
  | 'home-repairs'
  | 'short-stays'
  | 'long-stays'
  | 'building'
  | 'finance'
  | 'it-lessons'
  | 'car-repairs'
  | 'sport'
  | 'pets'
  | 'art'
  | 'beauty'
  | 'healthcare'
  | 'fashion'
  | 'cooking';

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: string;
  apiLabel: string;
  subcategories: { value: string; label: string }[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: 'gardening',
    label: 'Градинарство',
    icon: '🌿',
    apiLabel: 'Gardening',
    subcategories: [
      { value: 'Plants', label: 'Растения' },
      { value: 'Landscaping', label: 'Озеленяване' },
      { value: 'Tools', label: 'Инструменти' }
    ]
  },
  {
    key: 'home-repairs',
    label: 'Домашни поправки',
    icon: '🛠️',
    apiLabel: 'Home Repairs',
    subcategories: [
      { value: 'Plumbing', label: 'Водопровод' },
      { value: 'Electrical', label: 'Електричество' },
      { value: 'Painting', label: 'Боядисване' }
    ]
  },
  {
    key: 'short-stays',
    label: 'Кратки престои',
    icon: '🏠',
    apiLabel: 'Short Stays',
    subcategories: [
      { value: 'Room', label: 'Стая' },
      { value: 'Studio', label: 'Студио' },
      { value: 'Apartment', label: 'Апартамент' }
    ]
  },
  {
    key: 'long-stays',
    label: 'Дългосрочни престои',
    icon: '🏡',
    apiLabel: 'Long Stays',
    subcategories: [
      { value: 'Room', label: 'Стая' },
      { value: 'House', label: 'Къща' },
      { value: 'Apartment', label: 'Апартамент' }
    ]
  },
  {
    key: 'building',
    label: 'Строителство',
    icon: '🏗️',
    apiLabel: 'Building',
    subcategories: [
      { value: 'Renovation', label: 'Реновация' },
      { value: 'Construction', label: 'Строителство' },
      { value: 'Consulting', label: 'Консултации' }
    ]
  },
  {
    key: 'finance',
    label: 'Финанси',
    icon: '💼',
    apiLabel: 'Finance',
    subcategories: [
      { value: 'Budgeting', label: 'Бюджетиране' },
      { value: 'Taxes', label: 'Данъци' },
      { value: 'Investing', label: 'Инвестиции' }
    ]
  },
  {
    key: 'it-lessons',
    label: 'ИТ уроци',
    icon: '💻',
    apiLabel: 'IT Lessons',
    subcategories: [
      { value: 'Programming', label: 'Програмиране' },
      { value: 'Office Tools', label: 'Офис инструменти' },
      { value: 'Cybersecurity', label: 'Киберсигурност' }
    ]
  },
  {
    key: 'car-repairs',
    label: 'Ремонт на автомобили',
    icon: '🚗',
    apiLabel: 'Car Repairs',
    subcategories: [
      { value: 'Engine', label: 'Двигател' },
      { value: 'Tires', label: 'Гуми' },
      { value: 'Diagnostics', label: 'Диагностика' }
    ]
  },
  {
    key: 'sport',
    label: 'Спорт',
    icon: '🏀',
    apiLabel: 'Sport',
    subcategories: [
      { value: 'Fitness', label: 'Фитнес' },
      { value: 'Team Sports', label: 'Отборни спортове' },
      { value: 'Coaching', label: 'Тренировки' }
    ]
  },
  {
    key: 'pets',
    label: 'Домашни любимци',
    icon: '🐾',
    apiLabel: 'Pets',
    subcategories: [
      { value: 'Grooming', label: 'Подстригване' },
      { value: 'Training', label: 'Дресировка' },
      { value: 'Sitting', label: 'Гледане' }
    ]
  },
  {
    key: 'art',
    label: 'Изкуство',
    icon: '🎨',
    apiLabel: 'Art',
    subcategories: [
      { value: 'Painting', label: 'Рисуване' },
      { value: 'Drawing', label: 'Чертане' },
      { value: 'Crafts', label: 'Занаяти' }
    ]
  },
  {
    key: 'beauty',
    label: 'Красота',
    icon: '💄',
    apiLabel: 'Beauty',
    subcategories: [
      { value: 'Makeup', label: 'Грим' },
      { value: 'Skincare', label: 'Грижа за кожата' },
      { value: 'Hair', label: 'Коса' }
    ]
  },
  {
    key: 'healthcare',
    label: 'Здравеопазване',
    icon: '🩺',
    apiLabel: 'Healthcare',
    subcategories: [
      { value: 'Wellness', label: 'Здравословен начин на живот' },
      { value: 'First Aid', label: 'Първа помощ' },
      { value: 'Nutrition', label: 'Хранене' }
    ]
  },
  {
    key: 'fashion',
    label: 'Мода',
    icon: '👗',
    apiLabel: 'Fashion',
    subcategories: [
      { value: 'Styling', label: 'Стилизиране' },
      { value: 'Tailoring', label: 'Шивачество' },
      { value: 'Design', label: 'Дизайн' }
    ]
  },
  {
    key: 'cooking',
    label: 'Готвене',
    icon: '👩‍🍳',
    apiLabel: 'Cooking',
    subcategories: [
      { value: 'Baking', label: 'Печене' },
      { value: 'Meal Prep', label: 'Приготвяне на храна' },
      { value: 'World Cuisine', label: 'Световна кухня' }
    ]
  }
];

export function getCategory(key: string | undefined): CategoryDef | undefined {
  if (!key) return undefined;
  return CATEGORIES.find((c) => c.key === key || c.label === key || c.apiLabel === key);
}

export function categoryLabel(value: string | undefined): string {
  return getCategory(value)?.label || value || '';
}

export function subcategoryLabel(
  category: string | undefined,
  sub: string | undefined
): string {
  if (!sub) return '';
  const def = getCategory(category);
  return def?.subcategories.find((s) => s.value === sub || s.label === sub)?.label || sub;
}