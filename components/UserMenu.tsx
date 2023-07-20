"use client";

import React, { FC, useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import MenuItem from "./MenuItem";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

interface UseMenuProps {
  currentUser?: any;
}

const UserMenu: FC<UseMenuProps> = ({ currentUser }) => {
  //using the modal hooks
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  //state to open modal
  const [isOpen, setIsOpen] = useState(false);

  //toggle modal open and close
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className="">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={toggleOpen}
          className="p-1  lg:p-2 shadow-md shadow-primary bg-white flex flex-row items-center gap-3 rounded-full cursor-pointer transition-all duration-500 ease-out text-primary"
        >
          <AiOutlineMenu className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          <div className="hidden md:block">
            <img
              className="rounded-full h-5 w-5 lg:w-8 lg:h-8 object-cover"
              alt="Avatar"
              src={
                currentUser?.image ? currentUser?.image : "/images/no-user.jpg"
              }
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-0 rounded-xl shadow-md w-32 md:w-60 bg-white dark:bg-white dark:hover:text-primary dark:hover:shadow-md dark:hover:shadow-white transition-all duration-300 ease-out drop-shadow-lg overflow-hidden right-1 text-sm">
          <div className="cursor-pointer flex flex-col relative pt-1">
            {!currentUser && (
              <>
                <button
                  className="p-1 border absolute right-0 rounded-full bg-primary text-white"
                  onClick={toggleOpen}
                >
                  <IoMdClose className="text-white" />
                </button>
                <MenuItem
                  label="Login"
                  onClick={loginModal.onOpen}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
                <MenuItem
                  label="Register"
                  onClick={registerModal.onOpen}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
