'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecipeGeneratorForm } from '@/components/(recipe)/recipe-generator-form';
import { RecipeSuggestionRequest } from '@/types/recipe';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { ChefHat, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <ChefHat className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Create Your Recipe
          </h1>
        </div>
        <p className="text-gray-600 max-w-lg mx-auto">
          Tell us what ingredients you have on hand and your preferences, and our AI will create a delicious recipe tailored just for you.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <RecipeGeneratorForm onGenerate={handleGenerateRecipe} />
      
      <Card className="mt-10 max-w-3xl mx-auto border-blue-100 bg-blue-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-blue-700">
              Tips for Better Results
            </CardTitle>
          </div>
          <CardDescription className="text-blue-700/80">
            Follow these tips to get the most personalized and delicious recipes from our AI chef.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              List as many ingredients as possible for more creative recipes
            </TipItem>
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              Specify dietary restrictions if you have any
            </TipItem>
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              Choose a cuisine type for more authentic flavor combinations
            </TipItem>
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              Indicate meal type (breakfast, lunch, dinner) for appropriate recipes
            </TipItem>
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              Set number of servings based on how many people you&apos;re feeding
            </TipItem>
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              Specify calorie limits if you&apos;re watching your intake
            </TipItem>
            <TipItem icon={<CheckCircle className="h-4 w-4 text-blue-600" />}>
              Choose difficulty level based on your cooking experience
            </TipItem>
            <TipItem icon={<Clock className="h-4 w-4 text-blue-600" />}>
              Set time constraints if you&apos;re in a hurry
            </TipItem>
          </div>
          <Separator className="my-4 bg-blue-200/50" />
          <div className="text-blue-700 font-medium text-center mt-2">
            Our AI will prioritize using ingredients you&apos;ve listed while creating your perfect recipe
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TipItem({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1">
      {icon}
      <span className="text-blue-700/90 text-sm">{children}</span>
    </div>
  );
}