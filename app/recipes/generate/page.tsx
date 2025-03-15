'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecipeGeneratorForm } from '@/components/(recipe)/recipe-generator-form';
import { RecipeSuggestionRequest } from '@/types/recipe';

export default function GenerateRecipePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = async (params: RecipeSuggestionRequest) => {
    try {
      setError(null);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const data = await response.json();
      // Redirect to the newly created recipe page
      router.push(`/recipes/${data.recipe.id}`);
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recipe');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Generate a Recipe</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <RecipeGeneratorForm onGenerate={handleGenerateRecipe} />
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Tips for better results:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>List as many ingredients as possible for more creative recipes</li>
          <li>Specify dietary restrictions if you have any</li>
          <li>Choose a cuisine type for more authentic flavor combinations</li>
          <li>Indicate meal type (breakfast, lunch, dinner) for appropriate recipes</li>
          <li>Set number of servings based on how many people you're feeding</li>
          <li>Specify calorie limits if you're watching your intake</li>
          <li>Choose difficulty level based on your cooking experience</li>
          <li>Set time constraints if you're in a hurry</li>
          <li>The AI will prioritize using ingredients you've listed</li>
        </ul>
      </div>
    </div>
  );
}