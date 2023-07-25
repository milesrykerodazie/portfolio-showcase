import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

interface ProjectParams {
  slug: string;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ProjectParams }
) {
  //getting the current user from server
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  //getting the params
  const { slug } = params;

  const foundProject = await prisma.project.findUnique({
    where: {
      title_slug: slug,
    },
  });

  if (!foundProject) {
    return NextResponse.json({
      success: false,
      message: "Project does not exist.",
    });
  }

  //check if the current user is the owner of the product
  if (currentUser?.user?.id !== foundProject?.owner_id) {
    return NextResponse.json({ success: false, message: "Not authorized." });
  }

  //check if product has images
  const projectImg = await prisma.projectImage.findMany({
    where: {
      projectId: foundProject?.id,
    },
  });

  //delete all images from cloudinary
  if (projectImg?.length > 0) {
    await Promise.all(
      projectImg.map((img) => cloudinary.uploader.destroy(img.public_id))
    );
  }

  //delete the product
  await prisma.project.delete({
    where: {
      id: foundProject?.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Project deleted successfully..",
  });
}
