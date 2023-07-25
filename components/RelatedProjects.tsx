import Link from "next/link";
import { ProjectInterface, SessionInterface } from "@/types";

import ProjectCard from "./ProjectCard";

const RelatedProjects = ({
  relatedProjects,
  name,
  id,
  session,
}: {
  relatedProjects: ProjectInterface[];
  name: string;
  id: string;
  session: SessionInterface;
}) => {
  return (
    <section className="flex flex-col mt-20 md:mt-32 w-full">
      <div className="flexBetween">
        <p className="text-primary text-xs lg:text-sm">
          More by <span className="font-semibold cursor-pointer">{name}</span>
        </p>
        <Link
          href={`/profile/${id}`}
          className="text-primary text-xs lg:text-sm"
        >
          View All
        </Link>
      </div>

      <div className="projects-grid">
        {relatedProjects?.slice(0, 4).map((project) => (
          <ProjectCard key={project.id} project={project} session={session} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;
