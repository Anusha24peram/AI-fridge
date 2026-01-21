
export interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
  expiryDate?: string; // ISO string
}

export interface Recipe {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: { name: string; isMissing: boolean }[];
  steps: string[];
  description: string;
  imageDescription: string;
  rating: number;
  reviewCount: number;
  recentReviews: Review[];
}

export enum DietaryRestriction {
  NONE = 'None',
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  KETO = 'Keto',
  PALEO = 'Paleo',
  GLUTEN_FREE = 'Gluten-Free'
}

export type AppView = 'SCANNER' | 'RECIPES' | 'COOKING' | 'SHOPPING' | 'PANTRY';
