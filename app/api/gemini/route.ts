import { NextRequest, NextResponse } from 'next/server';
import { generateRecipe } from '@/lib/gemini';
import { db } from '@/lib/prisma';
import { checkUser } from '@/lib/checkUser';
import { RecipeSuggestionRequest } from '@/types/recipe';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await checkUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const recipeSuggestionRequest: RecipeSuggestionRequest = await request.json();
    console.log('Recipe suggestion request:', recipeSuggestionRequest);

    // Validate input
    if (!recipeSuggestionRequest.ingredients || 
        !Array.isArray(recipeSuggestionRequest.ingredients) || 
        recipeSuggestionRequest.ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients are required and must be an array' },
        { status: 400 }
      );
    }

    try {
      // Generate recipe using Gemini AI
      console.log('Calling Gemini API...');
      const generatedRecipe = await generateRecipe(recipeSuggestionRequest);
      console.log('Recipe generated successfully:', generatedRecipe);
      
      // Check that we have the required fields before saving to database
      if (!generatedRecipe.title || !generatedRecipe.ingredients || !generatedRecipe.instructions) {
        throw new Error('Generated recipe is missing required fields');
      }

      // Calculate total time if both prep and cook time are available
      const totalTime = (generatedRecipe.prepTime && generatedRecipe.cookTime) 
        ? generatedRecipe.prepTime + generatedRecipe.cookTime 
        : null;

      // Save the generated recipe to the database using existing schema fields
      console.log('Saving recipe to database...');
      const savedRecipe = await db.recipe.create({
        data: {
          title: generatedRecipe.title,
          description: generatedRecipe.description || '',
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          prepTime: generatedRecipe.prepTime,
          cookTime: generatedRecipe.cookTime,
          totalTime: totalTime,
          difficulty: generatedRecipe.difficulty || null,
          cuisine: generatedRecipe.cuisine || null,
          calories: generatedRecipe.nutritionalInfo?.calories || null,
          tags: generatedRecipe.tags || [],
          isGenerated: true,
          userId: userId.id,
        },
      });
      console.log('Recipe saved successfully:', savedRecipe.id);

      // Return the generated recipe with nutritional info separately since we can't store it in the DB
      return NextResponse.json({ 
        recipe: savedRecipe,
        nutritionalInfo: generatedRecipe.nutritionalInfo
      }, { status: 201 });
    } catch (aiError) {
      console.error('Error in AI recipe generation:', aiError);
      return NextResponse.json(
        { error: 'AI could not generate a suitable recipe. Please try different ingredients or preferences.' },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error in recipe generation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    );
  }
}