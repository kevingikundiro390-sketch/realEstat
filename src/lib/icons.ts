export type IconCategory =
  | "Design"
  | "Finance"
  | "Media"
  | "System"
  | "Nature"
  | "Abstract"
  | "Social"
  | "Food";

export type ColorStyle = "original" | "white" | "gradient" | "dark";
export type CameraAngle = "isometric" | "front" | "angled";

export type Icon3D = {
  id: string;
  name: string;
  category: IconCategory;
  emoji: string;
  gradient: [string, string];
};

export const colorStyles: { id: ColorStyle; label: string; swatch: [string, string] }[] = [
  { id: "original", label: "Original", swatch: ["#FF6B6B", "#FFD93D"] },
  { id: "white", label: "White", swatch: ["#F5F5F5", "#E0E0E0"] },
  { id: "gradient", label: "Gradient", swatch: ["#7C5CFF", "#5B8DEF"] },
  { id: "dark", label: "Dark", swatch: ["#3A3A3A", "#1A1A1A"] },
];

export const cameraAngles: { id: CameraAngle; label: string }[] = [
  { id: "isometric", label: "Isometric" },
  { id: "front", label: "Front" },
  { id: "angled", label: "Angled" },
];

export const categories: { id: IconCategory; label: string; emoji: string }[] = [
  { id: "Design", label: "Design & Dev", emoji: "🎨" },
  { id: "Finance", label: "Finance & Commerce", emoji: "💰" },
  { id: "Media", label: "Media & Communication", emoji: "📸" },
  { id: "System", label: "System & Utilities", emoji: "⚙️" },
  { id: "Nature", label: "Nature & Misc", emoji: "🌿" },
  { id: "Abstract", label: "Abstract & Shapes", emoji: "🔷" },
  { id: "Social", label: "Social & People", emoji: "👥" },
  { id: "Food", label: "Food & Drink", emoji: "☕" },
];

const iconData: Omit<Icon3D, "id">[] = [
  // Design & Dev
  { name: "Blender", category: "Design", emoji: "🟠", gradient: ["#FF8C42", "#FF6B2B"] },
  { name: "Figma", category: "Design", emoji: "🎯", gradient: ["#A259FF", "#FF7262"] },
  { name: "Sketch", category: "Design", emoji: "🟡", gradient: ["#FDB300", "#FFA630"] },
  { name: "Photoshop", category: "Design", emoji: "🟦", gradient: ["#31A8FF", "#001E36"] },
  { name: "Adobe XD", category: "Design", emoji: "🟪", gradient: ["#FF61F6", "#470137"] },
  { name: "Paintbrush", category: "Design", emoji: "🖌️", gradient: ["#FF6B6B", "#C44569"] },
  { name: "Color Palette", category: "Design", emoji: "🎨", gradient: ["#FF6B9D", "#C44569"] },
  { name: "Eyedropper", category: "Design", emoji: "💧", gradient: ["#48DBFB", "#0ABDE3"] },
  { name: "Pencil", category: "Design", emoji: "✏️", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Scissors", category: "Design", emoji: "✂️", gradient: ["#EE5A52", "#B71540"] },
  { name: "Eraser", category: "Design", emoji: "🧽", gradient: ["#FFB8B8", "#EE5A52"] },
  { name: "Ruler", category: "Design", emoji: "📏", gradient: ["#FFD93D", "#F0932B"] },
  { name: "Pen", category: "Design", emoji: "🖊️", gradient: ["#2D3436", "#636E72"] },
  { name: "Layers", category: "Design", emoji: "🗂️", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Grid", category: "Design", emoji: "🔲", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Crop", category: "Design", emoji: "⬜", gradient: ["#55EFC4", "#00B894"] },
  { name: "Transform", category: "Design", emoji: "🔄", gradient: ["#A29BFE", "#FD79A8"] },
  { name: "Paint Bucket", category: "Design", emoji: "🪣", gradient: ["#FF7675", "#D63031"] },
  { name: "Gradient", category: "Design", emoji: "🌈", gradient: ["#FD79A8", "#FDCB6E"] },
  { name: "Swatch", category: "Design", emoji: "🏷️", gradient: ["#FFEAA7", "#FDCB6E"] },

  // Finance & Commerce
  { name: "Wallet", category: "Finance", emoji: "👛", gradient: ["#FF6B9D", "#C44569"] },
  { name: "Coin", category: "Finance", emoji: "🪙", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Bitcoin", category: "Finance", emoji: "₿", gradient: ["#F7931A", "#FF6B2B"] },
  { name: "Ethereum", category: "Finance", emoji: "Ξ", gradient: ["#627EEA", "#4A52C7"] },
  { name: "Safe", category: "Finance", emoji: "🔐", gradient: ["#636E72", "#2D3436"] },
  { name: "Price Tag", category: "Finance", emoji: "🏷️", gradient: ["#FF7675", "#D63031"] },
  { name: "Credit Card", category: "Finance", emoji: "💳", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Shopping Bag", category: "Finance", emoji: "🛍️", gradient: ["#FF6B9D", "#FD79A8"] },
  { name: "Shopping Cart", category: "Finance", emoji: "🛒", gradient: ["#55EFC4", "#00B894"] },
  { name: "Gift Box", category: "Finance", emoji: "🎁", gradient: ["#FF7675", "#E84393"] },
  { name: "Receipt", category: "Finance", emoji: "🧾", gradient: ["#DFE6E9", "#B2BEC3"] },
  { name: "Banknote", category: "Finance", emoji: "💵", gradient: ["#55EFC4", "#00B894"] },
  { name: "Chart Up", category: "Finance", emoji: "📈", gradient: ["#55EFC4", "#00B894"] },
  { name: "Percentage", category: "Finance", emoji: "💯", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Store", category: "Finance", emoji: "🏪", gradient: ["#FF7675", "#D63031"] },

  // Media & Communication
  { name: "Phone", category: "Media", emoji: "📞", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Mail", category: "Media", emoji: "✉️", gradient: ["#DFE6E9", "#B2BEC3"] },
  { name: "Microphone", category: "Media", emoji: "🎤", gradient: ["#FF7675", "#D63031"] },
  { name: "Music Note", category: "Media", emoji: "🎵", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Speech Bubble", category: "Media", emoji: "💬", gradient: ["#55EFC4", "#00B894"] },
  { name: "Camera", category: "Media", emoji: "📷", gradient: ["#2D3436", "#636E72"] },
  { name: "Image", category: "Media", emoji: "🖼️", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Video", category: "Media", emoji: "📹", gradient: ["#FD79A8", "#E84393"] },
  { name: "Headphones", category: "Media", emoji: "🎧", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Volume", category: "Media", emoji: "🔊", gradient: ["#FF7675", "#D63031"] },
  { name: "Radio", category: "Media", emoji: "📻", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Podcast", category: "Media", emoji: "🎙️", gradient: ["#E17055", "#D63031"] },
  { name: "Message", category: "Media", emoji: "💌", gradient: ["#FF7675", "#E84393"] },
  { name: "Bell", category: "Media", emoji: "🔔", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Megaphone", category: "Media", emoji: "📣", gradient: ["#FF7675", "#E84393"] },

  // System & Utilities
  { name: "Folder", category: "System", emoji: "📁", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Lock", category: "System", emoji: "🔒", gradient: ["#636E72", "#2D3436"] },
  { name: "Key", category: "System", emoji: "🔑", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Settings", category: "System", emoji: "⚙️", gradient: ["#636E72", "#2D3436"] },
  { name: "Clock", category: "System", emoji: "🕐", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Calendar", category: "System", emoji: "📅", gradient: ["#FF7675", "#D63031"] },
  { name: "Trash", category: "System", emoji: "🗑️", gradient: ["#636E72", "#2D3436"] },
  { name: "Search", category: "System", emoji: "🔍", gradient: ["#74B9FF", "#0984E3"] },
  { name: "WiFi", category: "System", emoji: "📶", gradient: ["#55EFC4", "#00B894"] },
  { name: "Battery", category: "System", emoji: "🔋", gradient: ["#55EFC4", "#00B894"] },
  { name: "Bluetooth", category: "System", emoji: "🔵", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Cloud", category: "System", emoji: "☁️", gradient: ["#DFE6E9", "#74B9FF"] },
  { name: "Download", category: "System", emoji: "⬇️", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Upload", category: "System", emoji: "⬆️", gradient: ["#55EFC4", "#00B894"] },
  { name: "Refresh", category: "System", emoji: "🔄", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Power", category: "System", emoji: "⚡", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Eye", category: "System", emoji: "👁️", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Filter", category: "System", emoji: "🔽", gradient: ["#636E72", "#2D3436"] },
  { name: "Sliders", category: "System", emoji: "🎛️", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Toggle", category: "System", emoji: "🔘", gradient: ["#55EFC4", "#00B894"] },

  // Nature & Misc
  { name: "Sun", category: "Nature", emoji: "☀️", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Moon", category: "Nature", emoji: "🌙", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Flame", category: "Nature", emoji: "🔥", gradient: ["#FF6B2B", "#EE5253"] },
  { name: "Umbrella", category: "Nature", emoji: "☂️", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Trophy", category: "Nature", emoji: "🏆", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Heart", category: "Nature", emoji: "❤️", gradient: ["#FF6B9D", "#E84393"] },
  { name: "Star", category: "Nature", emoji: "⭐", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Leaf", category: "Nature", emoji: "🍃", gradient: ["#55EFC4", "#00B894"] },
  { name: "Drop", category: "Nature", emoji: "💧", gradient: ["#48DBFB", "#0ABDE3"] },
  { name: "Snowflake", category: "Nature", emoji: "❄️", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Lightning", category: "Nature", emoji: "⚡", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Rainbow", category: "Nature", emoji: "🌈", gradient: ["#FF7675", "#74B9FF"] },
  { name: "Mountain", category: "Nature", emoji: "⛰️", gradient: ["#636E72", "#2D3436"] },
  { name: "Flower", category: "Nature", emoji: "🌸", gradient: ["#FF7675", "#FD79A8"] },
  { name: "Apple", category: "Nature", emoji: "🍎", gradient: ["#FF6B6B", "#EE5253"] },

  // Abstract & Shapes
  { name: "Cube", category: "Abstract", emoji: "🟦", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Sphere", category: "Abstract", emoji: "🔵", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Cone", category: "Abstract", emoji: "🔺", gradient: ["#FF7675", "#D63031"] },
  { name: "Cylinder", category: "Abstract", emoji: "🥫", gradient: ["#DFE6E9", "#B2BEC3"] },
  { name: "Pyramid", category: "Abstract", emoji: "🔺", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Arrow Up", category: "Abstract", emoji: "⬆️", gradient: ["#55EFC4", "#00B894"] },
  { name: "Arrow Down", category: "Abstract", emoji: "⬇️", gradient: ["#FF7675", "#D63031"] },
  { name: "Arrow Left", category: "Abstract", emoji: "⬅️", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Arrow Right", category: "Abstract", emoji: "➡️", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Check", category: "Abstract", emoji: "✅", gradient: ["#55EFC4", "#00B894"] },
  { name: "Plus", category: "Abstract", emoji: "➕", gradient: ["#55EFC4", "#00B894"] },
  { name: "Minus", category: "Abstract", emoji: "➖", gradient: ["#FF7675", "#D63031"] },
  { name: "Cross", category: "Abstract", emoji: "❌", gradient: ["#FF7675", "#D63031"] },
  { name: "Hashtag", category: "Abstract", emoji: "#️⃣", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Diamond", category: "Abstract", emoji: "💎", gradient: ["#A29BFE", "#6C5CE7"] },

  // Social & People
  { name: "User", category: "Social", emoji: "👤", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Users", category: "Social", emoji: "👥", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "User Plus", category: "Social", emoji: "➕", gradient: ["#55EFC4", "#00B894"] },
  { name: "Profile", category: "Social", emoji: "🪪", gradient: ["#FFD93D", "#FFA502"] },
  { name: "ID Card", category: "Social", emoji: "🆔", gradient: ["#74B9FF", "#0984E3"] },
  { name: "Fingerprint", category: "Social", emoji: "👆", gradient: ["#A29BFE", "#6C5CE7"] },
  { name: "Handshake", category: "Social", emoji: "🤝", gradient: ["#FFD93D", "#FFA502"] },
  { name: "Thumbs Up", category: "Social", emoji: "👍", gradient: ["#55EFC4", "#00B894"] },
  { name: "Thumbs Down", category: "Social", emoji: "👎", gradient: ["#FF7675", "#D63031"] },
  { name: "Smile", category: "Social", emoji: "😊", gradient: ["#FFD93D", "#FFA502"] },

  // Food & Drink
  { name: "Coffee", category: "Food", emoji: "☕", gradient: ["#8B5E3C", "#5D4037"] },
  { name: "Wine", category: "Food", emoji: "🍷", gradient: ["#E84393", "#C44569"] },
  { name: "Pizza", category: "Food", emoji: "🍕", gradient: ["#FFD93D", "#FF6B2B"] },
  { name: "Burger", category: "Food", emoji: "🍔", gradient: ["#FFA502", "#D63031"] },
  { name: "Cake", category: "Food", emoji: "🎂", gradient: ["#FF7675", "#FD79A8"] },
  { name: "Ice Cream", category: "Food", emoji: "🍦", gradient: ["#FFB8B8", "#A29BFE"] },
  { name: "Cocktail", category: "Food", emoji: "🍸", gradient: ["#74B9FF", "#A29BFE"] },
  { name: "Bottle", category: "Food", emoji: "🍾", gradient: ["#55EFC4", "#00B894"] },
  { name: "Fork", category: "Food", emoji: "🍴", gradient: ["#DFE6E9", "#B2BEC3"] },
  { name: "Spoon", category: "Food", emoji: "🥄", gradient: ["#DFE6E9", "#B2BEC3"] },
];

export const icons: Icon3D[] = iconData.map((data, i) => ({
  ...data,
  id: `3di-${String(i + 1).padStart(3, "0")}`,
}));

export const totalRenderedIcons = icons.length * colorStyles.length * cameraAngles.length;

export function getIconById(id: string): Icon3D | undefined {
  return icons.find((icon) => icon.id === id);
}

export function getIconsByCategory(category: IconCategory): Icon3D[] {
  return icons.filter((icon) => icon.category === category);
}

export function searchIcons(query: string): Icon3D[] {
  const q = query.toLowerCase().trim();
  if (!q) return icons;
  return icons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(q) ||
      icon.category.toLowerCase().includes(q),
  );
}
