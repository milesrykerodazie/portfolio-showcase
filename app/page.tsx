import { ProjectInterface } from "@/types";
import Categories from "@/components/Categories";

import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";
import Projects from "@/components/Projects";

type SearchParams = {
  category?: string | null;
  endcursor?: string | null;
};

type Props = {
  searchParams: SearchParams;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async () => {
  //get all projects
  const projects = (await fetchAllProjects()) as ProjectInterface[];

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />

      <section className="">
        <Projects projects={projects} />
      </section>
    </section>
  );
};

export default Home;
