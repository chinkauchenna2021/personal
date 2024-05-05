import { create } from 'zustand'

interface State {
  usersWalletAddress:string
}

interface Action{
  getUsersWallet : (walletAddress:string) => void;
}



export const storeUsersWalletAddress = create<State & Action>((set) => ({
    usersWalletAddress:"",
  getUsersWallet: (walletAddress:string)=>set({usersWalletAddress: walletAddress})
  
}))