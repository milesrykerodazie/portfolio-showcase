"use client";

import { useCallback, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export default function GeneralModal({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlay.current && onDismiss) {
        onDismiss();
      }
    },
    [onDismiss, overlay]
  );

  return (
    <div ref={overlay} className="modal" onClick={(e) => handleClick(e)}>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-2 right-4"
      >
        <IoMdClose className="text-white" />
      </button>

      <div ref={wrapper} className="modal_wrapper">
        {children}
      </div>
    </div>
  );
}
