import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

interface ImageParams {
  id: string;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ImageParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { id } = params;

  const foundImage = await prisma.projectImage.findUnique({
    where: {
      id: id,
    },
  });

  if (!foundImage) {
    return NextResponse.json({ success: false, message: "Image not found." });
  }

  if (currentUser?.user?.id !== foundImage?.owner) {
    return NextResponse.json({ success: false, message: "Not authorized." });
  }

  if (foundImage.public_id) {
    await cloudinary.uploader.destroy(foundImage.public_id);
  }
  await prisma.projectImage.delete({
    where: {
      id: foundImage.id,
    },
  });

  return NextResponse.json({ success: true, message: "Image deleted." });
}
