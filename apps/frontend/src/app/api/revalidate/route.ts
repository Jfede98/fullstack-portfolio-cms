import { RevalidateTags } from "@lib/constants/state";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.info("[revalidate] Request received :", {
      date: new Date().toISOString()
    });

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    console.log("[revalidate]", { authHeader, token });

    if (!token || token !== process.env.REVALIDATE_TOKEN) {
      console.error("[revalidate] Unauthorized", { token });
      return NextResponse.json(
        { revalidate: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    let tags = body.tags;

    if (!Array.isArray(tags) || tags.length === 0) {
      tags = [RevalidateTags.ALL];
    }

    console.log(`[revalidate] Revalidando tags: ${tags.join(", ")}`);

    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }

    return NextResponse.json({
      revalidate: true,
      now: Date.now()
    });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      {
        revalidate: false,
        status: err?.status ?? 500,
        message: err?.message ?? "Error interno del servidor"
      },
      {
        status: err?.status ?? 500
      }
    );
  }
}