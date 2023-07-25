"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import { SessionInterface } from "@/types";

const ProfileMenu = ({ session }: { session: SessionInterface }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flexCenter z-10 flex-col relative">
      <Menu as="div">
        <Menu.Button
          className="flexCenter"
          onClick={() => setOpenModal((current) => !current)}
        >
          {session?.user?.image && (
            <img
              src={session.user.image}
              className="rounded-full w-8 h-8 lg:w-10 lg:h-10"
              alt="user profile image"
            />
          )}
        </Menu.Button>

        <Transition
          show={openModal}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <Menu.Items static className="flexStart profile_menu-items">
            <div className="flex flex-col items-center gap-y-4">
              {session?.user?.image && (
                <img
                  src={session?.user?.image}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
                  referrerPolicy="no-referrer"
                  alt="profile Image"
                />
              )}
              <p className="font-semibold text-sm lg:text-base text-primary">
                {session?.user?.name}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-10 items-start w-full">
              <Menu.Item>
                <Link
                  href={`/profile/${session?.user?.id}`}
                  className="text-xs md:text-sm text-primary w-full"
                  onClick={() => setOpenModal(false)}
                >
                  Work Preferences
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href={`/profile/${session?.user?.id}`}
                  className="text-xs md:text-sm text-primary w-full"
                  onClick={() => setOpenModal(false)}
                >
                  Settings
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href={`/profile/${session?.user?.id}`}
                  className="text-xs md:text-sm text-primary w-full"
                  onClick={() => setOpenModal(false)}
                >
                  Profile
                </Link>
              </Menu.Item>
            </div>
            <div className="w-full flexStart border-t border-nav-border mt-2 pt-2 lg:mt-5 lg:pt-5">
              <Menu.Item>
                <button
                  type="button"
                  className="text-xs lg:text-sm font-semibold text-primary"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
