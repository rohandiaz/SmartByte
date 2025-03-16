import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, ChefHat, Clock, Star, AlertCircle, Pizza, Utensils } from 'lucide-react';
import { RecipeSuggestionRequest } from '@/types/recipe';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type RecipeGeneratorFormProps = {
  onGenerate: (recipeData: RecipeSuggestionRequest) => Promise<void>;
};

export function RecipeGeneratorForm({ onGenerate }: RecipeGeneratorFormProps) {
  const [ingredients, setIngredients] = useState<string>('');
  const [maxTotalTime, setMaxTotalTime] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'any'>('any');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [maxCalories, setMaxCalories] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onGenerate({
        ingredients: ingredients.split(',').map(item => item.trim()).filter(Boolean),
        preferences: {
          maxTotalTime: maxTotalTime ? parseInt(maxTotalTime, 10) : undefined,
          difficulty: difficulty !== 'any' ? difficulty as 'Easy' | 'Medium' | 'Hard' : undefined,
          dietaryRestrictions: dietaryRestrictions ? dietaryRestrictions.split(',').map(item => item.trim()).filter(Boolean) : undefined,
          cuisine: cuisine.trim() || undefined,
          maxCalories: maxCalories ? parseInt(maxCalories, 10) : undefined,
          mealType: mealType.trim() || undefined,
        }
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <ChefHat className="h-8 w-8 text-blue-600 mr-2" />
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            AI Recipe Generator
          </CardTitle>
        </div>
        <CardDescription className="text-center max-w-md mx-auto text-gray-600">
          Enter your available ingredients and preferences, and our AI will create a delicious recipe just for you.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-blue-600" />
              <Label htmlFor="ingredients" className="font-medium">
                Available Ingredients
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">List your ingredients separated by commas. Be as specific as possible for better results.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="ingredients"
              placeholder="e.g. chicken breast, brown rice, broccoli, olive oil, garlic, lemon"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-20 resize-none focus:ring-blue-500"
              required
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium">Preferences</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Pizza className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="cuisine" className="text-sm font-medium">
                    Cuisine Type
                  </Label>
                </div>
                <Input
                  id="cuisine"
                  placeholder="e.g. Italian, Mexican, Thai"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="mealType" className="text-sm font-medium">
                    Meal Type
                  </Label>
                </div>
                <Input
                  id="mealType"
                  placeholder="e.g. breakfast, lunch, dinner, snack"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>
            
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="maxTotalTime" className="text-sm font-medium">
                    Max Time (minutes)
                  </Label>
                </div>
                <Input
                  id="maxTotalTime"
                  type="number"
                  placeholder="e.g. 30"
                  value={maxTotalTime}
                  onChange={(e) => setMaxTotalTime(e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty Level
                  </Label>
                </div>
                <Select 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as 'Easy' | 'Medium' | 'Hard' | 'any')}
                >
                  <SelectTrigger id="difficulty" className="focus:ring-blue-500">
                    <SelectValue placeholder="Choose difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any difficulty</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="dietaryRestrictions" className="text-sm font-medium">
                    Dietary Restrictions
                  </Label>
                </div>
                <Input
                  id="dietaryRestrictions"
                  placeholder="e.g. vegetarian, gluten-free, dairy-free"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Pizza className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="maxCalories" className="text-sm font-medium">
                    Max Calories (per serving)
                  </Label>
                </div>
                <Input
                  id="maxCalories"
                  type="number"
                  placeholder="e.g. 500"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t border-gray-100 p-6">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
          disabled={isLoading || !ingredients.trim()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating your recipe...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ChefHat className="h-5 w-5" />
              <span>Generate Recipe</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}