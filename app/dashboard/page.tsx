import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import RecipeList from "@/components/(recipe)/recipe-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { 
  LogOut, 
  ChefHat, 
  Book, 
  PlusCircle,
  Sparkles
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await checkUser();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  // Explicitly select fields to match the RecipeCardProps interface
  const recipes = await db.recipe.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      cookTime: true,
      calories: true,
      cuisine: true,
      tags: true,
      isGenerated: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Filter AI generated recipes
  const aiRecipes = recipes.filter(recipe => recipe.isGenerated);
  const manualRecipes = recipes.filter(recipe => !recipe.isGenerated);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Culinary Dashboard
            </CardTitle>
            <CardDescription className="text-lg mt-1">
              Welcome back, <span className="font-medium">{user.name}</span>!
            </CardDescription>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm" className="ml-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SignOutButton>
        </CardHeader>
        <CardContent className="pt-0">
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 mt-2">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/recipes/generate">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Recipe
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/recipes">
                <Book className="h-4 w-4 mr-2" />
                Browse Recipes
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/recipes/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Manual Recipe
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {recipes.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <ChefHat className="h-6 w-6 mr-2 text-blue-600" />
              Your Recipe Collection
            </h2>
            <TabsList>
              <TabsTrigger value="all">All Recipes ({recipes.length})</TabsTrigger>
              <TabsTrigger value="ai">AI Generated ({aiRecipes.length})</TabsTrigger>
              <TabsTrigger value="manual">Manual ({manualRecipes.length})</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <RecipeList recipes={recipes} onDelete={true} />
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0">
            {aiRecipes.length > 0 ? (
              <RecipeList recipes={aiRecipes} onDelete={true} />
            ) : (
              <EmptyState 
                message="No AI-generated recipes yet"
                buttonText="Generate Your First AI Recipe"
                href="/recipes/generate"
              />
            )}
          </TabsContent>
          
          <TabsContent value="manual" className="mt-0">
            {manualRecipes.length > 0 ? (
              <RecipeList recipes={manualRecipes} onDelete={true} />
            ) : (
              <EmptyState 
                message="No manual recipes created yet"
                buttonText="Create Your First Recipe"
                href="/recipes/new"
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState 
          message="You haven't created any recipes yet"
          buttonText="Create Your First Recipe"
          href="/recipes/generate"
        />
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  buttonText: string;
  href: string;
}

function EmptyState({ message, buttonText, href }: EmptyStateProps) {
  return (
    <Card className="w-full border-dashed bg-muted/30">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground mb-4">{message}</p>
        <Button asChild>
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}