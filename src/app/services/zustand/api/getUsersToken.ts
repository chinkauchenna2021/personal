import { create } from 'zustand';
import axios from 'axios'

interface State {
  usersWalletToken:Record<any,any>
}

interface Action{
  getUsersWalletToken : (usersWalletAddress:string) => void;
}



export const executeUsersWallet = create<State & Action>((set) => ({
    usersWalletToken:{},
    getUsersWalletToken:  async (usersWalletAddress:string)=>{
        const returnData = await axios.post("http://localhost:3000/api/usersWalletBalance/" , {address:usersWalletAddress})
     return set({usersWalletToken:returnData.data})
  }
}))