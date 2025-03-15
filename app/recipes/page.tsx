import { db } from "@/lib/prisma";
import RecipeList from "@/components/(recipe)/recipe-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Recipe } from "@/types/recipe";
import { Separator } from "@/components/ui/separator";
import { CookingPot, PlusCircle, LayoutDashboard } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function RecipesPage() {
  const { userId } = await auth();
  
  // Fetch recipes and ensure they match the Recipe type
  const recipes = await db.recipe.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      title: true,
      description: true,
      ingredients: true,
      instructions: true,
      imageUrl: true,
      userId: true,
      tags: true,
      cookTime: true,
      isGenerated: true,
      createdAt: true,
      updatedAt: true,
      calories: true,
      cuisine: true,
    }
  }) as unknown as Recipe[];

  return (
    <div className="container py-12 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
              <CookingPot className="h-8 w-8 text-primary" />
              <span>Recipes</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover and manage your collection of delicious recipes
            </p>
          </div>
          
          {userId && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/recipes/generate">
                  <PlusCircle className="h-5 w-5" />
                  Generate AI Recipe
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <Separator className="my-6" />
        
        {recipes.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Your Recipe Collection
                <span className="ml-2 text-muted-foreground text-base font-normal">
                  ({recipes.length} recipes)
                </span>
              </h2>
            </div>
            
            <RecipeList 
              recipes={recipes} 
              onDelete={!!userId}
            />
          </div>
        ) : (
          <Card className="border border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">No recipes found</CardTitle>
              <CardDescription>
                Get started by creating your first recipe or generating one with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              {userId && (
                <Button asChild>
                  <Link href="/recipes/generate">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create your first recipe
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}