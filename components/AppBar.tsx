import {
  Navbar,
  Link,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

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
          <Button as={Link} color="primary" href="/auth/signup" variant="solid">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
