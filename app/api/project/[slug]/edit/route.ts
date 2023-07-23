import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";
import slugify from "slugify";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

interface ProjectParams {
  slug: string;
}

export async function PATCH(
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

  const body = await req.json();

  //check if the product exists
  const foundProject = await prisma.project.findUnique({
    where: {
      title_slug: slug,
    },
    include: {
      images: {
        select: {
          id: true,
          projectId: true,
          public_id: true,
          url: true,
          owner: true,
        },
      },
      User: {
        select: {
          name: true,
          image: true,
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

  //check if the current user is the owner of the product
  if (currentUser?.user?.id !== foundProject?.owner_id) {
    return NextResponse.json({ success: false, message: "Not authorized." });
  }

  //slug uptions
  const options = {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: false,
    locale: "en",
    trim: true,
  };

  //checking if product name is the same
  const newProjectName = foundProject?.title === body?.title;
  const projectSlug = slugify(body.title, options);

  //check if product slug already exists

  if (newProjectName === false) {
    const prjSlugExists = await prisma.project.findUnique({
      where: {
        title_slug: projectSlug,
      },
    });

    if (prjSlugExists) {
      return NextResponse.json({
        success: true,
        message: "Project of same name, update instead.",
      });
    }
  }

  //fixing the product slug
  const projectSlugUpdate =
    newProjectName === true ? foundProject?.title_slug : projectSlug;

  //updating products if there is an image or images or no image at all

  if (body?.images.length > 0) {
    //do the update with pictures here
    if (foundProject?.images.length + body?.images.length > 5) {
      return NextResponse.json({
        success: false,
        message: "Images can not be more than 5 for a project.",
      });
    }

    //update the product
    const updatedProject = await prisma.project.update({
      where: {
        id: foundProject?.id,
      },
      data: {
        title: body.title,
        title_slug: projectSlugUpdate,
        description: body.description,
        category: body.category,
        githubUrl: body.githubUrl,
        liveSiteUrl: body.liveSiteUrl,
      },
    });

    //uploading the images
    if (updatedProject) {
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
          projectId: updatedProject.id as string,
          public_id: image.public_id as string,
          url: image.secure_url as string,
          owner: currentUser?.user?.id as string,
        };
      });

      //creating all product images
      await prisma.projectImage.createMany({
        data: projectImages,
      });

      //get the project again
      const fetchProject = await prisma.project.findUnique({
        where: {
          id: foundProject?.id,
        },
      });

      if (fetchProject) {
        return NextResponse.json({
          success: true,
          message: `The Project Updated Successfully.`,
          slug: fetchProject?.title_slug,
        });
      }
    }
  } else {
    //do the update without pictures here
    const updatedProject = await prisma.project.update({
      where: {
        id: foundProject?.id,
      },
      data: {
        title: body.title,
        title_slug: projectSlugUpdate,
        description: body.description,
        category: body.category,
        githubUrl: body.githubUrl,
        liveSiteUrl: body.liveSiteUrl,
      },
    });

    //get the project again
    const fetchProject = await prisma.project.findUnique({
      where: {
        id: foundProject?.id,
      },
    });

    if (fetchProject) {
      return NextResponse.json({
        success: true,
        message: `The Project Updated Successfully.`,
        slug: fetchProject?.title_slug,
      });
    }
  }
}
