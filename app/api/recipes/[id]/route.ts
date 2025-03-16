import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";

// Correcting the second argument type
export async function DELETE(
  request: NextRequest,
  context: { params: Record<string, string> } // Fix: Use `Record<string, string>`
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recipeId = context.params.id; // Fix: Use `context.params.id`

    const recipe = await db.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== user.id) {
      return NextResponse.json({ error: "Not authorized to delete this recipe" }, { status: 403 });
    }

    await db.recipe.delete({
      where: { id: recipeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
