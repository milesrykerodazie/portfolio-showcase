import prisma from "@/lib/prismadb";
import { UserProfile } from "@/types";

export const projectsCount = async () => {
  try {
    const projects = await prisma.project.findMany({});

    if (!projects) {
      return;
    }

    return projects?.length;
  } catch (error) {
    return error;
  }
};

//fetching all projects
export const fetchAllProjects = async (searchQuery: { category: string }) => {
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
        likes: {
          select: {
            id: true,
            projectId: true,
            userId: true,
            User: {
              select: {
                image: true,
              },
            },
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
        likes: {
          select: {
            id: true,
            projectId: true,
            userId: true,
            User: {
              select: {
                image: true,
              },
            },
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

export const getRelatedProjects = async (userId: string, projectId: string) => {
  try {
    // verify if user and project exists

    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!foundUser) {
      return null;
    }

    const foundProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!foundProject) {
      return null;
    }

    //fetch all projects owned by user
    const userProjects = await prisma.project.findMany({
      where: {
        owner_id: foundUser?.id,
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
        likes: {
          select: {
            id: true,
            projectId: true,
            userId: true,
            User: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // filter out the viewed project
    const filteredProjects = userProjects?.filter(
      (project) => project?.id !== projectId
    );

    const firstFiveProjects = filteredProjects?.slice(0, 5);

    return firstFiveProjects;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (params: { id: string }) => {
  try {
    //getting the id from params
    const { id } = params;
    //getting the user details
    const userDetails = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        profession: true,
        shortDescription: true,
        portfolioImage: true,
        linkedinUrl: true,
        projects: {
          select: {
            id: true,
            owner_id: true,
            title: true,
            title_slug: true,
            views: true,
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
            likes: {
              select: {
                id: true,
                projectId: true,
                userId: true,
                User: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!userDetails) {
      return null;
    }

    return userDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getUserBasicDetails = async (params: { id: string }) => {
  try {
    //getting the id from params
    const { id } = params;

    //getting the user details
    const userDetails = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        profession: true,
        shortDescription: true,
        portfolioImage: true,
        linkedinUrl: true,
      },
    });

    if (!userDetails) {
      return null;
    }

    return userDetails;
  } catch (error) {
    console.log(error);
  }
};
