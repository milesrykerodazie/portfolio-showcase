import { User, Session } from "next-auth";

export type FormState = {
  title: string;
  description: string;
  images: string[];
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
};

export type ProjectImage = {
  id: string;
  projectId: string;
  public_id: string;
  url: string;
  owner: string;
};

export interface ProjectInterface {
  title: string;
  description: string;
  images: ProjectImage[];
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  id: string;
  owner_id: string;
  title_slug: string;
  User: {
    name: string;
    image: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  description: string | null;
  avatarUrl: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  projects: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface SessionInterface extends Session {
  user: User & {
    profilePic: {
      public_id: string;
      url: string;
      userId: string;
    };
  };
}

export interface ProjectForm {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
}
