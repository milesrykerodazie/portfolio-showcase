import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

interface ProjectParams {
  id: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: ProjectParams }
) {
  //getting the current user from server
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error;
  }

  //getting the params
  const { id } = params;

  const body = await req.json();

  // verify params and request data

  //check if the product exists
  const foundProject = await prisma.project.findUnique({
    where: {
      id: id,
    },
    include: {
      likes: {
        select: {
          id: true,
          projectId: true,
          userId: true,
        },
      },
    },
  });

  if (!foundProject) {
    return NextResponse.json({
      success: false,
      message: "Project does not exist.",
    });
  }

  //   validate user
  const userValid = await prisma.user.findUnique({
    where: {
      id: body?.userId,
    },
  });

  if (!userValid) {
    return NextResponse.json({
      success: false,
      message: "User not found.",
    });
  }

  if (currentUser?.user?.id !== userValid?.id) {
    return NextResponse.json({
      success: false,
      message: "User conflict.",
    });
  }

  //   checking for already liked
  const liked = foundProject?.likes?.filter(
    (like) => like?.userId === userValid?.id
  );

  if (liked.length > 0) {
    //delete like
    await prisma.likes.delete({
      where: {
        id: liked[0]?.id,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Unliked.",
    });
  } else {
    await prisma.likes.create({
      data: {
        projectId: foundProject?.id,
        userId: userValid?.id,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Liked.",
    });
  }
}
