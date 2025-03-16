import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";
import {db} from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET all recipes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const tag = searchParams.get("tag");

    const where: Prisma.RecipeWhereInput = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const recipes = await db.recipe.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

// POST new recipe
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await checkUser();
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await request.json();
    
    const recipe = await db.recipe.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}