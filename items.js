// Price data for the "How many...?" price game.
// Prices are approximate typical/median prices in Dublin, Ireland (2026),
// rounded to friendly numbers for gameplay. See README.md for sourcing notes.
//
// Each item: { id, name, caption, emoji, image, price, category }
// `image` is null for now — set it to a URL/path to use a picture instead of the emoji.

window.ITEMS = [
  // ---- Food & small everyday things ----
  { id: 'milk', name: 'Milk', caption: '1 litre of milk', emoji: '🥛', image: null, price: 1.35, category: 'food' },
  { id: 'bread', name: 'Bread', caption: 'a loaf of bread', emoji: '🍞', image: null, price: 2.30, category: 'food' },
  { id: 'eggs', name: 'Eggs', caption: 'a dozen eggs', emoji: '🥚', image: null, price: 4.20, category: 'food' },
  { id: 'coffee', name: 'Coffee', caption: 'a takeaway coffee', emoji: '☕', image: null, price: 4.00, category: 'food' },
  { id: 'icecream', name: 'Ice cream', caption: 'an ice cream cone', emoji: '🍦', image: null, price: 3.50, category: 'food' },
  { id: 'pint', name: 'Pint', caption: 'a pint in the pub', emoji: '🍺', image: null, price: 6.50, category: 'food' },
  { id: 'pizza', name: 'Pizza', caption: 'a takeaway pizza', emoji: '🍕', image: null, price: 15, category: 'food' },
  { id: 'chocolate', name: 'Chocolate', caption: 'a bar of chocolate', emoji: '🍫', image: null, price: 2.00, category: 'food' },

  // ---- Household items ----
  { id: 'bulb', name: 'Light bulb', caption: 'an LED light bulb', emoji: '💡', image: null, price: 4, category: 'household' },
  { id: 'pan', name: 'Frying pan', caption: 'a frying pan', emoji: '🍳', image: null, price: 28, category: 'household' },
  { id: 'chair', name: 'Chair', caption: 'a kitchen chair', emoji: '🪑', image: null, price: 55, category: 'household' },
  { id: 'vacuum', name: 'Vacuum cleaner', caption: 'a vacuum cleaner', emoji: '🧹', image: null, price: 150, category: 'household' },
  { id: 'bed', name: 'Bed', caption: 'a double bed', emoji: '🛏️', image: null, price: 650, category: 'household' },
  { id: 'tv', name: 'TV', caption: 'a 55" smart TV', emoji: '📺', image: null, price: 500, category: 'household' },
  { id: 'sofa', name: 'Sofa', caption: 'a 3-seater sofa', emoji: '🛋️', image: null, price: 900, category: 'household' },

  // ---- Kid-related items ----
  { id: 'balloon', name: 'Balloon', caption: 'a party balloon', emoji: '🎈', image: null, price: 3, category: 'kids' },
  { id: 'toy', name: 'Teddy bear', caption: 'a teddy bear toy', emoji: '🧸', image: null, price: 22, category: 'kids' },
  { id: 'boardgame', name: 'Board game', caption: 'a board game', emoji: '🎲', image: null, price: 25, category: 'kids' },
  { id: 'football', name: 'Football', caption: 'a football', emoji: '⚽', image: null, price: 18, category: 'kids' },
  { id: 'cinema', name: 'Cinema ticket', caption: 'a cinema ticket', emoji: '🎬', image: null, price: 10, category: 'kids' },
  { id: 'cake', name: 'Birthday cake', caption: 'a birthday cake', emoji: '🎂', image: null, price: 40, category: 'kids' },
  { id: 'scooter', name: 'Kick scooter', caption: 'a kids’ kick scooter', emoji: '🛴', image: null, price: 45, category: 'kids' },
  { id: 'kidsbike', name: 'Kids’ bike', caption: 'a small kids’ bike', emoji: '🚲', image: null, price: 180, category: 'kids' },
  { id: 'console', name: 'Game console', caption: 'a video game console', emoji: '🎮', image: null, price: 450, category: 'kids' },
  { id: 'entertainer', name: 'Party entertainer', caption: 'a birthday party entertainer', emoji: '🤹', image: null, price: 220, category: 'kids' },
  { id: 'perfbike', name: 'Multi-speed bike', caption: 'a multi-speed bicycle', emoji: '🚵', image: null, price: 600, category: 'kids' },

  // ---- Grown-up things ----
  { id: 'android', name: 'Android phone', caption: 'a mid-range Android phone', emoji: '📱', image: null, price: 350, category: 'adult' },
  { id: 'laptop', name: 'Laptop', caption: 'a laptop computer', emoji: '💻', image: null, price: 900, category: 'adult' },
  { id: 'iphone', name: 'iPhone', caption: 'the latest iPhone', emoji: '📱', image: null, price: 1100, category: 'adult' },
  { id: 'vacation_solo', name: 'Solo trip', caption: 'a week abroad, solo', emoji: '🏖️', image: null, price: 1200, category: 'adult' },
  { id: 'rent', name: 'Monthly rent', caption: 'a month’s rent (1-bed, Dublin)', emoji: '🔑', image: null, price: 2100, category: 'adult' },
  { id: 'minwage', name: 'Minimum wage', caption: 'a month on minimum wage', emoji: '💶', image: null, price: 2340, category: 'adult' },
  { id: 'vacation_family', name: 'Family vacation', caption: 'a week abroad for a family', emoji: '🏖️', image: null, price: 4000, category: 'adult' },
  { id: 'medianwage', name: 'Median wage', caption: 'a month on median wage', emoji: '💶', image: null, price: 3750, category: 'adult' },
  { id: 'wedding', name: 'Wedding', caption: 'an average wedding', emoji: '💍', image: null, price: 28000, category: 'adult' },
  { id: 'car', name: 'Car', caption: 'a new car', emoji: '🚗', image: null, price: 32000, category: 'adult' },
  { id: 'house', name: 'House', caption: 'a house in Dublin', emoji: '🏠', image: null, price: 480000, category: 'adult' },

  // ---- Clothes ----
  { id: 'socks', name: 'Socks', caption: 'a pair of socks', emoji: '🧦', image: null, price: 5, category: 'clothes' },
  { id: 'underwear', name: 'Underwear', caption: 'a pack of underwear', emoji: '🩲', image: null, price: 8, category: 'clothes' },
  { id: 'tshirt', name: 'T-shirt', caption: 'a T-shirt', emoji: '👕', image: null, price: 12, category: 'clothes' },
  { id: 'kids_jacket', name: "Kids' jacket", caption: "a kids' jacket", emoji: '🧥', image: null, price: 35, category: 'clothes' },
  { id: 'trousers', name: 'Trousers', caption: 'a pair of trousers', emoji: '👖', image: null, price: 45, category: 'clothes' },
  { id: 'jersey', name: 'Jersey', caption: 'a sports jersey', emoji: '🎽', image: null, price: 75, category: 'clothes' },
  { id: 'trainers', name: 'Trainers', caption: 'a pair of trainers', emoji: '👟', image: null, price: 70, category: 'clothes' },
  { id: 'dress', name: 'Dress', caption: 'a dress', emoji: '👗', image: null, price: 55, category: 'clothes' },
  { id: 'jacket', name: 'Jacket', caption: 'a grown-up jacket', emoji: '🧥', image: null, price: 90, category: 'clothes' },

  // ---- Ridiculous things ----
  { id: 'rocket', name: 'Rocket launch', caption: 'a rocket launch', emoji: '🚀', image: null, price: 65000000, category: 'ridiculous' },
  { id: 'a320', name: 'Airbus A320', caption: 'a new Airbus A320neo', emoji: '✈️', image: null, price: 110000000, category: 'ridiculous' },
  { id: 'stadium', name: 'Stadium', caption: 'building a sports stadium', emoji: '🏟️', image: null, price: 400000000, category: 'ridiculous' },
  { id: 'a380', name: 'Airbus A380', caption: 'a new Airbus A380', emoji: '✈️', image: null, price: 400000000, category: 'ridiculous' },
  { id: 'skyscraper', name: 'Skyscraper', caption: 'building a skyscraper', emoji: '🏙️', image: null, price: 500000000, category: 'ridiculous' },
  { id: 'cruiseship', name: 'Cruise ship', caption: 'a large cruise ship', emoji: '🚢', image: null, price: 1000000000, category: 'ridiculous' },
];
