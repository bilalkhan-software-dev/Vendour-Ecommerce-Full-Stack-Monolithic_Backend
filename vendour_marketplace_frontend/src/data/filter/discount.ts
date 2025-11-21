export interface Discount {
  label: string;
  value: number;
}

export const discounts: Discount[] = [
  { label: "10% and above", value: 10 },
  { label: "20% and above", value: 20 },
  { label: "30% and above", value: 30 },
  { label: "40% and above", value: 40 },
  { label: "50% and above", value: 50 },
  { label: "60% and above", value: 60 },
  { label: "70% and above", value: 70 },
  { label: "80% and above", value: 80 },
];
