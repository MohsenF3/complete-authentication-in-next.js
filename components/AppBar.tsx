import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import SignInButton from "./SignInButton";

export default function AppBar() {
  return (
    <Navbar isBordered className="mb-8">
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SignInButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
