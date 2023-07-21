import prisma from "@/lib/prismadb";

//fetching all projects
export const fetchAllProjects = async () => {
  try {
    const projects = await prisma.project.findMany({
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

export const getProjectDetails = () => {};

export const getUserProjects = () => {};

export const getUser = () => {};
