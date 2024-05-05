"use client"
import React , {useEffect} from 'react'
import { AddressLike, BrowserProvider, Eip1193Provider  } from 'ethers'
import { useEvmNativeBalance } from '@moralisweb3/next';
import { Button } from '../../ui/button'
import {  useWeb3ModalProvider, useWeb3Modal ,  useWalletInfo , useWeb3ModalAccount , useDisconnect  , useWeb3ModalState , useSwitchNetwork   } from '@web3modal/ethers/react'
import Image from 'next/image'
import { storeUsersWalletAddress } from '@/app/services/zustand/tokenWallet';

function Navbar() {
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider()
    const { walletInfo  } = useWalletInfo()
    const {disconnect} = useDisconnect()
    const { address, chainId, isConnected} = useWeb3ModalAccount()
    const { switchNetwork } = useSwitchNetwork()
    const {  selectedNetworkId } = useWeb3ModalState()
    const { data: nativeBalance } = useEvmNativeBalance({ address: String(address)});
    console.log(nativeBalance , "Eth balances")

//zustand
const setUsersAddress = storeUsersWalletAddress((state)=>state.getUsersWallet)
const EthAbi = [""];


const connectWallet = async()=>{

    try{

        open({ view: 'Networks' });
        setUsersAddress(String(address))


    }catch(error:any){
        console.log(error)
    }

//provider init


}

  useEffect(()=>{
      (async()=>{
          if(selectedNetworkId != String(1)){
            switchNetwork(1)
          }
          if(walletProvider == undefined) return;
          const provider = new BrowserProvider(walletProvider) 
          const signer = await provider.getSigner()
          const balanceEth = await provider.getBalance(address as AddressLike);
          console.log("users balance " , signer,Number(balanceEth))
      })()
  },[selectedNetworkId ,walletProvider])
    return (
    <div className=''> 
         <div >
            { isConnected?
            (
              <Button  onClick={()=>disconnect()}>
                <Image
                   src={String(walletInfo?.icon)}
                   alt={String(walletInfo?.name)}
                   height={30}
                   width={30}
                />
                <span>
                    {(String(address?.slice(0,5)+"..."+address?.slice(38,42))).toLowerCase()}
                </span>
              </Button>
            )
        :
        <Button variant={"secondary"} onClick={()=>connectWallet()}>Connect Wallet</Button>
            }
         </div> 
    </div>
  )
}

export default Navbar
