'use client';

import { useState } from 'react';
import { RecipeCard } from './recipe-card';
import { useRouter } from 'next/navigation';
import { RecipeCardProps } from '@/types/recipe';
import { motion } from 'framer-motion';

export interface RecipeListProps {
  recipes: RecipeCardProps['recipe'][];
  onDelete?: boolean;
}

export default function RecipeList({ recipes, onDelete }: RecipeListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe => {
    return searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white dark:bg-gray-900 pt-4 pb-2 z-10 shadow-sm">
        <div className="flex justify-between gap-4 mb-6">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-3 h-4 w-4 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} 
            {searchTerm && ` matching "${searchTerm}"`}
          </h2>
          
          {filteredRecipes.length === 0 && searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredRecipes.map((recipe) => (
            <motion.div key={recipe.id} variants={item}>
              <RecipeCard 
                recipe={recipe} 
                onDelete={onDelete ? handleDelete : undefined} 
                isDeleting={deletingId === recipe.id}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <svg 
              className="w-12 h-12 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No recipes found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            {searchTerm ? 
              `We couldn't find any recipes matching "${searchTerm}".` : 
              "There are no recipes available yet."}
          </p>
        </div>
      )}
    </div>
  );
}