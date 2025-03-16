import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Flame, Menu, Tag } from 'lucide-react';
import { RecipeCardProps } from '@/types/recipe';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function RecipeCard({ recipe, onDelete, isDeleting = false }: RecipeCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(recipe.id);
    }
  };

  // Generate a background color based on cuisine for visual distinction
  const getCuisineColor = (cuisine?: string | null) => {
    if (!cuisine) return 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900';

    const cuisineColors: Record<string, string> = {
      'Italian': 'bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/30 dark:to-red-900/30',
      'Mexican': 'bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/30 dark:to-green-900/30',
      'Chinese': 'bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/30 dark:to-yellow-900/30',
      'Indian': 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30',
      'French': 'bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-900/30 dark:to-red-900/30',
      'Japanese': 'bg-gradient-to-r from-white to-red-50 dark:from-gray-800 dark:to-red-900/30',
      'Thai': 'bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/30 dark:to-blue-900/30',
      'Greek': 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800',
      'Mediterranean': 'bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/30 dark:to-orange-900/30',
    };

    return cuisineColors[cuisine] || 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30';
  };

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <Card className={`relative h-full hover:shadow-lg transition-all ${getCuisineColor(recipe.cuisine)} border-slate-200 dark:border-slate-700 overflow-hidden group`}>
        {onDelete && (
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {recipe.isGenerated && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/70">
              <span className="text-xs">AI</span>
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors dark:text-white">
            {recipe.title}
          </CardTitle>
          {recipe.description && (
            <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
              {recipe.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pb-3 pt-0">
          <div className="flex flex-wrap gap-3 mb-3">
            {recipe.cookTime && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Clock className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                <span>{recipe.cookTime} min</span>
              </div>
            )}
            {recipe.calories && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Flame className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                <span>{recipe.calories} cal</span>
              </div>
            )}
            {recipe.cuisine && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Menu className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                <span>{recipe.cuisine}</span>
              </div>
            )}
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <>
              <Separator className="my-2 dark:bg-gray-700" />
              <div className="flex items-center gap-1 mt-2">
                <Tag className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-white dark:bg-gray-800 bg-opacity-70 text-gray-800 dark:text-gray-200 font-normal px-2 py-0 h-5 dark:border-gray-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">+{recipe.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </Card>
    </Link>
  );
}