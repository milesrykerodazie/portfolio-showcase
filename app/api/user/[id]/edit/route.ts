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
export async function PATCH(
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

  const body = await req.json();
  //check if user exists
  const userExists = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      profilePic: {
        select: {
          id: true,
          public_id: true,
          url: true,
        },
      },
      portfolioPic: {
        select: {
          id: true,
          public_id: true,
          url: true,
        },
      },
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

  //checking unique username
  if (userExists?.username !== body?.username) {
    //check if username exists
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (usernameExists) {
      return NextResponse.json({
        success: false,
        message: "Username exists.",
      });
    }
  }

  //update user
  const updateUserDetails = await prisma.user.update({
    where: {
      id: userExists?.id,
    },
    data: {
      name: body?.name,
      username: body?.username,
      profession: body?.profession,
      shortDescription: body?.shortDescription,
      linkedinUrl: body?.linkedinUrl,
    },
  });

  if (updateUserDetails) {
    if (body?.image) {
      //delete the existing image first before uploading a new one
      if (userExists?.profilePic !== null) {
        //delete from cloudinary
        await cloudinary.uploader.destroy(userExists?.profilePic?.public_id);
        //delete image from database
        await prisma.userImage.delete({
          where: {
            id: userExists?.profilePic?.id,
          },
        });
      }

      //work on cloudinary image upload
      const uploadedImage = await cloudinary.uploader.upload(body?.image, {
        folder: "portfolioShowcaseUserImage",
        transformation: [{ width: 250, height: 250, crop: "scale" }],
      });

      //creating new profile image
      await prisma.userImage.create({
        data: {
          public_id: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
          userId: userExists?.id,
        },
      });

      //the update
      await prisma.user.update({
        where: {
          id: userExists?.id,
        },
        data: {
          image: uploadedImage?.secure_url,
        },
      });
    }

    if (body?.portfolioImage) {
      //delete the existing image first before uploading a new one
      if (userExists?.portfolioPic !== null) {
        //delete from cloudinary
        await cloudinary.uploader.destroy(userExists?.portfolioPic?.public_id);
        //delete image from database
        await prisma.portfolioImage.delete({
          where: {
            id: userExists?.portfolioPic?.id,
          },
        });
      }

      //work on cloudinary image upload
      const uploadedImage = await cloudinary.uploader.upload(
        body?.portfolioImage,
        {
          folder: "portfolioShowcaseUserPortfolioImage",
          transformation: [{ width: 640, height: 426, crop: "scale" }],
        }
      );

      //creating new profile image
      await prisma.portfolioImage.create({
        data: {
          public_id: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
          userId: userExists?.id,
        },
      });

      //the update
      await prisma.user.update({
        where: {
          id: userExists?.id,
        },
        data: {
          portfolioImage: uploadedImage?.secure_url,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "User Updated Successfully.",
    userId: userExists?.id,
  });
}
