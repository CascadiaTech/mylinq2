import {
  LoadingOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import logoImage from "../../assets/images/q.png";
import discordIcon from "../../assets/images/telegram2.png";

import "tailwindcss-elevation";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { ConnectWallet } from "../../components/Web3Modal/WalletConnect";
import Image from "next/image";
import StackingCompnent from "../../components/Stake/StackingCompnent";
import { useRouter } from "next/router";
//import StackingOverview from "./staking-overview";
import { useWeb3React } from "@web3-react/core";

const Stacking = () => {
  const [loading, setLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [connected, setConnected] = useState(false);
  const router = useRouter();
  const { account } = useWeb3React();
  
  console.log(account, "connected");

  
useEffect(() => {
  if (account) {
    router.push("/Dapp/staking-overview");
  }
}, [account])
  console.log(account, "account");
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
              width={300} // Set the desired width
              height={300} // Set the desired height
              className="self-center  "
            />
          </div>

          {loading ? (
            <Spin indicator={antIcon} className="add-spinner" />
          ) : (
            <div className="flex justify-center items-center  lg:mt-5">
              <ConnectWallet />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center mt-10 space-x-10">
          <a
            href="https://youtube.com/@LINQGROUP?si=f_3whNeXvi20t9Ux"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeOutlined style={{ fontSize: 24, color: "black" }} />
          </a>
          <a
            href="https://x.com/linq_group?s=21&t=EYCoHrLa3crPotsweedObw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterOutlined style={{ fontSize: 24, color: "black" }} />
          </a>
          <a
            href="https://t.me/LINQ_GROUP"
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
