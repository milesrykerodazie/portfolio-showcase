"use client";

import { ProjectInterface, SessionInterface } from "@/types";
import React, { FC, useState } from "react";
import ProjectCard from "./ProjectCard";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface ProjectTypes {
  projects: ProjectInterface;
}

const Projects = ({
  projects,
  session,
}: {
  projects: ProjectInterface[];
  session: SessionInterface;
}) => {
  //states for pagenation
  const [pageNumber, setPageNumber] = useState(0);

  const projectPerPage = 8;

  const pagesVisited = pageNumber * projectPerPage;

  //the page count
  const pageCount = Math.ceil(projects?.length / projectPerPage);
  //on change for select page
  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  const showNextButton = pagesVisited !== projects?.length - 1;
  const showPrevButton = pagesVisited !== 0;
  return (
    <>
      {projects?.length > 0 ? (
        <>
          <section className="projects-grid">
            {projects
              ?.slice(pagesVisited, pagesVisited + projectPerPage)
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  session={session}
                />
              ))}
          </section>
          {pageCount > 1 && (
            <ReactPaginate
              breakLabel={<span className="pr-4">...</span>}
              pageCount={pageCount}
              nextLabel={
                showNextButton ? (
                  <span className="w-10 h-10 flex items-center justify-center bg-white text-primary rounded-md">
                    <BsChevronRight />
                  </span>
                ) : null
              }
              onPageChange={changePage}
              pageRangeDisplayed={2}
              previousLabel={
                showPrevButton ? (
                  <span className="w-10 h-10 flex items-center justify-center bg-white text-primary rounded-md mr-4">
                    <BsChevronLeft />
                  </span>
                ) : null
              }
              containerClassName="flex items-center justify-center mt-8 mb-4 dark:bg-white rounded-md"
              pageClassName="block text-primary border border-solid border-primary hover:text-white hover:bg-primary/80 w-8 h-8 flex items-center justify-center rounded-md mr-4 trans"
              activeClassName="bg-primary text-white"
              renderOnZeroPageCount={null}
            />
          )}
        </>
      ) : (
        <>
          <p className=" text-center text-primary text-sm lg:text-base py-10">
            No projects found.
          </p>
        </>
      )}
    </>
  );
};

export default Projects;
