import { getLeadFormSelectionByDocumentId } from "@lib/api/web/leadDistribution";
import { NextRequest, NextResponse } from "next/server";


type TRouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

export const GET = async (
  _request: NextRequest,
  context: TRouteContext
) => {
  const { documentId } = await context.params;
  if (!documentId) {
    return NextResponse.json({ error: "documentId is required" }, { status: 400 });
  }

  const selection = await getLeadFormSelectionByDocumentId(documentId);
  if (!selection?.form) {
    return NextResponse.json(
      { error: "Lead form not found or incomplete" },
      { status: 404 }
    );
  }

  return NextResponse.json(selection);
};
