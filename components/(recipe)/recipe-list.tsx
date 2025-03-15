'use client';

import { useState } from 'react';
import { RecipeCard } from './recipe-card';
import { useRouter } from 'next/navigation';
import { RecipeCardProps } from '@/types/recipe'; // Update import to use RecipeCardProps instead

// Update the props interface to accept the shape of data that's actually being passed
export interface RecipeListProps {
  recipes: RecipeCardProps['recipe'][]; // Use the recipe type from RecipeCardProps
  onDelete?: boolean;
}

export default function RecipeList({ recipes, onDelete }: RecipeListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the page to show updated list
        router.refresh();
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onDelete={onDelete ? handleDelete : undefined} 
          isDeleting={deletingId === recipe.id}
        />
      ))}
    </div>
  );
}