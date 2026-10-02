// Centralized Food Item Image Utilities, Presets, and Fallback Handlers

export const DEFAULT_FOOD_IMAGE = '/assets/food/hyderabadi-chicken-biryani.jpg';

export const CATEGORY_IMAGE_PRESETS = {
  'Biryani': '/assets/food/hyderabadi-chicken-biryani.jpg',
  'Starter': '/assets/food/chicken-65.jpg',
  'Chicken Curry': '/assets/food/butter-chicken-masala.jpg',
  'Mutton Curry': '/assets/food/mutton-rogan-josh.jpg',
  'Dessert': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80',
  'Dessert / Beverage': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80',
  'Breads / Rice': '/assets/food/butter-chicken-masala.jpg',
  'Vegetarian': '/assets/food/butter-chicken-masala.jpg',
  'Default': DEFAULT_FOOD_IMAGE
};

// Curated authentic restaurant food photo library for quick selection
export const CURATED_FOOD_GALLERY = [
  {
    id: 'biryani-chk',
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    url: '/assets/food/hyderabadi-chicken-biryani.jpg'
  },
  {
    id: 'biryani-mut',
    name: 'Special Mutton Dum Biryani',
    category: 'Biryani',
    url: '/assets/food/special-mutton-biryani.jpg'
  },
  {
    id: 'biryani-c65',
    name: 'Chicken 65 Biryani',
    category: 'Biryani',
    url: '/assets/food/chicken-65-biryani.jpg'
  },
  {
    id: 'biryani-egg',
    name: 'Egg Dum Biryani',
    category: 'Biryani',
    url: '/assets/food/egg-dum-biryani.jpg'
  },
  {
    id: 'starter-c65',
    name: 'Chicken 65 (Crispy & Spicy)',
    category: 'Starter',
    url: '/assets/food/chicken-65.jpg'
  },
  {
    id: 'starter-tan',
    name: 'Tandoori Chicken (Full)',
    category: 'Starter',
    url: '/assets/food/tandoori-chicken.jpg'
  },
  {
    id: 'starter-chilli',
    name: 'Chilli Chicken Dry',
    category: 'Starter',
    url: '/assets/food/chilli-chicken-dry.jpg'
  },
  {
    id: 'starter-majestic',
    name: 'Chicken Majestic',
    category: 'Starter',
    url: '/assets/food/chicken-majestic.jpg'
  },
  {
    id: 'starter-kebab',
    name: 'Mutton Seekh Kebab',
    category: 'Starter',
    url: '/assets/food/mutton-seekh-kebab.jpg'
  },
  {
    id: 'starter-boti',
    name: 'Mutton Boti Kebab',
    category: 'Starter',
    url: '/assets/food/mutton-boti-kebab.jpg'
  },
  {
    id: 'curry-butter',
    name: 'Butter Chicken Masala',
    category: 'Chicken Curry',
    url: '/assets/food/butter-chicken-masala.jpg'
  },
  {
    id: 'curry-andhra',
    name: 'Andhra Chicken Curry',
    category: 'Chicken Curry',
    url: '/assets/food/andhra-chicken-curry.jpg'
  },
  {
    id: 'curry-kadai',
    name: 'Kadai Chicken Gravy',
    category: 'Chicken Curry',
    url: '/assets/food/kadai-chicken-gravy.jpg'
  },
  {
    id: 'curry-rogan',
    name: 'Mutton Rogan Josh',
    category: 'Mutton Curry',
    url: '/assets/food/mutton-rogan-josh.jpg'
  },
  {
    id: 'curry-korma',
    name: 'Hyderabadi Mutton Korma',
    category: 'Mutton Curry',
    url: '/assets/food/mutton-korma.jpg'
  }
];

/**
 * Returns a high-res image URL for any dish, falling back to category presets.
 */
export function getDishImage(dish) {
  if (!dish) {
    return CATEGORY_IMAGE_PRESETS['Default'];
  }
  if (dish.image && typeof dish.image === 'string' && dish.image.trim().length > 0) {
    return dish.image;
  }
  if (dish.category && CATEGORY_IMAGE_PRESETS[dish.category]) {
    return CATEGORY_IMAGE_PRESETS[dish.category];
  }
  return CATEGORY_IMAGE_PRESETS['Default'];
}

/**
 * Image onError fallback handler so broken image links smoothly degrade to a high-res default
 */
export function handleFoodImageError(event, fallbackCategory = 'Biryani') {
  if (event && event.currentTarget) {
    const fallback = CATEGORY_IMAGE_PRESETS[fallbackCategory] || DEFAULT_FOOD_IMAGE;
    if (event.currentTarget.src !== fallback) {
      event.currentTarget.src = fallback;
    }
  }
}

