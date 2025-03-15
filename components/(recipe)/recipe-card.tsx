// components/recipe/recipe-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RecipeCardProps } from '@/types/recipe';

export function RecipeCard({ recipe, onDelete, isDeleting = false }: RecipeCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(recipe.id);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="relative h-48 w-full">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          {recipe.isGenerated && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              AI Generated
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.cookTime && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {recipe.cookTime} min
              </span>
            )}
            {recipe.calories && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {recipe.calories} cal
              </span>
            )}
            {recipe.cuisine && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {recipe.cuisine}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{recipe.tags.length - 3} more</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Delete button only shown if onDelete is provided */}
      {onDelete && (
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="icon"
          className="absolute top-2 left-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}