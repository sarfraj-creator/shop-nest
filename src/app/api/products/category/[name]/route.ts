import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Props {
  params: { name: string };
}

export async function GET(_req: Request, { params }: Props) {
  try {
    const category = decodeURIComponent(params.name);
    const res = await fetch(
      `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch category products" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`GET /api/products/category/${params.name} error:`, err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
