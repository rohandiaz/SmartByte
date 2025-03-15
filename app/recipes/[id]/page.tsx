// app/recipes/[id]/page.tsx
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import {db} from '@/lib/prisma';
import Link from 'next/link';

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  // Await params before using them
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const { userId } = await auth();
  
  if (!userId) {
    notFound();
  }
  
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });
  
  if (!user) {
    notFound();
  }
  
  const recipe = await db.recipe.findUnique({
    where: { 
      id: id, // Use the awaited id
      userId: user.id, 
    },
  });
  
  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {recipe.imageUrl && (
          <div className="h-72 overflow-hidden">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          
          {recipe.description && (
            <p className="text-gray-700 mb-6">
              {recipe.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {recipe.cookTime && (
            <div className="mb-6 text-gray-700">
              <strong>Cook Time:</strong> {recipe.cookTime} minutes
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
            <ul className="list-disc pl-6 space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <ol className="list-decimal pl-6 space-y-3">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">
                Created on {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
              {recipe.isGenerated && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  AI Generated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}