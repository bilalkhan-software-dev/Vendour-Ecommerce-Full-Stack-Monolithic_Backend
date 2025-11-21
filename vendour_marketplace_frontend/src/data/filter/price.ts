export interface PriceRange {
    name: string;
    min: number;
    max: number;
    value: string;
}

export const priceRanges: PriceRange[] = [
    { name: "Below 500 Rs", min: 0, max: 500, value: "0-500" },
    { name: "500 - 1000 Rs", min: 500, max: 1000, value: "500-1000" },
    { name: "1000 - 2000 Rs", min: 1000, max: 2000, value: "1000-2000" },
    { name: "2000 - 3000 Rs", min: 2000, max: 3000, value: "2000-3000" },
    { name: "3000 - 5000 Rs", min: 3000, max: 5000, value: "3000-5000" },
    { name: "5000 - 10000 Rs", min: 5000, max: 10000, value: "5000-10000" },
    { name: "Above 10000 Rs", min: 10000, max: Infinity, value: "10000-100000" },
];
