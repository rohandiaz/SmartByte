import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recipe, RecipeSuggestionRequest, NutritionalInfo } from '@/types/recipe';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type GeneratedRecipe = {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: number | null;
  prepTime: number | null;
  servings: number | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[];
  nutritionalInfo?: NutritionalInfo;
};

export async function generateRecipe(request: RecipeSuggestionRequest): Promise<GeneratedRecipe> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct the prompt
    let prompt = `Generate a detailed recipe using these ingredients: ${request.ingredients.join(', ')}.\n`;
    
    // Handle preferences
    if (request.preferences) {
      if (request.preferences.maxTotalTime) {
        prompt += `The total cooking time should not exceed ${request.preferences.maxTotalTime} minutes.\n`;
      }
      
      if (request.preferences.difficulty) {
        prompt += `The recipe should be ${request.preferences.difficulty.toLowerCase()} difficulty level.\n`;
      }
      
      if (request.preferences.dietaryRestrictions && request.preferences.dietaryRestrictions.length > 0) {
        prompt += `Follow these dietary restrictions: ${request.preferences.dietaryRestrictions.join(', ')}.\n`;
      }
      
      // Added cuisine preference
      if (request.preferences.cuisine) {
        prompt += `The recipe should be ${request.preferences.cuisine} cuisine.\n`;
      }
      
      // Added calorie restriction
      if (request.preferences.maxCalories) {
        prompt += `Each serving should not exceed ${request.preferences.maxCalories} calories.\n`;
      }
      
      // Added preference for number of servings
      if (request.preferences.servings) {
        prompt += `The recipe should serve ${request.preferences.servings} people.\n`;
      }
      
      // Added meal type preference
      if (request.preferences.mealType) {
        prompt += `This should be a recipe for ${request.preferences.mealType}.\n`;
      }
    }
    
    prompt += `
    Return the response in the following JSON format:
    {
      "title": "Recipe Title",
      "description": "Brief description of the dish",
      "ingredients": ["Ingredient 1 with quantity", "Ingredient 2 with quantity", ...],
      "instructions": ["Step 1", "Step 2", ...],
      "prepTime": preparation time in minutes (number),
      "cookTime": cooking time in minutes (number),
      "servings": number of servings (number),
      "difficulty": "Easy"/"Medium"/"Hard",
      "cuisine": "The cuisine type (e.g., Italian, Mexican, etc.)",
      "tags": ["tag1", "tag2", ...],
      "nutritionalInfo": {
        "calories": estimated calories per serving (number),
        "protein": grams of protein per serving (number),
        "carbs": grams of carbohydrates per serving (number),
        "fat": grams of fat per serving (number)
      }
    }`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse recipe JSON from AI response');
    }
    
    const recipeData = JSON.parse(jsonMatch[0]) as GeneratedRecipe;
    return recipeData;
  } catch (error) {
    console.error('Error generating recipe with Gemini:', error);
    throw new Error('Failed to generate recipe. Please try again.');
  }
}