import { Recipe, RecipeFormData, RecipeFilters, RecipeSuggestionRequest, NutritionalInfo } from './recipe';

export type {
  Recipe,
  RecipeFormData,
  RecipeFilters,
  RecipeSuggestionRequest,
  NutritionalInfo
};

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GeminiResponse {
  recipes: Recipe[];
  message?: string;
}

export type SortOption = {
  field: string;
  direction: 'asc' | 'desc';
};

export interface AppConfig {
  maxImageSize: number; // in bytes
  defaultPageSize: number;
  maxIngredientsForSuggestion: number;
}