import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/constant";
import { getCurrentUser } from "@/lib/auth";
import UserMenu from "./UserMenu";
import ProfileMenu from "./ProfileMenu";
import Button from "./Button";

// import Button from "./Button";
// import ProfileMenu from "./ProfileMenu";

const Navbar = async () => {
  const session = await getCurrentUser();

  console.log("the session => ", session);

  return (
    <nav className="flexBetween navbar">
      <div className="flex-1 flexStart gap-4 lg:gap-10">
        <Link href="/">
          <img
            src="/images/no-user.jpg"
            alt="logo"
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
          />
        </Link>
        <ul className="md:flex hidden text-sm gap-3 lg:gap-7 whitespace-nowrap text-primary">
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.text}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>
      <>{!session && <UserMenu />}</>
      <div className="flexCenter gap-4">
        {session?.user && (
          <>
            <ProfileMenu session={session} />

            <Link href="/new-project">
              <Button title="Share work" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
