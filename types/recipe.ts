export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  imageUrl: string | null;
  userId: string;
  tags: string[];
  cookTime: number | null;
  isGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  calories?: number | null; // Adding this for consistency with the RecipeCard
  cuisine?: string | null; // Adding this for consistency with the RecipeCard
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  imageUrl?: string;
  cuisine?: string; // Adding this to match the RecipeCard
}

export interface RecipeFilters {
  search?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  maxPrepTime?: number;
  maxCookTime?: number;
  tags?: string[];
  ingredients?: string[];
  cuisine?: string; // Adding this to filter by cuisine
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
}

export interface RecipeSuggestionRequest {
  ingredients: string[];
  preferences?: {
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    maxTotalTime?: number;
    dietaryRestrictions?: string[];
    cuisine?: string; // Adding this for cuisine preference
  };
}

// New interfaces for recipe operations
export interface RecipeListProps {
  recipes: Recipe[];
  onDelete?: boolean; // Flag to enable/disable delete functionality
}

export interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    cookTime?: number | null;
    calories?: number | null;
    cuisine?: string | null;
    tags: string[];
    isGenerated: boolean;
  };
  onDelete?: (id: string) => Promise<void>;
  isDeleting?: boolean;
}