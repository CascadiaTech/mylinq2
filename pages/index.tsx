import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import HeaderComponent from "../components/Header/HeaderComponent";
import "tailwindcss-elevation";
import FooterComponent from "../components/Footer/FooterComponent";
import ScrollpositionAnimation from "../hooks/OnScroll";
import { useCallback, useEffect, useRef, useState } from "react";
import linqbackground from "../assets/images/linqBackground.jpg";
import "@uniswap/widgets/fonts.css";
import goonsHomepage from "../assets/images/GoonsHomepage.jpg";
import goonsLogoMobile from "../assets/images/goonsLogoMobile.jpg";
import KomaInuLogo from "../assets/images/Necklace.jpg";
import { useWeb3React } from "@web3-react/core";
import ClaimComponent from "../components/Claim/ClaimComponent";
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
import { isMobile } from "react-device-detect";
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

  //const videoRefMobile = useRef(null);
  //const videoRefNonMobile = useRef(null);
  //const [isMobile, setIsMobile] = useState(Boolean);
  //const attemptPlay = (videoRef: any) => {
  //  videoRef && videoRef.current && videoRef.current.defaultMuted == false;
  //  videoRef.current.load() &&
  //    videoRef.current.play().catch((error: any) => {
  //      console.log("error attempting to play", error);
  //    });
  //};
  //
  //useEffect(() => {
  //  const videoRef = isMobile ? videoRefMobile : videoRefNonMobile;
  //  attemptPlay(videoRef);
  //}, [isMobile]);
  //
  //useEffect(() => {
  //  const handleResize = () => setIsMobile(window.innerWidth <= 800);
  //
  //  handleResize(); // set initial value
  //
  //  window.addEventListener("resize", handleResize);
  //
  //  return () => window.removeEventListener("resize", handleResize);
  //}, []);
  //console.log(isMobile);

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
      const finalburn = ethers.parseUnits(burnamount.toString(), 18);
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
  console.log(isMobile, "mobileeeee");

  return (
    <div className="scroll-smooth ">
        <header>
          <HeaderComponent />
        </header>
        {/* <Image className="z-0  " src={linqbackground}></Image> */}
        {/* <div className={"flex flex-col  z-10 mx-auto justify-center "}></div> */}
      <main className={`${styles.main} `}>
        <div className="w-full">
          <div
            className={` w-full lg:w-auto  flex justify-center mx-auto text-center`}
            style={{ fontFamily: "Mandalore" }}
          >
            <div className={` text-center self-center justify-center`}>
              <ClaimComponent />
            </div>
            <p className={"my-5"}></p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
