"use client";

import { SessionInterface, UserProfile } from "@/types";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { AiOutlinePlus } from "react-icons/ai";
import { MdEmail, MdWorkHistory } from "react-icons/md";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import ProjectActions from "./ProjectActions";
import ProjectsModal from "./modals/Projects";

type Props = {
  user: UserProfile;
  session: SessionInterface;
};

const ProfilePage = ({ user, session }: Props) => {
  const [projectsModal, setProjectsModal] = useState(false);

  return (
    <>
      {user?.id === session?.user?.id && (
        <div className="flex justify-end items-center py-2 pr-2">
          <div>
            <ProjectActions parameter={user?.id} user />
          </div>
          {/*  */}
        </div>
      )}

      <section className="flexCenter flex-col lg:max-w-10xl w-full mx-auto paddings">
        <section className="flexBetween flex-col md:flex-row gap-5 w-full">
          <div className="flex items-center flex-col w-full">
            <Image
              src={user?.image ? user?.image : ""}
              width={100}
              height={100}
              className="rounded-full"
              alt="user image"
            />
            <h3 className="text-lg lg:text-2xl font-bold mt-5 text-primary">
              {user?.name}
            </h3>
            {user?.profession && (
              <h4 className="lg:text-xl text-base font-semibold mt-5 max-w-lg text-primary capitalize">
                I’m a {user?.profession} 👋
              </h4>
            )}

            <p className="lg:text-sm text-xs mt-5 text-primary text-justify">
              {user?.shortDescription
                ? user?.shortDescription
                : "Tell us about you."}
            </p>

            <div className="flex mt-8 gap-5 w-full flex-wrap">
              <Link href={`mailto:${user?.email}`}>
                <button
                  type="button"
                  className={`flexCenter gap-2 p-2 lg:px-4 lg:py-3 text-xs lg:text-sm 
        text-primary bg-white drop-shadow-md rounded-md disabled:opacity-25 disabled:cursor-not-allowed`}
                >
                  <MdEmail className="text-primary" />
                  Hire Me
                </button>
              </Link>
              <button
                onClick={() => setProjectsModal((current) => !current)}
                className="flexCenter gap-2 p-2 lg:px-4 lg:py-3 text-xs lg:text-sm 
                  text-primary bg-white drop-shadow-md rounded-md"
              >
                <MdWorkHistory className="text-primary" />
                All Projects
              </button>
              {user?.linkedinUrl && (
                <div
                  className={`flexCenter gap-2 p-2 lg:px-4 lg:py-3 text-xs lg:text-sm 
        text-primary bg-white drop-shadow-md rounded-md disabled:opacity-25 disabled:cursor-not-allowed`}
                >
                  <a href={user?.linkedinUrl} target="_blank" rel="noreferrer">
                    <span className="flex items-center space-x-2">
                      <FaLinkedinIn className="w-3 h-3" />
                      <span>LinkedIn</span>
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <Image
              src={
                user?.portfolioImage
                  ? user?.portfolioImage
                  : "/images/profile-post.png"
              }
              alt="project image"
              width={739}
              height={554}
              className="rounded-xl object-contain"
            />
          </div>
        </section>

        <section className="flexStart flex-col lg:mt-28 mt-16 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="text-left text-primary lg:text-lg font-semibold">
              Recent Work
            </p>
            <button
              onClick={() => setProjectsModal((current) => !current)}
              className="text-left text-primary text-xs lg:text-sm font-semibold bg-white p-2 drop-shadow-md rounded-md"
            >
              My Works
            </button>
          </div>

          {user?.projects?.length > 0 ? (
            <div className="projects-grid">
              {user?.projects?.slice(0, 4).map((project) => (
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
        </section>

        {/* {pageCount > 1 && (
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
        )} */}
      </section>
      {projectsModal && (
        <ProjectsModal
          setProjectsModal={setProjectsModal}
          userProjects={user?.projects}
          session={session}
        />
      )}
    </>
  );
};

export default ProfilePage;
