import { User, Session } from "next-auth";

export type FormState = {
  title: string;
  description: string;
  images: string[];
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
};

export interface UserForm {
  name: string;
  username: string;
  profession: string;
  shortDescription: string;
  portfolioImage: string;
  linkedinUrl: string;
  email: string;
  image: string;
}

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
  views: number;
  User: {
    name: string;
    image: string;
  };
  likes: {
    id: string;
    projectId: string;
    userId: string;
    User: {
      image: string;
    };
  }[];
}

export interface UserBasicDetails {
  id: string;
  name: string;
  username: string;
  profession: string;
  shortDescription: string;
  portfolioImage: string;
  linkedinUrl: string;
  email: string;
  image: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  profession: string;
  shortDescription: string;
  portfolioImage: string;
  linkedinUrl: string;
  email: string;
  image: string;
  projects: ProjectInterface[];
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
