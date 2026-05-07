import { NextResponse } from "next/server";
import { categoryService } from "@/shared/services/categoryService";

export const revalidate = 86400; // Cache this route for 24 hours

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const category = await categoryService.getCategoryBySlug(slug);
      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ data: category });
    }

    const categories = await categoryService.getAllCategories();
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
