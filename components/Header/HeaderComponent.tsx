import "tailwindcss-elevation";

import React, { useEffect, useRef, useState } from "react";
//import Image from "next/image";
import Link from "next/link";
import Image from "next/image";
import LinqLogo from "../../assets/images/LinqLogo.png";
import MENUBar from "../../assets/images/Menu.png";
import LINQLogo from "../../assets/images/logo.png";

import { ConnectWallet } from "../Web3Modal/WalletConnect";
import { Web3Button } from '@web3modal/react'
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Provider } from "@ethersproject/providers";
// import { configureChains, createConfig, WagmiConfig } from 'wagmi';
// import { arbitrum, mainnet, polygon } from 'wagmi/chains';

import { Dropdown } from "flowbite-react";
import { useRouter } from "next/router";
export default function HeaderComponent() {
  const headerRef = useRef<any>(null);
  const [hidden, setHidden] = useState({ hidden: 0, rotate: 0 });
  const [homepagestyle, setHomepageStyle] = useState(false);
  function Onclick() {
    if (hidden.hidden == 0 && hidden.rotate == 0) {
      setHidden({ hidden: 100, rotate: 90 });
    } else {
      setHidden({ hidden: 0, rotate: 0 });
    }
  }
  function OnOffClick() {
    if (router.pathname != "/" && !headerRef?.current.contains(event?.target)) {
      // Clicked outside the header, so close it
      setHidden({ hidden: 0, rotate: 0 });
    }
  }

  // const chains = [arbitrum, mainnet, polygon]
const projectId = 'e860804a2106941d3e0efee245ad7d7a';

  const router = useRouter();

  useEffect(() => {
    if (router.pathname == "/Main/EntryPage") {
      setHomepageStyle(true);
    } else {
      setHomepageStyle(false);
    }
  }, [router.pathname]);

  return (
    <>
      <nav
        style={{ backgroundColor: "#fff" }}
        className="px-2 sm:px-4 py-2 -my-10 sm:my-0 sm:py-2 flex w-full fixed sm:w-full z-20 top-0 left-0 border-b border-gray-300"
      >
        {/* <div className="container flex flex-nowrap justify-left items-center mx-auto"> */}
        <div className="flex mt-2 justify-end items-end w-full mr-[60px]">
        <ConnectWallet></ConnectWallet>
      <p className={"mx-5 sm:mx-0"}></p>
    </div>
          <div
            className="justify-left self-center items-left text-left w-full flex h-fit w-auto order-1 md:flex md:h-fit md:w-auto order-1"
            id="navbar-sticky"
          >
            <ul className="h-auto flex flex-row justify-left self-center sm:my-0 text-left items-left p-4 mt-4 rounded-lg md:space-x-8 md:mt-0 md:text-md ">
              <div className={' flex flex-row top-0 left-0 absolute self-center mt-4 px-4'}>
              <li className={" self-center mt-8 sm:mt-2 md:mt-2 lg:mt-2" }>
                {" "}
                <Image className={'self-center'} width={40} height={37.5} src={LINQLogo} alt="asa"></Image>
              </li>
              </div>
              
              <ul
                className={
                 'text-xl flex flex-row text-center -translate-x-2 z-30 absolute mt-14 sm:mt-5 top-0 right-0 overflow-hidden rounded-lg'}
              >
                <div className="flex transition-all flex-col items-center ">
                  <div
                    onClick={() => Onclick()}
                    className="bg-purplegif rounded-full w-fit px-2 pt-1"
                    ref={headerRef}
                  >
                    <Image
                      className={`rotate-${hidden.rotate.toString()} text-black transition-all duration-300 cursor-pointer`}
                      height={20}
                      width={20}
                      src={MENUBar}
                    />
                  </div>
                  <div
                    className={`w-fit h-fit opacity-${hidden.hidden} transition-all duration-300`}
                  >
                    <ul
                      style={{ fontFamily: "Mandalore", backgroundColor: "#171717" }}
                      className="text-xl text-white rounded-xl px-2 py-2"
                    >
                      <li className="pt-1 hover:border-b-2 border-gray-300">
                        <Link href={"/"}>Claim</Link>
                      </li>
                      <li className="pt-1 hover:border-b-2 border-gray-300">
                        <Link href={"https://linktr.ee/linqgroup"}>Link Tree</Link>
                      </li>
                      <li>
                        <a
                          onClick={() =>
                            window.open("https://www.linqgroup.io/")
                          }
                          className=" cursor-pointer block px-4 pt-2 hover:border-b-2 border-gray-300"
                        >
                          Website
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </ul>
            </ul>
          </div>
        {/* </div> */}
      </nav>
    </>
  );
}
