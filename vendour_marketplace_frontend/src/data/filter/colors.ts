export interface Color {
  name: string;
  hex: string;
}

export const colors: Color[] = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Gray", hex: "#808080" },   // Standard Gray
  { name: "Grey", hex: "#808080" },   // Alias for UK spelling
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Red", hex: "#FF0000" },
  { name: "Maroon", hex: "#800000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Olive", hex: "#808000" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Green", hex: "#008000" },
  { name: "Aqua", hex: "#00FFFF" },
  { name: "Teal", hex: "#008080" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy", hex: "#000080" },
  { name: "Fuchsia", hex: "#FF00FF" },
  { name: "Purple", hex: "#800080" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Brown", hex: "#A52A2A" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Pink", hex: "#FFC0CB" },   
  { name: "HotPink", hex: "#FF69B4" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Magenta", hex: "#FF00FF" },
];
