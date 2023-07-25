"use client";

import { ProjectInterface, SessionInterface } from "@/types";
import { FC, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ProjectCard from "../ProjectCard";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface ModalProps {
  setProjectsModal: React.Dispatch<React.SetStateAction<boolean>>;
  userProjects: ProjectInterface[];
  session: SessionInterface;
}

const ProjectsModal: FC<ModalProps> = ({
  setProjectsModal,
  userProjects,
  session,
}) => {
  //states for pagenation
  const [pageNumber, setPageNumber] = useState(0);

  const projectPerPage = 8;

  const pagesVisited = pageNumber * projectPerPage;

  //the page count
  const pageCount = Math.ceil(userProjects?.length / projectPerPage);
  //on change for select page
  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  const showNextButton = pagesVisited !== userProjects?.length - 1;
  const showPrevButton = pagesVisited !== 0;

  return (
    <div className="modal">
      <button
        onClick={() => setProjectsModal(false)}
        className="absolute top-2 right-4"
      >
        <IoMdClose className="text-white" />
      </button>

      <div className="project_modal_wrapper">
        <h3 className="font-semibold text-primary text-sm lg:text-base">
          My works
        </h3>
        {userProjects?.length > 0 ? (
          <div className="projects-grid">
            {userProjects
              ?.slice(pagesVisited, pagesVisited + projectPerPage)
              .map((project) => (
                <ProjectCard
                  key={project?.id}
                  project={project}
                  session={session}
                />
              ))}
          </div>
        ) : (
          <div className="text-sm lg:text-base text-primary">
            No works to show
          </div>
        )}

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
      </div>
    </div>
  );
};

export default ProjectsModal;
