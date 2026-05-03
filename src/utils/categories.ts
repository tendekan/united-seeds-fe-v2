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
      { value: 'plants', label: 'Растения' },
      { value: 'tools', label: 'Инструменти' },
      { value: 'tips', label: 'Съвети' }
    ]
  },
  {
    key: 'home-repairs',
    label: 'Домашни поправки',
    icon: '🛠️',
    apiLabel: 'Home Repairs',
    subcategories: [
      { value: 'plumbing', label: 'Водопровод' },
      { value: 'electrical', label: 'Електро' },
      { value: 'general', label: 'Общи' }
    ]
  },
  {
    key: 'short-stays',
    label: 'Кратки престои',
    icon: '🏠',
    apiLabel: 'Short Stays',
    subcategories: [
      { value: 'urban', label: 'Градски' },
      { value: 'rural', label: 'Селски' }
    ]
  },
  {
    key: 'long-stays',
    label: 'Дългосрочни престои',
    icon: '🏡',
    apiLabel: 'Long Stays',
    subcategories: [
      { value: 'apartment', label: 'Апартамент' },
      { value: 'house', label: 'Къща' }
    ]
  },
  {
    key: 'building',
    label: 'Строителство',
    icon: '🏗️',
    apiLabel: 'Building',
    subcategories: [{ value: 'general', label: 'Общи' }]
  },
  {
    key: 'finance',
    label: 'Финанси',
    icon: '💼',
    apiLabel: 'Finance',
    subcategories: [
      { value: 'investing', label: 'Инвестиране' },
      { value: 'savings', label: 'Спестявания' }
    ]
  },
  {
    key: 'it-lessons',
    label: 'ИТ уроци',
    icon: '💻',
    apiLabel: 'IT Lessons',
    subcategories: [
      { value: 'web', label: 'Уеб' },
      { value: 'mobile', label: 'Мобилни' },
      { value: 'data', label: 'Данни' }
    ]
  },
  {
    key: 'car-repairs',
    label: 'Ремонт на автомобили',
    icon: '🚗',
    apiLabel: 'Car Repairs',
    subcategories: [{ value: 'general', label: 'Общи' }]
  },
  {
    key: 'sport',
    label: 'Спорт',
    icon: '🏀',
    apiLabel: 'Sport',
    subcategories: [
      { value: 'football', label: 'Футбол' },
      { value: 'fitness', label: 'Фитнес' }
    ]
  },
  {
    key: 'pets',
    label: 'Домашни любимци',
    icon: '🐾',
    apiLabel: 'Pets',
    subcategories: [
      { value: 'dogs', label: 'Кучета' },
      { value: 'cats', label: 'Котки' }
    ]
  },
  {
    key: 'art',
    label: 'Изкуство',
    icon: '🎨',
    apiLabel: 'Art',
    subcategories: [
      { value: 'painting', label: 'Рисуване' },
      { value: 'music', label: 'Музика' }
    ]
  },
  {
    key: 'beauty',
    label: 'Красота',
    icon: '💄',
    apiLabel: 'Beauty',
    subcategories: [{ value: 'general', label: 'Общи' }]
  },
  {
    key: 'healthcare',
    label: 'Здравеопазване',
    icon: '🩺',
    apiLabel: 'Healthcare',
    subcategories: [{ value: 'general', label: 'Общи' }]
  },
  {
    key: 'fashion',
    label: 'Мода',
    icon: '👗',
    apiLabel: 'Fashion',
    subcategories: [{ value: 'general', label: 'Общи' }]
  },
  {
    key: 'cooking',
    label: 'Готвене',
    icon: '👩‍🍳',
    apiLabel: 'Cooking',
    subcategories: [
      { value: 'recipes', label: 'Рецепти' },
      { value: 'baking', label: 'Печене' }
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