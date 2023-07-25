import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

interface UserParams {
  id: string;
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: UserParams }
) {
  //getting the current user from server
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  //getting the params
  const { id } = params;

  //check if user exists
  const userExists = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!userExists) {
    return NextResponse.json({
      success: false,
      message: "User not found.",
    });
  }

  //if user is authorized to update
  if (currentUser?.user?.id !== userExists?.id) {
    return NextResponse.json({ success: false, message: "Not authorized." });
  }

  //get the user image/portfolioimage associated with the user and then delete it from cloudinary, database and then delete the user

  const foundImage = await prisma.userImage.findUnique({
    where: {
      userId: userExists?.id,
    },
  });

  if (foundImage) {
    // delete from clodinary
    await cloudinary.uploader.destroy(foundImage?.public_id);
  }

  const foundPortfolioImage = await prisma.portfolioImage.findUnique({
    where: {
      userId: userExists?.id,
    },
  });

  if (foundPortfolioImage) {
    // delete from clodinary
    await cloudinary.uploader.destroy(foundPortfolioImage?.public_id);
  }

  //delete the user
  await prisma.user.delete({
    where: {
      id: userExists?.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Profile Deleted.",
  });
}
