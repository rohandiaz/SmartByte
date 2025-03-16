import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import RecipeForm from "@/components/(recipe)/recipe-form";
import { checkUser } from "@/lib/checkUser";

export default async function NewRecipePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Make sure the user exists in our database
  const user = await checkUser();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create New Recipe</h1>
      <RecipeForm />
    </div>
  );
}