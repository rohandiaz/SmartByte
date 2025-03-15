// components/recipe/recipe-generator-form.tsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { RecipeSuggestionRequest } from '@/types/recipe';

type RecipeGeneratorFormProps = {
  onGenerate: (recipeData: RecipeSuggestionRequest) => Promise<void>;
};

export function RecipeGeneratorForm({ onGenerate }: RecipeGeneratorFormProps) {
  const [ingredients, setIngredients] = useState<string>('');
  const [maxTotalTime, setMaxTotalTime] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onGenerate({
        ingredients: ingredients.split(',').map(item => item.trim()).filter(Boolean),
        preferences: {
          maxTotalTime: maxTotalTime ? parseInt(maxTotalTime, 10) : undefined,
          difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' | undefined,
          dietaryRestrictions: dietaryRestrictions ? dietaryRestrictions.split(',').map(item => item.trim()).filter(Boolean) : undefined,
        }
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Generate a Recipe</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
            Available Ingredients (comma separated)
          </label>
          <Input
            id="ingredients"
            placeholder="e.g. chicken, rice, broccoli, garlic"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="maxTotalTime" className="block text-sm font-medium text-gray-700 mb-1">
              Max Total Time (minutes)
            </label>
            <Input
              id="maxTotalTime"
              type="number"
              placeholder="e.g. 30"
              value={maxTotalTime}
              onChange={(e) => setMaxTotalTime(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="w-full rounded-md border border-gray-300 p-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
            >
              <option value="">Any difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Restrictions (comma separated)
            </label>
            <Input
              id="dietaryRestrictions"
              placeholder="e.g. vegetarian, gluten-free"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full py-2"
          disabled={isLoading || !ingredients.trim()}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Recipe'}
        </Button>
      </form>
    </div>
  );
}