import "tailwindcss-elevation";
import { useWeb3React } from "@web3-react/core";
import Swal from "sweetalert2";
import { Accordion } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import styles from "../../styles/Home.module.css";
import { Contract } from "@ethersproject/contracts";
import { stakingabiObject } from "../../contracts/abi/stakingabi.mjs";
import { pairaddressabiObject } from "../../contracts/abi/pairaddressabi.mjs";
import { Web3ReactProvider } from "@web3-react/core";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ScrollpositionAnimation from "../../hooks/OnScroll";
import HeaderComponent from "../../components/Header/HeaderComponent";

export default function StakeComponent() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { account } = useWeb3React();
  const context = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [claim, setcanclaim] = useState(Boolean);
  const { library } = context;
  const [Claimable, setClaimable] = useState(false);
  const [pendingReturns, setpendingReturns] = useState(Number);
  const [amount, setAmount] = useState<number>(0);
  const [spender, setSpender] = useState(
    "0xb79F57f7d90f936D7FBCb5eD65BdA32718F2A5cC"
  );
  const [value, setValue] = useState(10000000000000);

  const [pendingreflections, setpendingreflections] = useState(Number);
  const [totaldistributed, settotaldistributed] = useState(Number);
  const [balance, setbalance] = useState(Number);

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
    async function getPendingRewards() {
      try {
        setLoading(true);
        const abi = stakingabiObject;
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const contractaddress = "0xb79F57f7d90f936D7FBCb5eD65BdA32718F2A5cC"; // "clienttokenaddress"
        const contract = new Contract(contractaddress, abi, provider);
        const rewardToken = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
        const Reflections = await contract.getPendingReturns(account);
        const pendingReturns = Web3.utils.fromWei(Reflections.toString());
        setpendingReturns(pendingReturns);
        console.log(pendingReturns);

        return pendingReturns;
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    getPendingRewards();
  }, [account]);

  const Claim = useCallback(async () => {
    if (!account) {
      Swal.fire({
        icon: "error",
        title: "Connect Your Wallet To Claim",
        timer: 5000,
      });
    }

    try {
      setLoading(true);
      const data = stakingabiObject;
      const abi = data;
      const contractaddress = "0xb79F57f7d90f936D7FBCb5eD65BdA32718F2A5cC"; // "clienttokenaddress"
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      const signer = provider.getSigner();
      const contract = new Contract(contractaddress, abi, signer);
      console.log(contract);
      const ClaimTokens = await contract.Claim(); //.claim()
      const signtransaction = await signer.signTransaction(ClaimTokens);
      const Claimtxid = await signtransaction;
      Swal.fire({
        icon: "success",
        title: "Congratulations you have Claimed all of your rewards",
        text: "Go see them in your wallet, and stick around for the next drop",
      });
      return Claimtxid;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [account, library?.provider]);

  async function DepositLP() {
    try {
      setLoading(true);
      const abi = stakingabiObject;
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      console.log(provider);
      if (!provider.getSigner) {
        throw new Error("Provider does not have a valid signer.");
      }
      const signer = provider.getSigner();
      const contractaddress = "0xb79F57f7d90f936D7FBCb5eD65BdA32718F2A5cC";
      const contract = new Contract(contractaddress, abi, signer); // "clienttokenaddress"
      const tx = await contract.Deposit_LP(amount);
      const response = await signer.sendTransaction(tx);
      const Claimtxid = await response;

      return Claimtxid;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
// This goes in depositLP to check if they have been approved yet, Error Handling.
  //const pairaddress = "0x9d3613eC2af3ECBf90AC27822eA3bfC8E63e83f2";
  //const pair = new Contract(pairaddress, pairaddressabiObject, signer);
  //const allowance = await pair.allowance(account, pairaddress);
  //if (allowance.lt(amount)) {
  //    Swal.fire({
  //        icon: "error",
  //        title: "Approval Required",
  //        text: "Go hit the approve button first!",
  //    });
  //    return; // Exit function if approval is not done
  //}

  async function WithdrawLP() {
    try {
      setLoading(true);
      const abi = stakingabiObject;
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      console.log(provider);
      if (!provider.getSigner) {
        throw new Error("Provider does not have a valid signer.");
      }
      const signer = provider.getSigner();
      const contractaddress = "0xb79F57f7d90f936D7FBCb5eD65BdA32718F2A5cC";
      const contract = new Contract(contractaddress, abi, signer); // "clienttokenaddress"
      const tx = await contract.WithdrawLP();
      const response = await signer.sendTransaction(tx);
      const Claimtxid = await response;

      return Claimtxid;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function EmergencyWithdraw() {
    try {
      setLoading(true);
      const abi = stakingabiObject;
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      console.log(provider);
      if (!provider.getSigner) {
        throw new Error("Provider does not have a valid signer.");
      }
      const signer = provider.getSigner();
      const contractaddress = "0xb79F57f7d90f936D7FBCb5eD65BdA32718F2A5cC";
      const contract = new Contract(contractaddress, abi, signer); // "clienttokenaddress"
      const tx = await contract.EmergencyUnstake();
      const response = await signer.sendTransaction(tx);
      const Claimtxid = await response;

      return Claimtxid;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function Approve() {
    try {
      setLoading(true);
      const abi = pairaddressabiObject;
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      console.log(provider);
      if (!provider.getSigner) {
        throw new Error("Provider does not have a valid signer.");
      }
      const signer = provider.getSigner();
      const contractaddress = "0xa8a837e2bf0c37fef5c495951a0dfc33aaead57a";
      const contract = new Contract(contractaddress, abi, signer); // "clienttokenaddress"
      const tx = await contract.approve(spender, value);
      const response = await signer.sendTransaction(tx);
      const Claimtxid = await response;

      return Claimtxid;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
        <div className="flex flex-col w-fit absolute top-0 mt-40 z-10">
          <h5
            style={{ fontFamily: "Azonix" }}
            className="text-center mb-2 text-4xl font-bold tracking-wide self-center text-gray-300 dark:text-gray-300"
          >
            LP Staking Station
          </h5>
          <div
            className={
              " mx-4 flex flex-col opacity-90 border-2 border-gray-500 rounded-2xl px-6 py-4"
            }
            style={{ backgroundColor: "#0d0d0d" }}
          >
            <p
              style={{ fontFamily: "GroupeMedium" }}
              className={"text-xl text-center font-bold text-gray-300"}
            >
              Amount you want to stake
            </p>
            <p
              style={{ fontFamily: "GroupeMedium" }}
              className={"text-xl text-center font-bold text-gray-300 my-2"}
            >
              Locking Period: Approximately two weeks
            </p>
            <input
              style={{ backgroundColor: "#4a4a4a" }}
              className={"border-2 justify-center mx-auto border-gray-300 w-fit rounded-2xl px-4 py-2 my-2"}
              type="number"
              placeholder="Enter stake amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <div className="flex-row mx-auto my-2 justify-center">
              <button
                onClick={() => Approve()}
                style={{ backgroundColor: "#191919" }}
                className={
                  "rounded-xl hover:text-white text-gray-400 text-xl px-4 py-2 m-3"
                }
              >
                <p
                  style={{ fontFamily: "GroupeMedium" }}
                  className={"text-xl font-bold"}
                >
                  Approve
                </p>
              </button>
              <button
                onClick={() => DepositLP()}
                style={{ backgroundColor: "#191919" }}
                className={
                  "rounded-xl hover:text-white text-gray-400 text-xl px-4 py-2 m-3"
                }
              >
                <p
                  style={{ fontFamily: "GroupeMedium" }}
                  className={"text-xl font-bold"}
                >
                  Deposit LP
                </p>
              </button>
            </div>{" "}
            <button
              onClick={() => WithdrawLP()}
              style={{
                fontFamily: "GroupeMedium",
              }}
              className={
                "text-xl rounded-2xl font-bold bg-gray-300 text-gray-800 py-2"
              }
            >
              Withdraw LP
            </button>
            <p className={"my-5"}></p>
            <div
              className={
                " mx-auto justify-center flex flex-col rounded-2xl px-6 py-4"
              }
            >
              <p
                style={{ fontFamily: "GroupeMedium" }}
                className={"text-xl font-bold text-gray-300 my-2"}
              >
                Claimable Rewards:
              </p>
              <p
                style={{ fontFamily: "GroupeMedium" }}
                className={"text-xl text-center font-bold text-gray-300 my-3"}
              >
                {pendingReturns}
              </p>
              <button
              onClick={() => Claim()}
                style={{
                  fontFamily: "GroupeMedium",
                  backgroundColor: "#191919",
                }}
                className={
                  "text-xl rounded-2xl px-6 py-4 font-bold hover:text-white text-gray-400"
                }
              >
                Claim
              </button>
            </div>
            <p
              onClick={() => EmergencyWithdraw()}
              style={{
                fontFamily: "GroupeMedium",
              }}
              className={
                "text-xl rounded-2xl cursor-normal text-center bg-gray-300 font-bold text-gray-800 py-2"
              }
            >
              Emergency Withdraw
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
