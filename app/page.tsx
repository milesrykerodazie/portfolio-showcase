import { ProjectInterface } from "@/types";
import Categories from "@/components/Categories";

import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";
import Projects from "@/components/Projects";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  searchParams: {
    category: string;
  };
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams }: Props) => {
  //current user
  const session = await getCurrentUser();
  //get all projects
  const projects = (await fetchAllProjects(searchParams)) as ProjectInterface[];

  return (
    <section className="flexStart flex-col paddings mb-5 md:mb-16">
      <Categories />

      <section className="">
        <Projects projects={projects} session={session} />
      </section>
    </section>
  );
};

export default Home;
