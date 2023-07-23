import prisma from "@/lib/prismadb";

//fetching all projects
export const fetchAllProjects = async (searchQuery: { category?: string }) => {
  try {
    //search keyword
    const { category } = searchQuery;

    let query: any = {};

    //this can also work
    //   if (category) {
    //     query.category = category;
    //  }

    if (category) {
      query = { category: { contains: category, mode: "insensitive" } };
    }

    const projects = await prisma.project.findMany({
      where: query,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!projects) {
      return;
    }

    return projects;
  } catch (error) {
    return error;
  }
};

export const updateProject = async () => {};

export const getProjectDetails = async (params: { slug: string }) => {
  try {
    //getting the project id from parameter
    const { slug } = params;
    //fetch project
    const project = await prisma.project.findUnique({
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

    if (!project) {
      return null;
    }
    return project;
  } catch (error) {
    console.log(error);
  }
};

export const getUserProjects = () => {};

export const getUser = () => {};
