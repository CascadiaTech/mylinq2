import "tailwindcss-elevation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ScrollpositionAnimation from "../../hooks/OnScroll";
import Swal from "sweetalert2";
import { NFTABIObject } from "../../contracts/NftAbi.mjs";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { formatEther, parseEther } from "@ethersproject/units";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
///import { utils } from 'ethers'

export default function MintCardComponent() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [loading, setLoading] = useState(false);
  const [totalSupply, settotalySupply] = useState(Number);
  const [pubmintprice, setpubmintprice] = useState(Number);
  const [pubmintactive, setpubmintactive] = useState(Boolean);
  const { account, chainId, active } = useWeb3React();
  const [claim, setClaimTokens] = useState(Boolean);
  const [tokenid, settokenid] = useState(Number)
  const showConnectAWallet = Boolean(!account);
  const context = useWeb3React();
  const { library } = context;
  const [quantity, setquantity] = useState(1);

  if (typeof window !== "undefined") {
    useEffect(() => {
      // Update the document title using the browser API
      ScrollpositionAnimation();
    }, [window.scrollY]);
  }

  useEffect(() => {
    async function FetchtotalSupply() {
      try {
        //setLoading(true)
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const NFTabi = NFTABIObject;
        const contractaddress = "0xF5e0a51ca7cd380727d7B9283C559FC147bD84cc";
        const contract = new Contract(contractaddress, NFTabi, provider);
        const Totalminted = await contract.totalSupply();
        const FinalResult = Number(Totalminted);
        const minted =  FinalResult;
        settotalySupply(minted);
        return minted;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }

    async function FetchPublicMintPrice() {
      try {
        //setLoading(true)
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const NFTabi = NFTABIObject;
        const contractaddress = "0xF5e0a51ca7cd380727d7B9283C559FC147bD84cc";
        const contract = new Contract(contractaddress, NFTabi, provider);
        const Mintprice = await contract.PUB_MINT_PRICE();
        const MintPriceformatted = formatEther(Mintprice);
        const FinalResult = Number(MintPriceformatted);
        const PublicMintPrice = FinalResult;
        setpubmintprice(PublicMintPrice);
        console.log(PublicMintPrice);
        return PublicMintPrice;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }

    async function FetchPublicMintActive() {
      try {
        //setLoading(true)
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const NFTabi = NFTABIObject;
        const contractaddress = "0xF5e0a51ca7cd380727d7B9283C559FC147bD84cc";
        const contract = new Contract(contractaddress, NFTabi, provider);
        const Mintactive = await contract.pubMintActive();
        setpubmintactive(Mintactive);
        return Mintactive;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }

    FetchPublicMintPrice();
    FetchtotalSupply();
    FetchPublicMintActive();
  }, [pubmintprice, account, library?.provider, totalSupply]);

  const handleMint = useCallback(async () => {
    if (!account || !quantity) {
      Swal.fire({
        icon: "error",
        title: "Connect Your Wallet To Mint, and Enter A Mint Quantity",
      });
    }
    if (quantity == 0) {
      Swal.fire({
        icon: "error",
        title: "Connect Your Wallet To Mint, and Enter A Mint Quantity",
      });
    }

    try {
      setLoading(true);
      const data = NFTABIObject;
      const abi = data;
      console.log(abi);
      const contractaddress = "0xF5e0a51ca7cd380727d7B9283C559FC147bD84cc"; // "clienttokenaddress"
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      console.log(provider)
      //const provider = getDefaultProvider()
      const signer = provider.getSigner();
      const contract = new Contract(contractaddress, abi, signer);
      console.log(contract)
      const ethervalue = quantity * 0.04;
      const etherstringvalue = JSON.stringify(ethervalue);
      const MintNFT = await contract.publicMint(quantity, {
        value: parseEther(etherstringvalue),
      }); //.claim()
      console.log(MintNFT)
      const signtransaction = await signer.signTransaction(MintNFT);
      const Claimtxid = await signtransaction;
      console.log(Claimtxid)
      Swal.fire({
        icon: "success",
        title: "Congratulations you have minted a GiveWellINU NFT",
        text: "Go View your item on Opensea",
      });
      console.log(MintNFT)
      console.log(Claimtxid)
      return Claimtxid;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
    console.log(Contract);
  }, [account, library?.provider, quantity]);
console.log(tokenid)
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
      const data = NFTABIObject;
      const abi = data;
      const contractaddress = "0xF5e0a51ca7cd380727d7B9283C559FC147bD84cc"; // "clienttokenaddress"
      const provider = new Web3Provider(
        library?.provider as ExternalProvider | JsonRpcFetchFunc
      );
      //const provider = getDefaultProvider()
      const signer = provider.getSigner();
      const contract = new Contract(contractaddress, abi, signer);
      console.log(contract);
      const ClaimTokens = await contract.ClaimTokens(String(tokenid)); //.claim()
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
  }, [account, library?.provider, claim]);

  //md:clip-path-clipsides border-t-4 border-b-4
  return (
    <div className="flex flex-col content-center items-center text-center mx-auto justify-center">
      <h5
        style={{ fontFamily: "PaintDrops" }}
        className="text-center mt-12 text-4xl lg:text-5xl mb:mb-2 font-bold tracking-tight text-red-600 dark:text-white"
      >
        Goonz Genesiz Series
      </h5>
      {loading ? (
        <div className="content-center items-center">
          <Spin indicator={antIcon} className="add-spinner" />
        </div>
      ) : (
        <>
          {" "}
          <button
            onClick={() => handleMint()}
            style={{ fontFamily: "PaintDrops" }}
            type="button"
            className="w-screen mb-12 justify-center elevation-10 align-center hover:elevation-50 md:w-96 h-24 justify-self-center mt-10
          text-gray-900 bg-red-600 transition ease-in-out duration-700 hover:scale-105 focus:ring-4
          focus:ring-black font-medium rounded-xl px-5 py-2.5 text-4xl"
          >
            Mint
          </button>
        </>
      )}{" "}
      <div
        style={{ fontFamily: "PaintDrops" }}
        className="text-black mb-2 text-2xl"
      >
        {quantity} NFT's
      </div>
      <label
        htmlFor="minmax-range"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      ></label>
      <input
        onChange={(e) => setquantity(Number(e.target.value))}
        id="minmax-range"
        type="range"
        min="1"
        max="20"
        value={quantity}
        className="w-1/2 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
      />
      <p
        className={"text-black text-3xl my-4 px-4"}
        style={{ fontFamily: "PaintDrops" }}
      >
        Select The Amount Of NFT's You Would Like To Mint
      </p>
      <p
        style={{ fontFamily: "PaintDrops" }}
        className="mt-4 text-black text-center text-3xl"
      >
        {" "}
        Price: 0.04 ETH
      </p>
      <p
        style={{ fontFamily: "PaintDrops" }}
        className="mt-4 text-black text-center text-3xl"
      >
        {" "}
        Total Amount of NFT's Sold: <br /> {totalSupply} NFT's
      </p>
      <p className={"my-10"}></p>
      <h5
        style={{ fontFamily: "PaintDrops" }}
        className="text-center mb-2 text-4xl font-bold tracking-tight self-center text-gray-800 dark:text-gray-800"
      >
        Claim NFT ETH Rewards
      </h5>
      {loading ? (
        <Spin indicator={antIcon} className="add-spinner" />
      ) : (
        <>
          <div className="flex flex-col mx-auto justify-center items-center max-w-screen">
          <div className="">
                    <label
                    style={{ fontFamily: "PaintDrops" }}
                      htmlFor="tokenid"
                      className="block mb-2 px-4 py-2 text-2xl font-medium text-gray-800"
                    >
                      Your NFT Token ID
                    </label>
                    <input
                    className={'bg-white text-black'}
                      onChange={(e) => settokenid(Number(e.target.value))}
                      type="number"
                      id="tokenid"
                      name="tokenid"
                      placeholder="tokenid"
                    ></input>
                  </div>
            <button
              onClick={() => Claimtoken()}
              style={{ fontFamily: "PaintDrops" }}
              className="w-fit mx-0 px-20 md:px-32 self-center content-center tn:mx-0 elevation-10 hover:elevation-50 md:mx-24 h-24
         clip-path-mycorners justify-self-center mt-10 text-gray-800 bg-red-600
         text-3xl lg:text-4xl "
            >
              Claim
            </button>
          </div>
        </>
      )}
    </div>
  );
}
