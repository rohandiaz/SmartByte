import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import RecipeList from "@/components/(recipe)/recipe-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await checkUser();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const recipes = await db.recipe.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <SignOutButton>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <p className="text-lg">Welcome back, {user.name}!</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/recipes/generate">Generate AI Recipe</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Recipes</h2>
        {recipes.length > 0 ? (
          <RecipeList recipes={recipes} onDelete={true} />
        ) : (
          <div className="text-center p-10 border rounded-lg bg-muted/20">
            <p className="mb-4">You haven't created any recipes yet.</p>
            <Button asChild>
              <Link href="/recipes/generate">Create Your First Recipe</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}