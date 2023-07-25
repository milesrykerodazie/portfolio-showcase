import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface ProjectParams {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: ProjectParams }
) {
  //getting the params
  const { id } = params;

  //validate id
  const projectExists = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });

  if (!projectExists) {
    return NextResponse.json({
      success: false,
      message: "Project not found.",
    });
  }

  const newView = projectExists?.views + 1;
  //add the views each time a project is viewed
  await prisma.project.update({
    where: {
      id: projectExists?.id,
    },
    data: {
      views: newView,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Project viewed.",
  });
}
