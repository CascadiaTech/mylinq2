import {
  LoadingOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  DiscordOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import logoImage from "../../assets/images/newlinqlogobig.png";
import discordIcon from "../../assets/images/discordlogo.png";

import "tailwindcss-elevation";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { ConnectWallet } from "../../components/Web3Modal/WalletConnect";
import Image from "next/image";
import StackingCompnent from "../../components/Stake/StackingCompnent";
import { useRouter } from "next/router";
import StackingOverview from "./stacking-overview";

const Stacking = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [connected, setConnected] = useState(false);
  const router = useRouter();
  console.log(account, "connectedddlkklkl");

  const checkConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setConnected(true);
      setAccount(window.ethereum.selectedAddress);
    } else {
      setConnected(false);
      setAccount(null);
    }
  };

  useEffect(() => {
    checkConnection();
  }, [account]);

  if (account !== null) {
    router.push("/Dapp/stacking-overview");
  }

  console.log(account, "accocuntttt");
  return (
    <>
      <header>
        {" "}
        <HeaderComponent></HeaderComponent>
      </header>{" "}
      <main className={`${styles.main} `}>
        {/* <div className="mt-12 w-[170px] sm:w-[300px] md:w-[350px] lg:w-[500px] "> */}
        <div className=" flex flex-col justify-center items-center w-[350px] sm:w-[350px] md:w-[550px] lg:w-[650px]  ">
          <div className="flex justify-center items-center self-center mt-8 sm:mt-[-5px] md:mt-0 lg:mt-0">
            <Image
              src={logoImage}
              alt="Logo"
              width={120} // Set the desired width
              height={120} // Set the desired height
              className="self-center  "
            />
          </div>

          {loading ? (
            <Spin indicator={antIcon} className="add-spinner" />
          ) : (
            <div className="flex justify-center items-center  lg:mt-10">
              <ConnectWallet setAccount={setAccount} />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center mt-10 space-x-10">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeOutlined style={{ fontSize: 24, color: "black" }} />
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterOutlined style={{ fontSize: 24, color: "black" }} />
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={discordIcon}
              alt="Discord"
              style={{ color: "black" }}
              width={22} // Set the desired width
              height={22}
            />
          </a>
        </div>
      </main>
    </>
  );
};

export default Stacking;
