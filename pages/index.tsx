import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import HeaderComponent from "../components/Header/HeaderComponent";
import "tailwindcss-elevation";
import FooterComponent from "../components/Footer/FooterComponent";
import DualCardComponent from "../components/DualCards/DualCardComponent";
import ScrollpositionAnimation from "../hooks/OnScroll";
import { useCallback, useEffect, useRef, useState } from "react";
import "@uniswap/widgets/fonts.css";
import goonsHomepage from "../assets/images/GoonsHomepage.jpg";
import goonsLogoMobile from "../assets/images/goonsLogoMobile.jpg";
import KomaInuLogo from "../assets/images/Necklace.jpg";
import { useWeb3React } from "@web3-react/core";
import ClaimComponent from "../components/Claim/ClaimComponent";
import MintCardComponent from "../components/Cards/MintCard";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import DropdownComponent from "../components/Dropdown/dropdownmenu";
import Swal from "sweetalert2";
import { abiObject } from "../contracts/abi/abi.mjs";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { SwapWidget, Theme, darkTheme } from "@uniswap/widgets";
import StakeComponent from "../components/Stake/StakeComponent";
const Home: NextPage = () => {
  const { account, chainId, active } = useWeb3React();
  const showConnectAWallet = Boolean(!account);
  const context = useWeb3React();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [burnamount, setburnamount] = useState(Number);
  const [loading, setLoading] = useState(false);
  const { library } = context;
  const [isended, setisended] = useState(false);
  const [uniswaprovider, setuniswapprivder] = useState();

  const videoRefMobile = useRef(null);
  const videoRefNonMobile = useRef(null);
  const [isMobile, setIsMobile] = useState(Boolean);
  const attemptPlay = (videoRef: any) => {
    videoRef && videoRef.current && videoRef.current.defaultMuted == false;
    videoRef.current.load() &&
      videoRef.current.play().catch((error: any) => {
        console.log("error attempting to play", error);
      });
  };

  useEffect(() => {
    const videoRef = isMobile ? videoRefMobile : videoRefNonMobile;
    attemptPlay(videoRef);
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);

    handleResize(); // set initial value

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(isMobile);

  useEffect(() => {
    async function setProvider() {
      if (account) {
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        return provider;
      } else {
        return;
      }
    }
    setProvider().then((result) => setuniswapprivder(result as any));
  }, [account]);

  useEffect(() => {
    async function ScrollpositionAnimation() {
      const targets = document.querySelectorAll(".js-show-on-scroll");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeIn");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeIn");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    async function scrollpositionAnimationdown() {
      const targets = document.querySelectorAll(".js-show-on-scroll-down");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeindown");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeindown");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    async function scrollpositionAnimationleft() {
      const targets = document.querySelectorAll(".js-show-on-scroll-left");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeinleft");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeinleft");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    async function scrollpositionAnimationright() {
      const targets = document.querySelectorAll(".js-show-on-scroll-right");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeinright");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeinright");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    async function scrollpositionAnimationscaleintopleft() {
      const targets = document.querySelectorAll(
        ".js-show-on-scroll-scaleintopleft"
      );
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-scaleintopleft");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-scaleintopleft");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    scrollpositionAnimationscaleintopleft();
    scrollpositionAnimationleft();
    scrollpositionAnimationright();
    scrollpositionAnimationdown();

    ScrollpositionAnimation();
  });

  const theme: Theme = {
    borderRadius: 0,
    fontFamily: '"Mandalore"',
  };
  const MY_TOKEN_LIST = [
    {
      name: "Cosmic Odyssey",
      address: "0xb99405b00eF8D0Cf17aEf9D46a8d3cB9f3b72e57",
      symbol: "COSMIC",
      decimals: 18,
      chainId: 1,
    },
  ];

  const addTokenToMM = async () => {
    try {
      const { ethereum }: any = window;
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0xb99405b00eF8D0Cf17aEf9D46a8d3cB9f3b72e57", // ERC20 token address
            symbol: `COSMIC`,
            decimals: 18,
          },
        },
      });
    } catch (ex) {
      // We don't handle that error for now
      // Might be a different wallet than Metmask
      // or user declined
      console.error(ex);
    }
  };

  const Burntoken = useCallback(async () => {
    if (!account) {
      Swal.fire({
        icon: "error",
        title: "Connect Your Wallet To Burn",
        timer: 5000,
      });
    }

    try {
      setLoading(true);
      const data = abiObject;
      const abi = data;
      const contractaddress = "0x552754cBd16264C5141cB5fdAF34246553a10C49"; // "clienttokenaddress"
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      //const provider = getDefaultProvider()
      const signer = provider.getSigner();
      const contract = new Contract(contractaddress, abi, signer);
      console.log(contract);
      const finalburn = ethers.utils.parseUnits(burnamount.toString(), 18);
      const BurnTokens = await contract.burn(finalburn); //.burn()
      const signtransaction = await signer.signTransaction(BurnTokens);
      const FinalBurn = Number(signtransaction);
      //const StringFinalBurn = FinalBurn
      Swal.fire({
        icon: "success",
        title: "Congratulations you have Burned all of your tokens",
        text: "We shall see you next time when you wish to burn more!",
      });
      return FinalBurn;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [account, library?.provider, burnamount]);

  function RenderButtons() {
    setisended(true);
  }

  // <div className={"mb-10 sm:mb-10 md:mb-10 lg:mb-10 xl:mb-0 flex flex-col"}>
  // <Image
  //   className="min-w-0 min-h-0 visible sm:visible md:visible lg:visible xl:min-w-0 xl:min-h-0 xl:invisible"
  //   src={goonsLogoMobile}
  // ></Image>
  // </div>

  return (
    <div className="scroll-smooth">
      <main className={styles.main}>
        <header>
          {" "}
          <HeaderComponent></HeaderComponent>
        </header>
        {isMobile ? (
          <video
            ref={videoRefMobile}
            className="min-w-full z-0 min-h-full relative object-cover visible md:invisible"
            playsInline
            autoPlay
            loop
            muted
          >
            <source src="/LinqVidMobile.mp4" type="video/mp4" />
            Your browser does not support the video tag, update your browser
          </video>
        ) : (
          <>
            <video
              ref={videoRefNonMobile}
              className="min-w-full z-0 min-h-full relative object-cover invisible md:visible"
              playsInline
              autoPlay
              loop
              muted
            >
              <source src="/LinqVid.mp4" type="video/mp4" />
              Your browser does not support the video tag, update your browser
            </video>
          </>
        )}
        <div
          className={"flex flex-col absolute z-10 mx-auto justify-center"}
        ></div>
        <div
          className={
            "absolute z-10 my-20 flex flex-col justify-center lg:flex-row"
          }
        >
          <div
            className={`mx-5 w-fit px-4 justify-center mx-auto text-center`}
            style={{ fontFamily: "Mandalore" }}
          >
            <iframe
              className={"rounded-xl"}
              width="400"
              height="720"
              allow="clipboard-read *; clipboard-write *; web-share *; accelerometer *; autoplay *; camera *; gyroscope *; payment *; geolocation *"
              src="https://flooz.xyz/embed/trade?swapDisabled=false&swapToTokenAddress=0x3e34eabF5858a126cb583107E643080cEE20cA64&swapLockToToken=true&onRampDisabled=false&onRampAsDefault=false&onRampDefaultAmount=10000&onRampTokenAddress=0x3e34eabF5858a126cb583107E643080cEE20cA64&onRampLockToken=true&stakeDisabled=true&network=eth&lightMode=false&primaryColor=%23463b72&backgroundColor=transparent&roundedCorners=10&padding=20&refId=4itSAj"
            ></iframe>
          </div>
          <p className={"my-5"}></p>
          <div className={`mx-5 text-center self-center justify-center`}>
            <ClaimComponent></ClaimComponent>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
