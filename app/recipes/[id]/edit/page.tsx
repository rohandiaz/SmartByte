import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import RecipeForm from "@/components/(recipe)/recipe-form";
import {db} from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

interface EditRecipePageProps {
  params: {
    id: string;
  };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await checkUser();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const recipe = await db.recipe.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!recipe) {
    notFound();
  }

  // Check if the user is the owner of the recipe
  if (recipe.userId !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
      <RecipeForm initialData={recipe} />
    </div>
  );
}