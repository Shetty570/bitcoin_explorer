import { Navbar, NavbarBrand } from "@nextui-org/react";
import Image from "next/image";

export default function Nav() {
  return (
    <Navbar className="bg-gradient-to-r from-gray-900 to-gray-850 border-b border-gray-700 shadow-md">
      <NavbarBrand>
        <Image
          src="/assets/bitcoin-btc-logo.png"
          alt="Bitcoin logo"
          width={50}
          height={50}
          className="mx-5 my-2"
        />
        <p className=" text-3xl font-bold text-inherit text-white">
          BITCOIN EXPLORER(BTC)
        </p>
      </NavbarBrand>
    </Navbar>
  );
}
