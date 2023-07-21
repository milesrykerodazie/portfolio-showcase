import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";
import slugify from "slugify";
import prisma from "@/lib/prismadb";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  //getting the current user from server
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error;
  }

  const body = await req.json();

  //generate product slug
  const options = {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: false,
    locale: "en",
    trim: true,
  };

  const titleSlug = slugify(body.title, options);

  //check if product slug already exists
  const titleSlugExists = await prisma.project.findUnique({
    where: {
      title_slug: titleSlug,
    },
  });

  if (titleSlugExists) {
    return NextResponse.json({
      success: false,
      message: "Project of same name, update instead.",
    });
  }

  //create new project
  const newProject = await prisma.project.create({
    data: {
      owner_id: currentUser?.user?.id,
      title: body?.title,
      title_slug: titleSlug,
      description: body?.description,
      liveSiteUrl: body?.liveSiteUrl,
      githubUrl: body?.githubUrl,
      category: body?.category,
    },
  });

  //uploading images to cloudinary

  if (newProject) {
    //uploading images
    const uploadedImages = await Promise.all(
      body.images.map((image: any) =>
        cloudinary.uploader.upload(image, {
          folder: "portfolioShowcaseImages",
          transformation: [{ width: 1000, height: 752, crop: "scale" }],
        })
      )
    );

    //preparing the product images
    const projectImages = uploadedImages.map((image) => {
      return {
        projectId: newProject.id as string,
        public_id: image.public_id as string,
        url: image.secure_url as string,
        owner: currentUser?.user?.id as string,
      };
    });

    //creating all product images
    await prisma.projectImage.createMany({
      data: projectImages,
    });

    return NextResponse.json({
      success: true,
      message: "Project Added.",
    });
  }
}
