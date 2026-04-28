"use client";
"use client";

import React, { useEffect, useMemo, useState } from "react";

/*
  Cafe Last Bite - QR Ordering Website Prototype
  ------------------------------------------------
  - No external icon/UI dependencies.
  - Uses React + Tailwind utility classes only.
  - Customer side: menu, cart, suggestions, checkout.
  - Admin side: dashboard, live orders, add manual order, products/menu management, offers, coupons, analytics.
  - Menu data is added from the uploaded Cafe Last Bite menu photos.
*/

function Icon({ children, size = 20, className = "", fill = "none" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const I = {
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>,
  cart: (p) => <Icon {...p}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2 2h3l3.6 12.6a2 2 0 0 0 2 1.4h7.7a2 2 0 0 0 1.9-1.4L22 7H6" /></Icon>,
  plus: (p) => <Icon {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Icon>,
  minus: (p) => <Icon {...p}><path d="M5 12h14" /></Icon>,
  x: (p) => <Icon {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>,
  trash: (p) => <Icon {...p}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></Icon>,
  clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>,
  star: (p) => <Icon {...p} fill={p.fill || "none"}><path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.6 8.9 9 8z" /></Icon>,
  bell: (p) => <Icon {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></Icon>,
  check: (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></Icon>,
  menu: (p) => <Icon {...p}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></Icon>,
  chart: (p) => <Icon {...p}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></Icon>,
  food: (p) => <Icon {...p}><path d="M4 3v7" /><path d="M8 3v7" /><path d="M6 3v18" /><path d="M15 3c3 2 4 6 1 9v9" /></Icon>,
  edit: (p) => <Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>,
  tag: (p) => <Icon {...p}><path d="M20.5 13.5 13.5 20.5a2 2 0 0 1-2.8 0L3 12.8V3h9.8l7.7 7.7a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1" /></Icon>,
  user: (p) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.8-4 14.2-4 16 0" /></Icon>,
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) {
  const styles = {
    primary: "bg-[#D62828] text-white hover:bg-[#b91f1f]",
    dark: "bg-[#1F1F1F] text-white hover:bg-black",
    outline: "bg-white text-[#1F1F1F] border border-orange-200 hover:bg-orange-50",
    ghost: "bg-transparent text-[#1F1F1F] hover:bg-orange-50",
    green: "bg-green-600 text-white hover:bg-green-700",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50", styles[variant], className)}>
      {children}
    </button>
  );
}

const categories = [
  "Recommended",
  "Bestsellers",
  "Burgers",
  "Sandwiches",
  "Fries",
  "Pizzas",
  "Pasta",
  "Starters",
  "Soups",
  "Noodles",
  "Fried Rice",
  "Rice Bowls",
  "Wraps",
  "Stuffed Bread",
  "Maggie",
  "Rolls",
  "Beverages",
  "Desserts",
];

const categoryEmoji = {
  Recommended: "⭐",
  Bestsellers: "🔥",
  Burgers: "🍔",
  Sandwiches: "🥪",
  Fries: "🍟",
  Pizzas: "🍕",
  Pasta: "🍝",
  Starters: "🥘",
  Soups: "🍲",
  Noodles: "🍜",
  "Fried Rice": "🍚",
  "Rice Bowls": "🥣",
  Wraps: "🌯",
  "Stuffed Bread": "🥖",
  Maggie: "🍝",
  Rolls: "🌯",
  Beverages: "🥤",
  Desserts: "🍨",
};

const gradients = [
  "from-orange-200 via-amber-100 to-red-100",
  "from-red-100 via-orange-100 to-yellow-100",
  "from-lime-100 via-yellow-100 to-orange-100",
  "from-red-200 via-orange-100 to-stone-100",
  "from-yellow-100 via-orange-100 to-red-100",
  "from-orange-100 via-red-100 to-amber-100",
  "from-sky-100 via-cyan-100 to-stone-100",
  "from-yellow-100 via-amber-100 to-stone-100",
  "from-stone-200 via-amber-100 to-orange-100",
];

function getMenuDescription(name, category) {
  const lower = name.toLowerCase();

  if (category === "Burgers") {
    if (lower.includes("cheese") && lower.includes("corn")) return "A soft burger bun layered with sweet corn, creamy cheese, crisp veggies and house sauce.";
    if (lower.includes("peri")) return "A spicy veg patty burger finished with peri-peri seasoning, fresh veggies and creamy sauce.";
    if (lower.includes("maharaja")) return "A loaded cheese burger with a hearty veg patty, rich sauce, fresh veggies and extra indulgence.";
    if (lower.includes("spinach")) return "A wholesome corn and spinach patty burger with fresh veggies and creamy dressing.";
    return "A classic veg burger with a crisp patty, fresh veggies and smooth house-style sauce.";
  }

  if (category === "Sandwiches") {
    if (lower.includes("paneer tikka")) return "Grilled sandwich filled with smoky paneer tikka, veggies and creamy tandoori-style sauce.";
    if (lower.includes("tandoori paneer")) return "A toasted sandwich layered with tandoori paneer, crunchy veggies and bold masala flavour.";
    if (lower.includes("peri")) return "Paneer and veggies grilled with spicy peri-peri flavour for a bold snack bite.";
    if (lower.includes("cheese corn")) return "Creamy cheese and sweet corn stuffed between toasted bread for a soft, comforting bite.";
    if (lower.includes("bombay")) return "A street-style toasted sandwich with potato masala, chutney and fresh vegetables.";
    if (lower.includes("mexican")) return "A grilled sandwich with Mexican-style seasoning, veggies, cheese and tangy sauce.";
    if (lower.includes("pasta")) return "Creamy pasta filling tucked inside grilled bread for a rich cafe-style sandwich.";
    return "A freshly grilled sandwich with crisp vegetables, creamy spread and a warm toasted finish.";
  }

  if (category === "Fries") {
    if (lower.includes("peri")) return "Crispy golden fries tossed with spicy peri-peri seasoning for a bold side snack.";
    if (lower.includes("masala")) return "Crunchy fries coated with chatpata masala for a spicy, addictive bite.";
    return "Classic salted fries, fried crisp and served hot as the perfect side with burgers or shakes.";
  }

  if (category === "Pizzas") {
    if (lower.includes("paneer tikka")) return "A cheesy pizza topped with smoky paneer tikka, veggies and rich tandoori flavour.";
    if (lower.includes("tandoori paneer")) return "Fresh pizza base topped with tandoori paneer, vegetables, cheese and spicy sauce.";
    if (lower.includes("mexican")) return "A loaded pizza with Mexican-style seasoning, crunchy veggies, cheese and tangy sauce.";
    if (lower.includes("farm")) return "A veggie-loaded pizza with cheese, capsicum, onion, corn and a fresh cafe-style finish.";
    if (lower.includes("corn")) return "A cheesy pizza topped with sweet corn, herbs and a soft, comforting flavour.";
    return "A freshly baked cheese pizza with tomato sauce, herbs and a warm golden finish.";
  }

  if (category === "Pasta") {
    if (lower.includes("white")) return "Creamy white sauce pasta tossed with herbs, veggies and a smooth cheesy finish.";
    if (lower.includes("red")) return "Pasta tossed in tangy red sauce with herbs, vegetables and a bold tomato flavour.";
    if (lower.includes("mix")) return "A balanced pasta made with creamy white sauce and tangy red sauce for a rich flavour.";
    if (lower.includes("chinese")) return "Pasta tossed with Indo-Chinese seasoning, vegetables and spicy cafe-style sauce.";
    return "Herb-flavoured pasta tossed with vegetables and sauce for a light, satisfying meal.";
  }

  if (category === "Starters") {
    if (lower.includes("paneer")) return "Soft paneer cubes tossed with capsicum, onion and spicy chilli sauce.";
    if (lower.includes("potato")) return "Crispy potato bites tossed in a sweet-spicy chilli glaze for a flavourful starter.";
    if (lower.includes("corn")) return "Crunchy corn tossed with seasoning and spices for a crisp, snackable starter.";
    if (lower.includes("mushroom")) return "Mushrooms tossed in spicy sauce with vegetables for a bold Indo-Chinese bite.";
    return "A hot Indo-Chinese starter tossed with vegetables, spices and flavourful sauce.";
  }

  if (category === "Soups") {
    if (lower.includes("manchow")) return "A warm Indo-Chinese soup with vegetables, spices and a comforting savoury flavour.";
    if (lower.includes("hot") || lower.includes("sour")) return "A spicy-tangy soup made with vegetables and bold hot-sour seasoning.";
    if (lower.includes("corn")) return "A mild sweet corn soup with vegetables and a smooth comforting texture.";
    return "A warm vegetarian soup made with light spices, vegetables and soothing flavour.";
  }

  if (category === "Noodles") {
    if (lower.includes("schezwan")) return "Noodles tossed with vegetables and spicy Schezwan sauce for a bold Chinese-style meal.";
    if (lower.includes("chilli garlic")) return "Noodles cooked with chilli, garlic, vegetables and a spicy aromatic finish.";
    if (lower.includes("manchurian")) return "Noodles loaded with paneer and Manchurian flavours for a filling Indo-Chinese plate.";
    return "Stir-fried noodles tossed with vegetables, sauces and cafe-style Chinese seasoning.";
  }

  if (category === "Fried Rice") {
    if (lower.includes("schezwan")) return "Fried rice tossed with vegetables and spicy Schezwan sauce for a bold flavour.";
    if (lower.includes("paneer")) return "Veg fried rice upgraded with paneer cubes, sauces and aromatic seasoning.";
    if (lower.includes("manchurian")) return "Fried rice combined with Manchurian flavour for a satisfying Indo-Chinese meal.";
    return "Vegetable fried rice tossed with sauces, spices and a light smoky wok-style finish.";
  }

  if (category === "Rice Bowls") {
    if (lower.includes("makhani")) return "A rich rice bowl topped with creamy paneer makhani gravy for a filling meal.";
    if (lower.includes("schezwan")) return "A spicy Schezwan rice bowl layered with bold sauces and Indo-Chinese flavours.";
    if (lower.includes("paneer")) return "A hearty rice bowl with paneer gravy, vegetables and a comforting spicy finish.";
    return "A filling rice bowl served with flavourful gravy and cafe-style seasoning.";
  }

  if (category === "Bestsellers") {
    if (lower.includes("pav")) return "Soft pav served with flavourful masala filling for a quick street-style snack.";
    if (lower.includes("nachos")) return "Crispy nachos topped with cheese, seasoning and bold cafe-style flavours.";
    if (lower.includes("popcorn")) return "Crispy paneer bites seasoned and fried for a crunchy snack plate.";
    if (lower.includes("corn balls")) return "Crispy cheese corn balls with a creamy centre and golden outer crunch.";
    return "A customer-favourite snack made fresh for a quick and satisfying bite.";
  }

  if (category === "Wraps" || category === "Rolls") {
    if (lower.includes("paneer")) return "A soft wrap filled with paneer, veggies, sauces and bold masala flavour.";
    if (lower.includes("mexican")) return "A flavourful wrap with Mexican-style seasoning, veggies and creamy sauce.";
    if (lower.includes("aloo")) return "A soft wrap filled with spiced aloo, cheese and fresh vegetables.";
    return "A handy roll packed with vegetables, sauces and warm cafe-style filling.";
  }

  if (category === "Stuffed Bread") {
    if (lower.includes("garlic")) return "Toasted bread loaded with garlic butter, cheese and herbs for a rich side bite.";
    if (lower.includes("mexican")) return "Cheesy stuffed bread with Mexican-style seasoning and a crisp toasted finish.";
    return "Warm stuffed bread filled with cheese, herbs and a soft cafe-style centre.";
  }

  if (category === "Maggie") {
    if (lower.includes("cheese")) return "Hot Maggie cooked with masala, cheese and a creamy comfort-food finish.";
    if (lower.includes("peri")) return "Maggie tossed with peri-peri seasoning for a spicy, quick comfort bowl.";
    if (lower.includes("paneer")) return "Maggie cooked with paneer, masala and tandoori-style flavour.";
    return "Classic hot Maggie cooked with masala and served as a quick comforting snack.";
  }

  if (category === "Beverages") {
    if (lower.includes("shake")) return "A thick, chilled shake blended smooth for a sweet finish with snacks or meals.";
    return "A chilled beverage served cold to refresh and complete your meal.";
  }

  if (category === "Desserts") {
    return "A sweet cafe-style dessert served as the perfect finish after snacks or meals.";
  }

  return `${name} made fresh with cafe-style seasoning and served hot for a satisfying bite.`;
}

function makeItem(id, category, name, price, opts = {}) {
  return {
    id,
    name,
    category,
    price,
    image: opts.image || "",
    time: opts.time || "8-12 min",
    rating: opts.rating || 4.6,
    bestseller: Boolean(opts.bestseller),
    available: opts.available !== false,
    description: opts.description || getMenuDescription(name, category),
    emoji: opts.emoji || categoryEmoji[category] || "🍽️",
    gradient: opts.gradient || gradients[id.length % gradients.length],
    suggestions: opts.suggestions || ["peri-peri-fries", "chilled-cola", "chocolate-shake"],
    addons: opts.addons || [],
    source: "Current Cafe Last Bite menu",
  };
}

const defaultAddons = [
  { name: "Extra Cheese", price: 20 },
  { name: "Extra Spicy", price: 10 },
];

const pizzaAddons = [{ name: "Extra Cheese", price: 40 }, { name: "Cheese Dip", price: 25 }];
const sandwichAddons = [{ name: "Extra Cheese", price: 20 }, { name: "Extra Mayo", price: 15 }];
const friesAddons = [{ name: "Extra Peri Peri", price: 10 }, { name: "Cheese Sauce", price: 25 }];
const maggieAddons = [{ name: "Extra Cheese", price: 20 }, { name: "Extra Masala", price: 10 }];

const initialMenuItems = [
  // Burgers
  makeItem("classic-burger", "Burgers", "Classic Burger", 70, { emoji: "🍔", bestseller: true, addons: defaultAddons, suggestions: ["peri-peri-fries", "chilled-cola", "chocolate-shake"] }),
  makeItem("corn-spinach-burger", "Burgers", "Corn Spinach Burger", 100, { emoji: "🍔", addons: defaultAddons }),
  makeItem("veg-burger", "Burgers", "Veg Burger", 80, { emoji: "🍔", addons: defaultAddons }),
  makeItem("peri-peri-burger", "Burgers", "Peri-Peri Burger", 100, { emoji: "🍔", bestseller: true, addons: defaultAddons }),
  makeItem("maharaja-cheese-burger", "Burgers", "Maharaja Cheese Burger", 150, { emoji: "🍔", bestseller: true, addons: defaultAddons }),

  // Fries
  makeItem("classic-salted-fries", "Fries", "Classic Salted Fries", 80, { emoji: "🍟", addons: friesAddons }),
  makeItem("peri-peri-fries", "Fries", "Peri-Peri Fries", 90, { emoji: "🍟", bestseller: true, addons: friesAddons, suggestions: ["classic-burger", "chilled-cola", "chocolate-shake"] }),
  makeItem("masala-fries", "Fries", "Masala Fries", 110, { emoji: "🍟", addons: friesAddons }),

  // Pizzas
  makeItem("margherita-pizza", "Pizzas", "Margherita Pizza", 100, { emoji: "🍕", bestseller: true, addons: pizzaAddons, suggestions: ["garlic-bread", "chilled-cola", "peri-peri-fries"] }),
  makeItem("cheese-corn-pizza", "Pizzas", "Cheese Corn Pizza", 120, { emoji: "🍕", addons: pizzaAddons }),
  makeItem("onion-capsicum-pizza", "Pizzas", "Onion Capsicum Pizza", 120, { emoji: "🍕", addons: pizzaAddons }),
  makeItem("tandoori-paneer-pizza", "Pizzas", "Tandoori Paneer Pizza", 140, { emoji: "🍕", addons: pizzaAddons }),
  makeItem("mexican-pizza", "Pizzas", "Mexican Pizza", 150, { emoji: "🍕", addons: pizzaAddons }),
  makeItem("farm-house-pizza", "Pizzas", "Farm House Pizza", 150, { emoji: "🍕", addons: pizzaAddons }),
  makeItem("paneer-tikka-pizza", "Pizzas", "Paneer Tikka Pizza", 170, { emoji: "🍕", bestseller: true, addons: pizzaAddons }),
  makeItem("veg-paradise-pizza", "Pizzas", "Veg Paradise Pizza", 180, { emoji: "🍕", addons: pizzaAddons }),

  // Sandwiches
  makeItem("corn-sandwich", "Sandwiches", "Corn Sandwich", 60, { emoji: "🥪", addons: sandwichAddons, suggestions: ["peri-peri-fries", "chilled-cola", "chocolate-shake"] }),
  makeItem("onion-garlic-sandwich", "Sandwiches", "Onion Garlic Sandwich", 70, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("cheese-corn-sandwich", "Sandwiches", "Cheese Corn Sandwich", 80, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("vegetable-sandwich", "Sandwiches", "Vegetable Sandwich", 80, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("tandoori-paneer-sandwich", "Sandwiches", "Tandoori Paneer Sandwich", 100, { emoji: "🥪", bestseller: true, addons: sandwichAddons }),
  makeItem("peri-peri-paneer-sandwich", "Sandwiches", "Peri-Peri Paneer Sandwich", 100, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("bombay-masala-sandwich", "Sandwiches", "Bombay Masala Sandwich", 100, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("cheese-chutney-sandwich", "Sandwiches", "Cheese Chutney Sandwich", 100, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("creamy-pasta-sandwich", "Sandwiches", "Creamy Pasta Sandwich", 120, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("mix-sandwich", "Sandwiches", "Mix Sandwich", 120, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("paneer-masala-sandwich", "Sandwiches", "Paneer Masala Sandwich", 120, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("mexican-sandwich", "Sandwiches", "Mexican Sandwich", 120, { emoji: "🥪", addons: sandwichAddons }),
  makeItem("paneer-tikka-sandwich", "Sandwiches", "Paneer Tikka Sandwich", 140, { emoji: "🥪", addons: sandwichAddons }),

  // Pasta
  makeItem("olive-herbs-pasta", "Pasta", "Olive Herbs Pasta", 120, { emoji: "🍝", suggestions: ["garlic-bread", "chilled-cola", "chocolate-shake"] }),
  makeItem("chinese-pasta", "Pasta", "Chinese Pasta", 120, { emoji: "🍝" }),
  makeItem("red-sauce-pasta", "Pasta", "Red Sauce Pasta", 140, { emoji: "🍝" }),
  makeItem("white-sauce-pasta", "Pasta", "White Sauce Pasta", 150, { emoji: "🍝", bestseller: true }),
  makeItem("mix-sauce-pasta", "Pasta", "Mix Sauce Pasta", 160, { emoji: "🍝" }),

  // Starters
  makeItem("potato-chilli", "Starters", "Potato Chilli", 120, { emoji: "🥘", suggestions: ["schezwan-noodles", "chilled-cola", "peri-peri-fries"] }),
  makeItem("crispy-corn", "Starters", "Crispy Corn", 120, { emoji: "🌽", bestseller: true }),
  makeItem("baby-corn", "Starters", "Baby Corn", 140, { emoji: "🌽", description: "Regular price shown. Full portion also available on counter as per menu." }),
  makeItem("manchurian", "Starters", "Manchurian", 140, { emoji: "🥢", description: "Regular price shown. Full portion also available on counter as per menu." }),
  makeItem("mushroom", "Starters", "Mushroom", 140, { emoji: "🍄", description: "Regular price shown. Full portion also available on counter as per menu." }),
  makeItem("paneer-chilli", "Starters", "Paneer Chilli", 140, { emoji: "🥘", bestseller: true, description: "Regular price shown. Full portion also available on counter as per menu." }),
  makeItem("chana-chilli", "Starters", "Chana Chilli", 140, { emoji: "🥘", description: "Regular price shown. Full portion also available on counter as per menu." }),
  makeItem("cocktail-chilli", "Starters", "Cocktail Chilli", 140, { emoji: "🥘", description: "Regular price shown. Full portion also available on counter as per menu." }),
  makeItem("honey-potato-chilli", "Starters", "Honey Potato Chilli", 140, { emoji: "🥔" }),
  makeItem("soya-chilli", "Starters", "Soya Chilli", 150, { emoji: "🥘" }),

  // Soups
  makeItem("manchow-soup", "Soups", "Manchow Soup", 80, { emoji: "🍲", time: "5-8 min" }),
  makeItem("hot-sour-soup", "Soups", "Hot & Sour Soup", 80, { emoji: "🍲", time: "5-8 min" }),
  makeItem("garlic-soup", "Soups", "Garlic Soup", 80, { emoji: "🍲", time: "5-8 min" }),
  makeItem("sweet-lemon-soup", "Soups", "Sweet Lemon Soup", 80, { emoji: "🍲", time: "5-8 min" }),
  makeItem("sweet-corn-soup", "Soups", "Sweet Corn Soup", 80, { emoji: "🍲", time: "5-8 min" }),

  // Noodles
  makeItem("hakka-noodles", "Noodles", "Hakka Noodles", 80, { emoji: "🍜", suggestions: ["manchurian", "chilled-cola", "crispy-corn"] }),
  makeItem("chowmein", "Noodles", "Chowmein", 80, { emoji: "🍜" }),
  makeItem("schezwan-noodles", "Noodles", "Schezwan Noodles", 100, { emoji: "🍜", bestseller: true }),
  makeItem("chilli-garlic-noodles", "Noodles", "Chilli Garlic Noodles", 120, { emoji: "🍜" }),
  makeItem("chinese-bhel", "Noodles", "Chinese Bhel", 120, { emoji: "🍜" }),
  makeItem("manchurian-paneer-noodles", "Noodles", "Manchurian & Paneer Noodles", 150, { emoji: "🍜" }),
  makeItem("mix-chowmein", "Noodles", "Mix Chowmein", 180, { emoji: "🍜" }),

  // Fried Rice
  makeItem("veg-fried-rice", "Fried Rice", "Veg Fried Rice", 80, { emoji: "🍚", suggestions: ["manchurian", "chilled-cola", "paneer-chilli"] }),
  makeItem("schezwan-fried-rice", "Fried Rice", "Schezwan Fried Rice", 100, { emoji: "🍚" }),
  makeItem("chilli-garlic-fried-rice", "Fried Rice", "Chilli Garlic Fried Rice", 120, { emoji: "🍚" }),
  makeItem("paneer-fried-rice", "Fried Rice", "Paneer Fried Rice", 140, { emoji: "🍚" }),
  makeItem("manchurian-fried-rice", "Fried Rice", "Manchurian Fried Rice", 130, { emoji: "🍚" }),

  // Rice Bowls
  makeItem("manchurian-gravy-rice", "Rice Bowls", "Manchurian Gravy Rice", 150, { emoji: "🥣" }),
  makeItem("paneer-chilly-rice", "Rice Bowls", "Paneer Chilly Rice", 180, { emoji: "🥣", bestseller: true }),
  makeItem("paneer-makhani-gravy-rice", "Rice Bowls", "Paneer Makhani Gravy Rice", 180, { emoji: "🥣" }),
  makeItem("triple-schezwan-rice", "Rice Bowls", "Triple Schezwan Rice", 180, { emoji: "🥣" }),
  makeItem("mushroom-gravy-rice", "Rice Bowls", "Mushroom Gravy Rice", 180, { emoji: "🥣" }),

  // Bestsellers
  makeItem("aloo-masala-pav", "Bestsellers", "Aloo Masala Pav", 50, { emoji: "🥯", bestseller: true }),
  makeItem("paneer-masala-pav", "Bestsellers", "Paneer Masala Pav", 70, { emoji: "🥯", bestseller: true }),
  makeItem("nuggets", "Bestsellers", "Nuggets", 100, { emoji: "🍘", bestseller: true }),
  makeItem("veg-cheese-nachos", "Bestsellers", "Veg Cheese Nachos", 100, { emoji: "🧀" }),
  makeItem("cheese-corn-nachos", "Bestsellers", "Cheese Corn Nachos", 100, { emoji: "🧀" }),
  makeItem("mexican-nachos", "Bestsellers", "Mexican Nachos", 120, { emoji: "🧀" }),
  makeItem("tandoori-pizza-sandwich", "Bestsellers", "Tandoori Pizza Sandwich", 150, { emoji: "🥪", bestseller: true }),
  makeItem("garlic-sticks-paneer-dip", "Bestsellers", "Garlic Sticks with Paneer Dip", 150, { emoji: "🥖" }),
  makeItem("paneer-popcorn", "Bestsellers", "Paneer Popcorn", 160, { emoji: "🧆" }),
  makeItem("paneer-on-wheels", "Bestsellers", "Paneer on Wheels", 180, { emoji: "🧀" }),
  makeItem("cheese-corn-balls", "Bestsellers", "Cheese Corn Balls", 200, { emoji: "🧆" }),

  // Wraps
  makeItem("aloo-cheese-wrap", "Wraps", "Aloo Cheese Wrap", 80, { emoji: "🌯" }),
  makeItem("veggies-wrap", "Wraps", "Veggies Wrap", 80, { emoji: "🌯" }),
  makeItem("paneer-cheese-wrap", "Wraps", "Paneer Cheese Wrap", 120, { emoji: "🌯" }),
  makeItem("paneer-masala-wrap", "Wraps", "Paneer Masala Wrap", 120, { emoji: "🌯" }),
  makeItem("mexican-wrap", "Wraps", "Mexican Wrap", 120, { emoji: "🌯" }),
  makeItem("paneer-tikka-wrap", "Wraps", "Paneer Tikka Wrap", 130, { emoji: "🌯", bestseller: true }),

  // Stuffed bread
  makeItem("cheese-garlic-bread", "Stuffed Bread", "Cheese Garlic Bread", 100, { emoji: "🥖", suggestions: ["margherita-pizza", "chilled-cola", "chocolate-shake"] }),
  makeItem("cheese-garlic-sticks", "Stuffed Bread", "Cheese Garlic Sticks", 120, { emoji: "🥖" }),
  makeItem("mexican-cheese-sticks", "Stuffed Bread", "Mexican Cheese Sticks", 120, { emoji: "🥖" }),
  makeItem("olive-herb-delight", "Stuffed Bread", "Olive Herb Delight", 120, { emoji: "🥖" }),

  // Maggie
  makeItem("masala-maggie", "Maggie", "Masala Maggie", 50, { emoji: "🍝", addons: maggieAddons }),
  makeItem("veg-maggie", "Maggie", "Veg Maggie", 60, { emoji: "🍝", addons: maggieAddons }),
  makeItem("butter-masala-maggie", "Maggie", "Butter Masala Maggie", 60, { emoji: "🍝", addons: maggieAddons }),
  makeItem("peri-peri-maggie", "Maggie", "Peri Peri Maggie", 70, { emoji: "🍝", addons: maggieAddons }),
  makeItem("schezwan-cheese-maggie", "Maggie", "Schezwan Cheese Maggie", 80, { emoji: "🍝", bestseller: true, addons: maggieAddons }),
  makeItem("chinese-maggie", "Maggie", "Chinese Maggie", 100, { emoji: "🍝", addons: maggieAddons }),
  makeItem("chilli-garlic-maggie", "Maggie", "Chilli Garlic Maggie", 100, { emoji: "🍝", addons: maggieAddons }),
  makeItem("paneer-tandoori-maggie", "Maggie", "Paneer Tandoori Maggie", 120, { emoji: "🍝", addons: maggieAddons }),

  // Rolls
  makeItem("aloo-cheese-roll", "Rolls", "Aloo Cheese Roll", 70, { emoji: "🌯" }),
  makeItem("veggies-roll", "Rolls", "Veggies Roll", 80, { emoji: "🌯" }),
  makeItem("paneer-chilli-roll", "Rolls", "Paneer Chilli Roll", 100, { emoji: "🌯" }),
  makeItem("soya-chilli-roll", "Rolls", "Soya Chilli Roll", 100, { emoji: "🌯" }),
  makeItem("mushroom-chilli-roll", "Rolls", "Mushroom Chilli Roll", 100, { emoji: "🌯" }),

  // Added for suggestions / future menu expansion
  makeItem("chilled-cola", "Beverages", "Chilled Cola", 49, { emoji: "🥤", time: "2 min", description: "Cold refreshing drink to complete your meal.", suggestions: ["classic-burger", "peri-peri-fries", "margherita-pizza"] }),
  makeItem("chocolate-shake", "Beverages", "Chocolate Shake", 129, { emoji: "🥤", time: "5-7 min", bestseller: true, description: "Thick chocolate shake with creamy finish.", suggestions: ["classic-burger", "peri-peri-fries", "corn-sandwich"] }),
  makeItem("brownie-sundae", "Desserts", "Brownie Sundae", 149, { emoji: "🍨", time: "5-7 min", description: "Warm brownie topped with ice cream and chocolate sauce.", suggestions: ["chocolate-shake", "chilled-cola", "classic-burger"] }),
];

const initialOrders = [
  {
    id: "LB1024",
    customer: "Rahul",
    phone: "98XXXXXX21",
    type: "Dine-in",
    status: "New",
    time: "5:42 PM",
    createdAt: new Date().toISOString(),
    total: 327,
    items: ["2 x Classic Burger", "1 x Peri-Peri Fries", "1 x Chocolate Shake"],
    instruction: "Burger: no onion",
  },
  {
    id: "LB1023",
    customer: "Aman",
    phone: "88XXXXXX10",
    type: "Takeaway",
    status: "Preparing",
    time: "5:37 PM",
    createdAt: new Date().toISOString(),
    total: 278,
    items: ["1 x Margherita Pizza", "1 x Chilled Cola", "1 x Cheese Garlic Bread"],
    instruction: "Less spicy",
  },
  {
    id: "LB1022",
    customer: "Priya",
    phone: "77XXXXXX55",
    type: "Dine-in",
    status: "Ready",
    time: "5:29 PM",
    createdAt: new Date().toISOString(),
    total: 248,
    items: ["1 x Schezwan Noodles", "1 x Chocolate Shake"],
    instruction: "No extra chilli",
  },
];

const initialOffers = [
  { id: "offer-1", title: "Burger + Fries + Drink Combo", detail: "Classic Burger + Peri-Peri Fries + Chilled Cola", price: 199, active: true },
  { id: "offer-2", title: "Pizza Add-on Deal", detail: "Add Garlic Bread with any pizza", price: 79, active: true },
];

const initialCoupons = [
  { id: "coupon-1", code: "LASTBITE50", discount: "₹50 off above ₹299", active: true },
  { id: "coupon-2", code: "SNACK10", discount: "10% off snacks", active: false },
];

function validateMenu(items) {
  const ids = new Set(items.map((item) => item.id));
  return {
    uniqueIds: ids.size === items.length,
    suggestionsValid: items.every((item) => item.suggestions.every((id) => ids.has(id))),
    categoriesValid: items.every((item) => categories.includes(item.category)),
  };
}

export default function RestaurantQRWebsite() {
  const [view, setView] = useState("home");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") {
      setView("admin");
    }
  }, []);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState("Recommended");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedQty, setSelectedQty] = useState(1);
  const [spice, setSpice] = useState("Medium");
  const [itemNote, setItemNote] = useState("");
  const [suggestSource, setSuggestSource] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState(initialOrders);
  const [lastOrder, setLastOrder] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", type: "Dine-in" });
  const [adminTab, setAdminTab] = useState("Dashboard");
  const [offers, setOffers] = useState(initialOffers);
  const [coupons, setCoupons] = useState(initialCoupons);

  const menuChecks = validateMenu(menuItems);
  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch = activeCategory === "Recommended" ? item.bestseller || item.category === "Recommended" : item.category === activeCategory;
      const searchText = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      return categoryMatch && searchText.includes(search.trim().toLowerCase());
    });
  }, [activeCategory, search, menuItems]);

  const startAdd = (item) => {
    if (!item.available) return;
    setSelectedItem(item);
    setSelectedAddons([]);
    setSelectedQty(1);
    setSpice("Medium");
    setItemNote("");
  };

  const addSelectedItem = () => {
    if (!selectedItem) return;
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const newCartItem = {
      key: `${selectedItem.id}-${Date.now()}-${Math.random()}`,
      id: selectedItem.id,
      name: selectedItem.name,
      qty: selectedQty,
      price: selectedItem.price,
      addons: selectedAddons,
      spice,
      note: itemNote,
      lineTotal: selectedItem.price + addonsTotal,
    };
    setCart((prev) => [...prev, newCartItem]);
    setSuggestSource(selectedItem);
    setSelectedItem(null);
  };

  const quickAdd = (item) => {
    if (!item.available) return;
    setCart((prev) => [...prev, { key: `${item.id}-${Date.now()}-${Math.random()}`, id: item.id, name: item.name, qty: 1, price: item.price, addons: [], spice: "Medium", note: "", lineTotal: item.price }]);
  };

  const quickRemove = (item) => {
    setCart((prev) => {
      const targetIndex = [...prev].reverse().findIndex((cartItem) => cartItem.id === item.id && (!cartItem.addons || cartItem.addons.length === 0));
      if (targetIndex === -1) return prev;
      const realIndex = prev.length - 1 - targetIndex;
      return prev
        .map((cartItem, index) => {
          if (index !== realIndex) return cartItem;
          return { ...cartItem, qty: Math.max(0, cartItem.qty - 1) };
        })
        .filter((cartItem) => cartItem.qty > 0);
    });
  };

  const updateQty = (key, change) => {
    setCart((prev) => prev.map((item) => (item.key === key ? { ...item, qty: Math.max(0, item.qty + change) } : item)).filter((item) => item.qty > 0));
  };

  const createOrderFromCart = () => {
    if (!cart.length) return;
    const order = buildOrderFromCart(cart, cartTotal, customer);
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
    setCart([]);
    setCartOpen(false);
    setView("success");
  };

  const addManualOrder = (orderCart, manualCustomer) => {
    const total = orderCart.reduce((sum, item) => sum + item.lineTotal * item.qty, 0);
    if (!orderCart.length) return;
    const order = buildOrderFromCart(orderCart, total, manualCustomer, "Counter");
    setOrders((prev) => [order, ...prev]);
    setAdminTab("Orders");
  };

  const moveOrder = (id, nextStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: nextStatus } : order)));
  };

  const updateProduct = (id, changes) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const addProduct = (product) => {
    setMenuItems((prev) => [product, ...prev]);
  };

  const suggestedItems = suggestSource ? suggestSource.suggestions.map((id) => menuItems.find((item) => item.id === id)).filter(Boolean).slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1F1F1F]">
      <Header setView={setView} cartCount={cartCount} setCartOpen={setCartOpen} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {(!menuChecks.uniqueIds || !menuChecks.suggestionsValid || !menuChecks.categoriesValid) && (
        <div className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
          <div className="rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-800 ring-1 ring-yellow-200">
            Menu data warning: check duplicate IDs, categories, or suggestion links.
          </div>
        </div>
      )}

      {view === "home" && <HomePage setView={setView} startAdd={startAdd} menuItems={menuItems} />}
      {view === "menu" && <MenuPage activeCategory={activeCategory} setActiveCategory={setActiveCategory} search={search} setSearch={setSearch} filteredItems={filteredItems} startAdd={startAdd} />}
      {view === "admin" && <AdminPanel adminTab={adminTab} setAdminTab={setAdminTab} orders={orders} moveOrder={moveOrder} menuItems={menuItems} updateProduct={updateProduct} addProduct={addProduct} addManualOrder={addManualOrder} offers={offers} setOffers={setOffers} coupons={coupons} setCoupons={setCoupons} />}
      {view === "success" && <SuccessPage order={lastOrder} setView={setView} />}

      {cartCount > 0 && view !== "admin" && view !== "success" && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-5 left-1/2 z-40 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-[#1F1F1F] px-5 py-4 text-white shadow-2xl md:hidden">
          <span className="font-black">View Cart • {cartCount} items</span>
          <span className="font-black">₹{cartTotal}</span>
        </button>
      )}

      {selectedItem && <ItemModal item={selectedItem} selectedAddons={selectedAddons} setSelectedAddons={setSelectedAddons} selectedQty={selectedQty} setSelectedQty={setSelectedQty} spice={spice} setSpice={setSpice} itemNote={itemNote} setItemNote={setItemNote} onClose={() => setSelectedItem(null)} onAdd={addSelectedItem} />}
      {suggestSource && <SuggestionModal source={suggestSource} items={suggestedItems} onAdd={quickAdd} onRemove={quickRemove} onClose={() => setSuggestSource(null)} onViewCart={() => { setSuggestSource(null); setCartOpen(true); }} />}
      {cartOpen && <CartDrawer cart={cart} cartTotal={cartTotal} updateQty={updateQty} onClose={() => setCartOpen(false)} onPlaceOrder={createOrderFromCart} customer={customer} setCustomer={setCustomer} />}
    </div>
  );
}

function buildOrderFromCart(cart, total, customer, source = "QR") {
  const now = new Date();
  return {
    id: `LB${Math.floor(1000 + Math.random() * 9000)}`,
    customer: customer.name?.trim() || (source === "Counter" ? "Counter Customer" : "QR Customer"),
    phone: customer.phone?.trim() || "Not provided",
    type: customer.type || "Dine-in",
    status: "New",
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    createdAt: now.toISOString(),
    total,
    items: cart.map((item) => {
      const addOns = item.addons?.length ? ` (${item.addons.map((a) => a.name).join(", ")})` : "";
      return `${item.qty} x ${item.name}${addOns}`;
    }),
    instruction: cart.map((item) => item.note).filter(Boolean).join(", ") || "No instruction",
    source,
  };
}

function Header({ setView, cartCount, setCartOpen, mobileMenu, setMobileMenu }) {
  const go = (page) => { setView(page); setMobileMenu(false); };
  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-[#FFF8F0]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <button onClick={() => go("home")} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D62828] text-white shadow-lg shadow-red-200"><I.food size={22} /></div>
          <div className="text-left"><p className="text-lg font-black tracking-tight">Cafe Last Bite</p><p className="text-xs font-medium text-stone-500">Fast Food • Cafe • Pure Veg</p></div>
        </button>
        <nav className="hidden items-center gap-7 text-sm font-bold text-stone-700 md:flex">
          <button onClick={() => go("home")} className="hover:text-[#D62828]">Home</button>
          <button onClick={() => go("menu")} className="hover:text-[#D62828]">Menu</button>
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={() => go("menu")} className="hidden md:inline-flex">Start Order</Button>
          <button onClick={() => setCartOpen(true)} className="relative rounded-full border border-orange-200 bg-white p-3 transition hover:bg-orange-50"><I.cart size={20} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F77F00] text-xs font-black text-white">{cartCount}</span>}</button>
          <button onClick={() => setMobileMenu((v) => !v)} className="rounded-full p-2 md:hidden">{mobileMenu ? <I.x /> : <I.menu />}</button>
        </div>
      </div>
      {mobileMenu && <div className="border-t border-orange-100 bg-white px-4 py-3 md:hidden"><div className="grid gap-2 text-sm font-black"><button onClick={() => go("home")} className="rounded-xl bg-orange-50 p-3 text-left">Home</button><button onClick={() => go("menu")} className="rounded-xl bg-orange-50 p-3 text-left">Menu</button></div></div>}
    </header>
  );
}

function HomePage({ setView, startAdd, menuItems }) {
  const bestSellers = menuItems.filter((item) => item.bestseller && item.available).slice(0, 4);
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:px-8 md:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-black text-[#D62828] shadow-sm"><I.star size={16} fill="currentColor" /> Scan QR • Order Faster</div>
          <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Happiness, where every bite counts.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">Burgers, sandwiches, pizza, pasta, Chinese, Maggie, rice bowls and more — browse the menu and place your order instantly.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setView("menu")} className="px-8 py-4 text-base">Start Order</Button><Button onClick={() => setView("menu")} variant="outline" className="px-8 py-4 text-base">View Menu</Button></div>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">{[["100+", "Menu items"], ["Pure", "Veg menu"], ["Quick", "QR ordering"]].map(([a, b]) => <div key={a} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100"><p className="text-2xl font-black text-[#D62828]">{a}</p><p className="text-xs font-semibold text-stone-500">{b}</p></div>)}</div>
        </div>
        <div className="relative"><div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-orange-200 via-red-100 to-yellow-100 blur-2xl" /><div className="relative overflow-hidden rounded-[2rem] bg-[#1F1F1F] p-5 shadow-2xl"><div className="grid gap-4 sm:grid-cols-2"><FoodVisual emoji="🍔" title="Signature Burger" className="h-64 sm:col-span-2" /><FoodVisual emoji="🍟" title="Loaded Fries" className="h-44" /><FoodVisual emoji="🍕" title="Fresh Pizza" className="h-44" /></div></div></div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="font-bold uppercase tracking-[0.25em] text-[#F77F00]">Menu categories</p><h2 className="mt-2 text-3xl font-black md:text-4xl">What are you craving today?</h2></div><Button onClick={() => setView("menu")} variant="outline" className="hidden md:inline-flex">Explore All</Button></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{categories.slice(1, 13).map((cat) => <button key={cat} onClick={() => setView("menu")} className="rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-orange-100 transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-4 flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-red-50 text-5xl">{categoryEmoji[cat]}</div><p className="text-lg font-black">{cat}</p><p className="text-sm font-medium text-stone-500">{menuItems.filter((i) => i.category === cat).length} items</p></button>)}</div></section>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8"><p className="font-bold uppercase tracking-[0.25em] text-[#F77F00]">Best sellers</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Customer favourites</h2><div className="mt-6 grid gap-5 md:grid-cols-4">{bestSellers.map((item) => <FoodCard key={item.id} item={item} startAdd={startAdd} />)}</div></section>
    </main>
  );
}

function MenuPage({ activeCategory, setActiveCategory, search, setSearch, filteredItems, startAdd }) {
  return <main className="mx-auto max-w-7xl px-4 py-8 md:px-8"><div className="mb-8 rounded-[2rem] bg-gradient-to-r from-[#1F1F1F] to-[#4A1D16] p-6 text-white md:p-8"><p className="font-bold uppercase tracking-[0.25em] text-orange-300">Digital Menu</p><h1 className="mt-2 text-4xl font-black md:text-5xl">Order your favourites</h1><p className="mt-3 max-w-2xl text-white/70">Current Cafe Last Bite menu added. Items can be edited later from Admin → Products.</p></div><div className="sticky top-[77px] z-30 mb-6 rounded-3xl border border-orange-100 bg-[#FFF8F0]/95 p-3 backdrop-blur-xl"><div className="relative mb-3"><I.search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your cravings..." className="w-full rounded-2xl border border-orange-100 bg-white py-4 pl-12 pr-4 font-semibold outline-none focus:ring-2 focus:ring-orange-200" /></div><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((cat) => <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("whitespace-nowrap rounded-full px-5 py-3 text-sm font-black transition", activeCategory === cat ? "bg-[#D62828] text-white shadow-lg shadow-red-100" : "bg-white text-stone-600 ring-1 ring-orange-100")}>{cat}</button>)}</div></div><div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">{filteredItems.map((item) => <FoodCard key={item.id} item={item} startAdd={startAdd} />)}</div></main>;
}

function FoodCard({ item, startAdd }) {
  return <div className={cn("overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl", item.available ? "border-orange-100" : "border-stone-200 opacity-70")}><FoodVisual emoji={item.emoji} title={item.name} image={item.image} className="h-48" gradient={item.gradient} /><div className="p-5"><div className="mb-2 flex items-center justify-between gap-2"><span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-black text-green-700 ring-1 ring-green-100">● VEG</span>{!item.available ? <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-black text-stone-500">Unavailable</span> : <span className="flex items-center gap-1 text-sm font-black text-amber-600"><I.star size={15} fill="currentColor" /> {item.rating}</span>}</div><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-black leading-tight">{item.name}</h3><p className="text-lg font-black">₹{item.price}</p></div><p className="mt-2 min-h-[48px] text-sm leading-6 text-stone-500">{item.description}</p><div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-1 text-xs font-bold text-stone-500"><I.clock size={14} /> {item.time}</span><Button disabled={!item.available} onClick={() => startAdd(item)} className="px-4 py-2">Add +</Button></div></div></div>;
}

function FoodVisual({ emoji, title, image, className, gradient = "from-orange-200 via-amber-100 to-red-100" }) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-stone-100", className)}>
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 rounded-3xl bg-white/85 p-4 backdrop-blur-sm ring-1 ring-white/60">
          <p className="font-black text-stone-900">{title}</p>
          <p className="text-xs font-bold text-stone-600">Product image</p>
        </div>
      </div>
    );
  }

  return <div className={cn("relative overflow-hidden bg-gradient-to-br", gradient, className)}><div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-xl" /><div className="absolute bottom-4 left-4 right-4 rounded-3xl bg-white/45 p-4 backdrop-blur-sm ring-1 ring-white/60"><div className="flex items-center gap-3"><span className="text-5xl drop-shadow-sm">{emoji}</span><div><p className="font-black text-stone-900">{title}</p><p className="text-xs font-bold text-stone-600">Image placeholder</p></div></div></div></div>;
}

function ItemModal({ item, selectedAddons, setSelectedAddons, selectedQty, setSelectedQty, spice, setSpice, itemNote, setItemNote, onClose, onAdd }) {
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const total = item.price + addonsTotal;
  const toggleAddon = (addon) => setSelectedAddons((prev) => (prev.some((a) => a.name === addon.name) ? prev.filter((a) => a.name !== addon.name) : [...prev, addon]));
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 md:items-center"><div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white shadow-2xl"><FoodVisual emoji={item.emoji} title={item.name} image={item.image} className="h-56 rounded-t-[2rem]" gradient={item.gradient} /><div className="p-6"><div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-2xl font-black">{item.name}</h2><p className="mt-1 text-sm leading-6 text-stone-500">{item.description}</p></div><button onClick={onClose} className="rounded-full bg-stone-100 p-2"><I.x size={18} /></button></div>{item.addons.length > 0 && <div className="mt-5"><p className="mb-3 font-black">Choose add-ons</p><div className="grid gap-2">{item.addons.map((addon) => { const active = selectedAddons.some((a) => a.name === addon.name); return <button key={addon.name} onClick={() => toggleAddon(addon)} className={cn("flex items-center justify-between rounded-2xl border p-4 text-left", active ? "border-[#D62828] bg-red-50" : "border-orange-100 bg-[#FFF8F0]")}><span className="font-bold">{addon.name}</span><span className="font-black">+₹{addon.price}</span></button>; })}</div></div>}<div className="mt-5"><p className="mb-3 font-black">Spice level</p><div className="grid grid-cols-3 gap-2">{["Mild", "Medium", "Spicy"].map((level) => <button key={level} onClick={() => setSpice(level)} className={cn("rounded-2xl py-3 text-sm font-black", spice === level ? "bg-[#D62828] text-white" : "bg-[#FFF8F0] text-stone-600 ring-1 ring-orange-100")}>{level}</button>)}</div></div><div className="mt-5"><p className="mb-3 font-black">Quantity</p><div className="inline-flex items-center gap-3 rounded-full bg-[#FFF8F0] p-2 ring-1 ring-orange-100"><button onClick={() => setSelectedQty((q) => Math.max(1, q - 1))} className="rounded-full bg-white p-3 shadow-sm"><I.minus size={16} /></button><span className="w-10 text-center text-lg font-black">{selectedQty}</span><button onClick={() => setSelectedQty((q) => q + 1)} className="rounded-full bg-[#D62828] p-3 text-white shadow-sm"><I.plus size={16} /></button></div></div><div className="mt-5"><p className="mb-3 font-black">Special instruction</p><textarea value={itemNote} onChange={(e) => setItemNote(e.target.value)} placeholder="Less spicy, no onion, extra sauce..." className="h-24 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-4 font-medium outline-none focus:ring-2 focus:ring-orange-200" /></div><Button onClick={onAdd} className="mt-6 w-full rounded-2xl py-4 text-base">Add {selectedQty} to Cart • ₹{total * selectedQty}</Button></div></div></div>;
}

function SuggestionModal({ source, items, onAdd, onRemove, onClose, onViewCart }) {
  const [addedQty, setAddedQty] = useState({});

  const addOne = (item) => {
    onAdd(item);
    setAddedQty((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeOne = (item) => {
    const currentQty = addedQty[item.id] || 0;
    if (currentQty <= 0) return;
    onRemove(item);
    setAddedQty((prev) => ({ ...prev, [item.id]: Math.max(0, currentQty - 1) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 md:items-center">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F77F00]">Added to cart</p>
            <h2 className="mt-1 text-2xl font-black">Complete your meal</h2>
            <p className="mt-1 text-sm text-stone-500">{source.name} pairs well with these items.</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-stone-100 p-2">
            <I.x size={18} />
          </button>
        </div>

        <div className="grid gap-3">
          {items.map((item) => {
            const qty = addedQty[item.id] || 0;
            const isAdded = qty > 0;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 rounded-3xl p-3 transition-all duration-200",
                  isAdded ? "bg-green-50 ring-2 ring-green-400" : "bg-[#FFF8F0] ring-1 ring-orange-100"
                )}
              >
                <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl", isAdded ? "ring-1 ring-green-200" : "")}>{item.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-black">{item.name}</p>
                  <p className={cn("text-sm font-bold", isAdded ? "text-green-700" : "text-stone-500")}>{isAdded ? `${qty} added to cart` : `₹${item.price}`}</p>
                </div>

                {isAdded ? (
                  <div className="flex items-center gap-2 rounded-full bg-white p-1 ring-1 ring-green-200">
                    <button onClick={() => removeOne(item)} className="rounded-full bg-stone-100 p-2 text-stone-700">
                      <I.minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-black">{qty}</span>
                    <button onClick={() => addOne(item)} className="rounded-full bg-green-600 p-2 text-white">
                      <I.plus size={14} />
                    </button>
                  </div>
                ) : (
                  <Button onClick={() => addOne(item)} variant="dark" className="px-4 py-2">Add</Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button onClick={onClose} variant="outline" className="rounded-2xl py-4">Continue Menu</Button>
          <Button onClick={onViewCart} className="rounded-2xl py-4">View Cart</Button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, cartTotal, updateQty, onClose, onPlaceOrder, customer, setCustomer }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/50"><div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-orange-100 p-5"><div><p className="text-sm font-black uppercase tracking-[0.2em] text-[#F77F00]">Cart</p><h2 className="text-2xl font-black">Your order</h2></div><button onClick={onClose} className="rounded-full bg-stone-100 p-2"><I.x /></button></div><div className="flex-1 overflow-y-auto p-5">{cart.length === 0 ? <div className="rounded-3xl bg-[#FFF8F0] p-8 text-center"><I.cart className="mx-auto mb-3 text-stone-400" /><p className="font-black">Your cart is empty</p></div> : <div className="grid gap-3">{cart.map((item) => <div key={item.key} className="rounded-3xl bg-[#FFF8F0] p-4 ring-1 ring-orange-100"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{item.name}</p><p className="mt-1 text-xs font-semibold text-stone-500">Spice: {item.spice}</p>{item.addons.length > 0 && <p className="mt-1 text-xs text-stone-500">{item.addons.map((a) => a.name).join(", ")}</p>}{item.note && <p className="mt-1 text-xs text-[#D62828]">Note: {item.note}</p>}</div><p className="font-black">₹{item.lineTotal * item.qty}</p></div><div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2 rounded-full bg-white p-1 ring-1 ring-orange-100"><button onClick={() => updateQty(item.key, -1)} className="rounded-full bg-stone-100 p-2"><I.minus size={14} /></button><span className="w-8 text-center font-black">{item.qty}</span><button onClick={() => updateQty(item.key, 1)} className="rounded-full bg-[#D62828] p-2 text-white"><I.plus size={14} /></button></div><button onClick={() => updateQty(item.key, -item.qty)} className="text-stone-400 hover:text-red-600"><I.trash size={18} /></button></div></div>)}</div>}{cart.length > 0 && <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-orange-100"><p className="mb-3 font-black">Customer details</p><input value={customer.name} onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" className="mb-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-4 font-semibold outline-none" /><input value={customer.phone} onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Mobile number" className="mb-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-4 font-semibold outline-none" /><div className="grid grid-cols-2 gap-2">{["Dine-in", "Takeaway"].map((option) => <button key={option} onClick={() => setCustomer((prev) => ({ ...prev, type: option }))} className={cn("rounded-2xl py-3 font-black", customer.type === option ? "bg-[#D62828] text-white" : "bg-[#FFF8F0] text-stone-600 ring-1 ring-orange-100")}>{option}</button>)}</div><div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Payment: Pay at Counter</div></div>}</div><div className="border-t border-orange-100 p-5"><div className="mb-4 flex items-center justify-between text-xl font-black"><span>Total</span><span>₹{cartTotal}</span></div><Button disabled={!cart.length} onClick={onPlaceOrder} className="w-full rounded-2xl py-4 text-base">Place Order</Button></div></div></div>;
}

function SuccessPage({ order, setView }) {
  return <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-12"><div className="w-full rounded-[2rem] bg-white p-8 text-center shadow-xl ring-1 ring-orange-100"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600"><I.check size={44} /></div><p className="text-sm font-black uppercase tracking-[0.25em] text-[#F77F00]">Order Received</p><h1 className="mt-2 text-4xl font-black">Your order is placed!</h1>{order && <p className="mt-3 text-lg font-black text-[#D62828]">Order #{order.id} • ₹{order.total}</p>}<p className="mx-auto mt-4 max-w-md leading-7 text-stone-500">Your order has been sent to the restaurant staff. Please pay at the counter when requested.</p><div className="mt-6 rounded-3xl bg-[#FFF8F0] p-5"><p className="font-black">Order Status</p><div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-stone-600"><span className="rounded-full bg-[#D62828] px-3 py-2 text-white">Placed</span><span>→</span><span>Confirmed</span><span>→</span><span>Preparing</span><span>→</span><span>Ready</span></div></div><Button onClick={() => setView("menu")} className="mt-6 px-8 py-4">Order More</Button></div></main>;
}

function AdminPanel({ adminTab, setAdminTab, orders, moveOrder, menuItems, updateProduct, addProduct, addManualOrder, offers, setOffers, coupons, setCoupons }) {
  const tabs = ["Dashboard", "Orders", "Add Order", "Products", "Offers", "Coupons", "Analytics", "Settings"];
  return <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr] md:px-8"><aside className="rounded-[2rem] bg-[#1F1F1F] p-4 text-white shadow-xl"><div className="mb-6 rounded-3xl bg-white/10 p-4"><p className="text-xl font-black">Admin Panel</p><p className="mt-1 text-sm text-white/60">Cafe Last Bite control center</p></div><nav className="grid gap-2">{tabs.map((tab) => <button key={tab} onClick={() => setAdminTab(tab)} className={cn("rounded-2xl px-4 py-3 text-left text-sm font-black transition", adminTab === tab ? "bg-[#D62828] text-white" : "text-white/70 hover:bg-white/10 hover:text-white")}>{tab}</button>)}</nav></aside><section>{adminTab === "Dashboard" && <AdminDashboard orders={orders} menuItems={menuItems} offers={offers} coupons={coupons} setAdminTab={setAdminTab} />}{adminTab === "Orders" && <OrdersPanel orders={orders} moveOrder={moveOrder} />}{adminTab === "Add Order" && <AddOrderPanel menuItems={menuItems} addManualOrder={addManualOrder} />}{adminTab === "Products" && <ProductsPanel menuItems={menuItems} updateProduct={updateProduct} addProduct={addProduct} />}{adminTab === "Offers" && <OffersPanel offers={offers} setOffers={setOffers} />}{adminTab === "Coupons" && <CouponsPanel coupons={coupons} setCoupons={setCoupons} />}{adminTab === "Analytics" && <AnalyticsPanel orders={orders} menuItems={menuItems} />}{adminTab === "Settings" && <SettingsPanel />}</section></main>;
}

function AdminDashboard({ orders, menuItems, offers, coupons, setAdminTab }) {
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const completed = orders.filter((o) => o.status === "Completed").length;
  const pending = orders.filter((o) => o.status !== "Completed").length;
  const aov = orders.length ? Math.round(totalSales / orders.length) : 0;
  const activeOffers = offers.filter((o) => o.active).length;
  const activeCoupons = coupons.filter((c) => c.active).length;
  return <div><AdminTitle title="Dashboard" subtitle="Today’s sales, orders, menu status and quick actions." /><div className="grid gap-4 md:grid-cols-4"><SummaryCard title="Today Sales" value={`₹${totalSales}`} /><SummaryCard title="Today Orders" value={orders.length} /><SummaryCard title="Pending Orders" value={pending} /><SummaryCard title="Completed" value={completed} /><SummaryCard title="Avg Order Value" value={`₹${aov}`} /><SummaryCard title="Menu Items" value={menuItems.length} /><SummaryCard title="Active Offers" value={activeOffers} /><SummaryCard title="Active Coupons" value={activeCoupons} /></div><div className="mt-6 grid gap-5 lg:grid-cols-3"><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100 lg:col-span-2"><p className="text-xl font-black">Quick Actions</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><Button onClick={() => setAdminTab("Add Order")} className="rounded-2xl py-5">Add Manual Order</Button><Button onClick={() => setAdminTab("Products")} variant="outline" className="rounded-2xl py-5">Manage Products</Button><Button onClick={() => setAdminTab("Offers")} variant="outline" className="rounded-2xl py-5">Create Offer</Button><Button onClick={() => setAdminTab("Analytics")} variant="dark" className="rounded-2xl py-5">View Analytics</Button></div></div><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="text-xl font-black">Recent Orders</p><div className="mt-4 grid gap-3">{orders.slice(0, 4).map((o) => <div key={o.id} className="rounded-2xl bg-[#FFF8F0] p-3"><p className="font-black">#{o.id} • ₹{o.total}</p><p className="text-xs font-bold text-stone-500">{o.customer} • {o.status}</p></div>)}</div></div></div></div>;
}

function OrdersPanel({ orders, moveOrder }) {
  const statuses = ["New", "Preparing", "Ready", "Completed"];
  return <div><AdminTitle title="Live Orders" subtitle="Process QR and counter orders from New to Completed." /><div className="grid gap-4 lg:grid-cols-4">{statuses.map((status) => { const list = orders.filter((order) => order.status === status); return <div key={status} className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-orange-100"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">{status}</h2><span className="rounded-full bg-[#FFF8F0] px-3 py-1 text-sm font-black text-[#D62828]">{list.length}</span></div><div className="grid gap-3">{list.map((order) => <OrderCard key={order.id} order={order} moveOrder={moveOrder} />)}{list.length === 0 && <div className="rounded-3xl bg-[#FFF8F0] p-6 text-center text-sm font-bold text-stone-400">No orders</div>}</div></div>; })}</div></div>;
}

function OrderCard({ order, moveOrder }) {
  const nextStatus = order.status === "New" ? "Preparing" : order.status === "Preparing" ? "Ready" : order.status === "Ready" ? "Completed" : null;
  return <div className="rounded-3xl bg-[#FFF8F0] p-4 ring-1 ring-orange-100"><div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-lg font-black">#{order.id}</p><p className="text-xs font-bold text-stone-500">{order.time} • {order.type} • {order.source || "QR"}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D62828]">₹{order.total}</span></div><div className="mb-3 rounded-2xl bg-white p-3"><p className="font-black">{order.customer}</p><p className="text-xs font-bold text-stone-500">{order.phone}</p></div><div className="grid gap-1 text-sm font-semibold text-stone-700">{order.items.map((item, index) => <p key={`${order.id}-${index}`}>{item}</p>)}</div><p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold text-stone-500">Instruction: {order.instruction}</p>{nextStatus && <Button onClick={() => moveOrder(order.id, nextStatus)} className="mt-4 w-full rounded-2xl py-3">Mark {nextStatus}</Button>}</div>;
}

function AddOrderPanel({ menuItems, addManualOrder }) {
  const [manualCart, setManualCart] = useState([]);
  const [query, setQuery] = useState("");
  const [manualCustomer, setManualCustomer] = useState({ name: "Counter Customer", phone: "", type: "Dine-in" });
  const total = manualCart.reduce((sum, item) => sum + item.lineTotal * item.qty, 0);
  const add = (item) => setManualCart((prev) => [...prev, { key: `${item.id}-${Date.now()}-${Math.random()}`, id: item.id, name: item.name, qty: 1, addons: [], note: "", lineTotal: item.price }]);
  const update = (key, change) => setManualCart((prev) => prev.map((i) => i.key === key ? { ...i, qty: Math.max(0, i.qty + change) } : i).filter((i) => i.qty > 0));
  const filtered = menuItems.filter((i) => i.available && `${i.name} ${i.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 16);
  const create = () => { addManualOrder(manualCart, manualCustomer); setManualCart([]); setManualCustomer({ name: "Counter Customer", phone: "", type: "Dine-in" }); };
  return <div><AdminTitle title="Add Manual Order" subtitle="For customers who order at counter without scanning QR." /><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item to add..." className="mb-4 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-4 font-semibold outline-none" /><div className="grid gap-3 md:grid-cols-2">{filtered.map((item) => <button key={item.id} onClick={() => add(item)} className="flex items-center justify-between rounded-2xl bg-[#FFF8F0] p-4 text-left ring-1 ring-orange-100"><span><b>{item.name}</b><br /><small className="text-stone-500">{item.category}</small></span><span className="font-black text-[#D62828]">₹{item.price} +</span></button>)}</div></div><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="text-xl font-black">Order Summary</p><input value={manualCustomer.name} onChange={(e) => setManualCustomer((p) => ({ ...p, name: e.target.value }))} placeholder="Customer name" className="mt-4 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none" /><input value={manualCustomer.phone} onChange={(e) => setManualCustomer((p) => ({ ...p, phone: e.target.value }))} placeholder="Mobile number" className="mt-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none" /><div className="mt-3 grid grid-cols-2 gap-2">{["Dine-in", "Takeaway"].map((t) => <button key={t} onClick={() => setManualCustomer((p) => ({ ...p, type: t }))} className={cn("rounded-2xl py-3 font-black", manualCustomer.type === t ? "bg-[#D62828] text-white" : "bg-[#FFF8F0] ring-1 ring-orange-100")}>{t}</button>)}</div><div className="mt-4 grid gap-2">{manualCart.map((item) => <div key={item.key} className="flex items-center justify-between rounded-2xl bg-[#FFF8F0] p-3"><span className="font-bold">{item.qty} x {item.name}</span><span className="flex items-center gap-2"><button onClick={() => update(item.key, -1)} className="rounded-full bg-white p-1"><I.minus size={14} /></button><button onClick={() => update(item.key, 1)} className="rounded-full bg-[#D62828] p-1 text-white"><I.plus size={14} /></button></span></div>)}</div><div className="mt-5 flex justify-between text-xl font-black"><span>Total</span><span>₹{total}</span></div><Button disabled={!manualCart.length} onClick={create} className="mt-4 w-full rounded-2xl py-4">Create Order</Button></div></div></div>;
}

function ProductsPanel({ menuItems, updateProduct, addProduct }) {
  const [filter, setFilter] = useState("All");
  const [draft, setDraft] = useState({
    name: "",
    category: "Burgers",
    price: "",
    time: "8-12 min",
    description: "",
    image: "",
    bestseller: false,
  });

  const visible = menuItems.filter((item) => filter === "All" || item.category === filter);

  const save = () => {
    if (!draft.name.trim() || !Number(draft.price)) return;

    const id =
      draft.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    addProduct(
      makeItem(id, draft.category, draft.name.trim(), Number(draft.price), {
        time: draft.time,
        description: draft.description || getMenuDescription(draft.name, draft.category),
        image: draft.image,
        bestseller: draft.bestseller,
        addons: defaultAddons,
        emoji: categoryEmoji[draft.category],
      })
    );

    setDraft({
      name: "",
      category: "Burgers",
      price: "",
      time: "8-12 min",
      description: "",
      image: "",
      bestseller: false,
    });
  };

  return (
    <div>
      <AdminTitle
        title="Products / Menu Management"
        subtitle="Add products, edit price, add images, mark bestseller, and set available/unavailable."
      />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-xl font-black">Add New Product</p>

          <input
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            placeholder="Product name"
            className="mt-4 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none"
          />

          <select
            value={draft.category}
            onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
            className="mt-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none"
          >
            {categories
              .filter((c) => c !== "Recommended")
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>

          <input
            value={draft.price}
            onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
            placeholder="Price"
            type="number"
            className="mt-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none"
          />

          <input
            value={draft.time}
            onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))}
            placeholder="Prep time"
            className="mt-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none"
          />

          <textarea
            value={draft.description}
            onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description"
            className="mt-3 h-24 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none"
          />

          <input
            value={draft.image}
            onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))}
            placeholder="Product image URL"
            className="mt-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none"
          />

          <p className="mt-2 text-xs font-bold text-stone-500">
            Prototype: paste an image URL. Final backend can use an Upload Image button.
          </p>

          {draft.image && (
            <div className="mt-3 overflow-hidden rounded-2xl bg-stone-100">
              <img src={draft.image} alt="Product preview" className="h-36 w-full object-cover" />
            </div>
          )}

          <label className="mt-3 flex items-center gap-2 rounded-2xl bg-[#FFF8F0] p-3 font-black">
            <input
              type="checkbox"
              checked={draft.bestseller}
              onChange={(e) => setDraft((p) => ({ ...p, bestseller: e.target.checked }))}
            />
            Bestseller
          </label>

          <Button onClick={save} className="mt-4 w-full rounded-2xl py-4">
            Save Product
          </Button>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xl font-black">Current Menu Items</p>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none"
            >
              <option>All</option>
              {categories
                .filter((c) => c !== "Recommended")
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </div>

          <div className="max-h-[720px] overflow-y-auto pr-1">
            <div className="grid gap-3">
              {visible.map((item) => (
                <ProductRow key={item.id} item={item} updateProduct={updateProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ item, updateProduct }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: item.name,
    price: item.price,
    category: item.category,
    time: item.time,
    description: item.description,
    image: item.image || "",
  });

  const save = () => {
    updateProduct(item.id, {
      ...draft,
      price: Number(draft.price) || item.price,
    });
    setEditing(false);
  };

  return (
    <div className="rounded-3xl bg-[#FFF8F0] p-4 ring-1 ring-orange-100">
      {editing ? (
        <div className="grid gap-2 md:grid-cols-2">
          <input
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            className="rounded-xl bg-white p-3 font-bold outline-none"
          />

          <input
            value={draft.price}
            type="number"
            onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
            className="rounded-xl bg-white p-3 font-bold outline-none"
          />

          <select
            value={draft.category}
            onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
            className="rounded-xl bg-white p-3 font-bold outline-none"
          >
            {categories
              .filter((c) => c !== "Recommended")
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>

          <input
            value={draft.time}
            onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))}
            className="rounded-xl bg-white p-3 font-bold outline-none"
          />

          <textarea
            value={draft.description}
            onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
            className="rounded-xl bg-white p-3 font-bold outline-none md:col-span-2"
          />

          <input
            value={draft.image}
            onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))}
            placeholder="Product image URL"
            className="rounded-xl bg-white p-3 font-bold outline-none md:col-span-2"
          />

          {draft.image && (
            <div className="overflow-hidden rounded-2xl bg-stone-100 md:col-span-2">
              <img src={draft.image} alt="Product preview" className="h-36 w-full object-cover" />
            </div>
          )}

          <div className="flex gap-2 md:col-span-2">
            <Button onClick={save} className="rounded-xl py-2">
              Save
            </Button>
            <Button onClick={() => setEditing(false)} variant="outline" className="rounded-xl py-2">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl">
                {item.emoji}
              </div>
            )}
            <div>
              <p className="font-black">
                {item.name} <span className="text-[#D62828]">₹{item.price}</span>
              </p>
              <p className="text-xs font-bold text-stone-500">
                {item.category} • {item.time}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateProduct(item.id, { available: !item.available })}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-black",
                item.available ? "bg-green-50 text-green-700" : "bg-stone-200 text-stone-600"
              )}
            >
              {item.available ? "Available" : "Unavailable"}
            </button>
            <button
              onClick={() => updateProduct(item.id, { bestseller: !item.bestseller })}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-black",
                item.bestseller ? "bg-amber-100 text-amber-700" : "bg-white text-stone-500"
              )}
            >
              {item.bestseller ? "Bestseller" : "Set Bestseller"}
            </button>
            <Button onClick={() => setEditing(true)} variant="outline" className="px-3 py-2 text-xs">
              <I.edit size={14} /> Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function OffersPanel({ offers, setOffers }) {
  const [draft, setDraft] = useState({ title: "", detail: "", price: "" });
  const add = () => { if (!draft.title.trim()) return; setOffers((p) => [{ id: `offer-${Date.now()}`, title: draft.title, detail: draft.detail, price: Number(draft.price) || 0, active: true }, ...p]); setDraft({ title: "", detail: "", price: "" }); };
  return <SimpleListPanel title="Offers & Deals" subtitle="Create combos, limited offers and meal deals." draft={draft} setDraft={setDraft} add={add} items={offers} setItems={setOffers} fields={["title", "detail", "price"]} />;
}

function CouponsPanel({ coupons, setCoupons }) {
  const [draft, setDraft] = useState({ code: "", discount: "" });
  const add = () => { if (!draft.code.trim()) return; setCoupons((p) => [{ id: `coupon-${Date.now()}`, code: draft.code.toUpperCase(), discount: draft.discount, active: true }, ...p]); setDraft({ code: "", discount: "" }); };
  return <SimpleListPanel title="Coupons" subtitle="Create coupon codes for discounts and campaigns." draft={draft} setDraft={setDraft} add={add} items={coupons} setItems={setCoupons} fields={["code", "discount"]} />;
}

function SimpleListPanel({ title, subtitle, draft, setDraft, add, items, setItems, fields }) {
  return <div><AdminTitle title={title} subtitle={subtitle} /><div className="grid gap-5 lg:grid-cols-[360px_1fr]"><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="text-xl font-black">Create New</p>{fields.map((f) => <input key={f} value={draft[f]} onChange={(e) => setDraft((p) => ({ ...p, [f]: e.target.value }))} placeholder={f === "price" ? "Deal price" : f} className="mt-3 w-full rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-semibold outline-none" />)}<Button onClick={add} className="mt-4 w-full rounded-2xl py-4">Add</Button></div><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="text-xl font-black">Current List</p><div className="mt-4 grid gap-3">{items.map((item) => <div key={item.id} className="flex items-center justify-between rounded-3xl bg-[#FFF8F0] p-4 ring-1 ring-orange-100"><div><p className="font-black">{item.title || item.code}</p><p className="text-sm font-bold text-stone-500">{item.detail || item.discount}{item.price ? ` • ₹${item.price}` : ""}</p></div><button onClick={() => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, active: !x.active } : x))} className={cn("rounded-full px-3 py-2 text-xs font-black", item.active ? "bg-green-50 text-green-700" : "bg-stone-200 text-stone-600")}>{item.active ? "Active" : "Inactive"}</button></div>)}</div></div></div></div>;
}

function AnalyticsPanel({ orders, menuItems }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const aov = orders.length ? Math.round(totalSales / orders.length) : 0;
  const topCategories = categories.filter((c) => c !== "Recommended").map((cat) => ({ cat, count: menuItems.filter((i) => i.category === cat).length })).sort((a, b) => b.count - a.count).slice(0, 8);
  return <div><AdminTitle title="Analytics" subtitle="Custom date analysis for orders, items and menu performance." /><div className="mb-5 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="font-black">Custom Date Range</p><div className="mt-3 grid gap-3 md:grid-cols-3"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none" /><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none" /><Button variant="dark" className="rounded-2xl">Apply Filter</Button></div></div><div className="grid gap-4 md:grid-cols-4"><SummaryCard title="Sales" value={`₹${totalSales}`} /><SummaryCard title="Orders" value={orders.length} /><SummaryCard title="Average Order" value={`₹${aov}`} /><SummaryCard title="Menu Items" value={menuItems.length} /></div><div className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="text-xl font-black">Category Menu Strength</p><div className="mt-4 grid gap-3">{topCategories.map((x) => <div key={x.cat} className="rounded-2xl bg-[#FFF8F0] p-3"><div className="flex justify-between font-black"><span>{x.cat}</span><span>{x.count} items</span></div><div className="mt-2 h-2 rounded-full bg-orange-100"><div className="h-2 rounded-full bg-[#D62828]" style={{ width: `${Math.min(100, x.count * 10)}%` }} /></div></div>)}</div></div></div>;
}

function SettingsPanel() {
  return <div><AdminTitle title="Settings" subtitle="Restaurant profile, payment mode, timing and basic configuration." /><div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100"><div className="grid gap-3 md:grid-cols-2"><input defaultValue="Cafe Last Bite" className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none" /><input defaultValue="Pay at Counter" className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none" /><input defaultValue="+91 787-971-3633" className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none" /><input defaultValue="Pure Veg Fast Food Cafe" className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-3 font-bold outline-none" /></div><Button className="mt-4 rounded-2xl">Save Settings</Button></div></div>;
}

function AdminTitle({ title, subtitle }) {
  return <div className="mb-6"><p className="font-bold uppercase tracking-[0.25em] text-[#F77F00]">Admin</p><h1 className="mt-2 text-4xl font-black md:text-5xl">{title}</h1><p className="mt-2 text-stone-500">{subtitle}</p></div>;
}

function SummaryCard({ title, value }) {
  return <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100"><p className="text-sm font-bold text-stone-500">{title}</p><p className="mt-2 text-3xl font-black text-[#D62828]">{value}</p></div>;
}
