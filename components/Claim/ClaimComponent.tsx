import "tailwindcss-elevation";
import { useWeb3React } from "@web3-react/core";
import Swal from "sweetalert2";
import { Accordion } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { abiObject } from "../../contracts/abi/abi.mjs";
import { Web3ReactProvider } from "@web3-react/core";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ScrollpositionAnimation from "../../hooks/OnScroll";

export default function ClaimComponent() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { account } = useWeb3React();
  const context = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [claim, setcanclaim] = useState(Boolean);
  const { library } = context;
  const [Claimable, setClaimable] = useState(false);

  const [pendingreflections, setpendingreflections] = useState(Number);
  const [totaldistributed, settotaldistributed] = useState(Number);
  const [balance, setbalance] = useState(Number);

  useEffect(() => {
    async function Fetchbalance() {
      if (!account) {
        return;
      }

      try {
        setLoading(true);
        const abi = abiObject;
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const contractaddress = "0x3e34eabF5858a126cb583107E643080cEE20cA64"; // "clienttokenaddress"
        const contract = new Contract(contractaddress, abi, provider);
        const balance = await new contract.balanceOf(account); //.claim(account,amount)
        const Claimtxid = await balance;
        const finalbalance = Number(balance);
        const Fixeddecimals = finalbalance.toFixed(2);
        const Numberify = Number(Fixeddecimals);
        setbalance(Numberify);
        console.log(Numberify);

        return Claimtxid;
        /////
      } catch (error) {
        console.log(error, "ERROR 1111");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    async function PendingReflections() {
      try {
        setLoading(true);
        const abi = abiObject;
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const contractaddress = "0x3e34eabF5858a126cb583107E643080cEE20cA64"; // "clienttokenaddress"
        const contract = new Contract(contractaddress, abi, provider);
        const Reflections = await contract.withdrawableDividendOf(account); //.claim()
        const finalnumber = Web3.utils.fromWei(Reflections.toString());
        setpendingreflections(finalnumber);

        if (finalnumber > 0) {
          setClaimable(true);
        }
        console.log(Reflections);
        console.log(finalnumber);
        return finalnumber;
      } catch (error) {
        console.log(error, "error 2");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    async function FetchDistributed() {
      try {
        setLoading(true);
        const abi = abiObject;
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const contractaddress = "0x3e34eabF5858a126cb583107E643080cEE20cA64"; // "clienttokenaddress"
        const contract = new Contract(contractaddress, abi, provider);
        const rewardToken = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
        const Reflections = await contract.getTotalDividendsDistributed();
        const formattedDistributed = Web3.utils.fromWei(Reflections.toString());
        settotaldistributed(formattedDistributed);
        console.log(formattedDistributed);

        return formattedDistributed;
      } catch (error) {
        console.log(error, "error 3");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    PendingReflections();
    Fetchbalance();
    FetchDistributed();
  }, [account]);

  const Claimtoken = useCallback(async () => {
    if (!account) {
      Swal.fire({
        icon: "error",
        title: "Connect Your Wallet To Claim",
        timer: 5000,
      });
    }

    try {
      setLoading(true);
      const data = abiObject;
      const abi = data;
      const contractaddress = "0x3e34eabF5858a126cb583107E643080cEE20cA64"; // "clienttokenaddress"
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      const signer = provider.getSigner();
      const contract = new Contract(contractaddress, abi, signer);
      console.log(contract);
      const ClaimTokens = await contract.claim(); //.claim()
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

  return (
    <div className="w-screen flex  justify-center">
      
      <div className="mt-10 sm:w-[300px] md:w-[350px] lg:w-[500px]">
        <div className="p-10 inline-block w-[100%] bg-white">
          <p className="text-[25px] font-semibold text-black font-mono">
            CLAIM LP REWARDS
          </p>

          <div className="flex justify-between font-sans text-black border-b-[1px] pb-3 border-gray-500 mb-10 mt-10">
            <p>Pending LP Rewards </p>
            <p className="mr-4">{pendingreflections}</p>
          </div>

          <div className="flex justify-between font-sans text-black border-b-[1px] pb-3 border-gray-500 mt-5 mb-5">
            <p>Total LP Distributed </p>
            <p className="mr-4">{totaldistributed}</p>
          </div>

          {loading ? (
            <Spin indicator={antIcon} className="add-spinner" />
          ) : (
            <>
              <div className=" px-3 py-2 text-[20px] skew-x-[12deg] text-center sm:mt-20  sm:w-[50%] md:w-[35%] lg:w-[40%] bg-black text-white">
                <button
                  //  style={{ fontFamily: "Azonix" }}
                  className="font-sans cursor-pointer"
                  type="button"
                  onClick={() => Claimtoken()}
                >
                  CLAIM
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed mb-10 px-1 sm:px-5 md:px-10 lg:px-10 left-0 bottom-0 bg-transparent  w-full   flex justify-between">
        <p className="font-sans text-black">info@linqgroup.io</p>
        <p className="font-sans text-black">LINQGROUP2023</p>
      </div>

      {/* 
        <h5
          style={{ fontFamily: "Azonix" }}
          className="text-center mb-2 text-4xl font-bold tracking-wide self-center text-gray-300 dark:text-gray-300"
        >
          Claim LP Rewards
        </h5>
        <div className="md:grid grid-cols-2 mx-4 flex flex-col border-2 border-gray-500 rounded-xl">
          <div className={"rounded-xl text-black text-xl px-4 py-2 m-3"}>
            <p style={{fontFamily: 'GroupeMedium'}} className={"text-xl font-bold text-gray-300"}>
              Pending LP Rewards:
            </p>
          </div>
          <div className={"rounded-xl text-black text-xl px-4 py-2 m-3"}>
            <p className={"text-xl text-gray-300 "}>{pendingreflections}</p>
          </div>
          <div className={"rounded-xl text-black  text-xl px-4 py-2 m-3"}>
            <p style={{fontFamily: 'GroupeMedium'}} className={"text-xl font-bold text-gray-300"}>
              Total LP Distributed
            </p>
          </div>
          <div className={"rounded-xl text-black text-xl px-4 py-2 m-3"}>
            <p className={"text-xl text-gray-300"}>{totaldistributed}</p>
          </div>
        </div> */}

      {/* {loading ? (
          <Spin indicator={antIcon} className="add-spinner" />
        ) : (
          <>
            <div className="flex flex-row content-center mx-auto items-center max-w-screen">
              <button
                style={{ fontFamily: "Azonix" }}
                type="button"
                onClick={() => Claimtoken()}
                className="w-fit mx-0 px-20 md:px-32 self-center content-center tn:mx-0 elevation-10 hover:elevation-50 md:mx-24 h-24
                 clip-path-mycorners justify-self-center mt-10 text-gray-800 bg-gray-300 hover:bg-gray-400 hover:cursor-pointer transition ease-in-out duration-700
                 text-3xl lg:text-4xl hover:scale-95 "
              >
                Claim
              </button>
            </div>
          </>
        )} */}
    </div>
  );
}
