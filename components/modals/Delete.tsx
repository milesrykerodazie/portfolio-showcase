"use client";
import React, { FC } from "react";
import { FaSpinner } from "react-icons/fa";

interface DeleteProps {
  deleteEntry: () => void;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleting: boolean;
}

const Delete: FC<DeleteProps> = ({ deleteEntry, setOpenModal, deleting }) => {
  return (
    <div className="absolute z-60 bg-white drop-shadow-md top-10 -left-3 w-full rounded-md transition duration-500 ease-out flex flex-col space-y-3 justify-center items-center py-1">
      {deleting === false && (
        <h4 className="text-primary font-semibold text-[10px] md:text-xs">
          Are you sure?
        </h4>
      )}

      {deleting ? (
        <div className="gap-2 flex items-center text-primary">
          <span className="text-[10px] md:text-xs animate-pulse">
            Deleting...
          </span>
          <FaSpinner className="animate-spin w-3 h-3" />
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <button
            onClick={deleteEntry}
            className="text-center text-red-600 font-semibold text-[10px] md:text-xs "
          >
            Yes
          </button>
          <span className="text-primary text-xs md:text-sm">/</span>

          <button
            onClick={() => setOpenModal(false)}
            className=" text-center text-primary font-semibold text-[10px] md:text-xs"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Delete;
