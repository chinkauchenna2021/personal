import { useWeb3Modal } from '@web3modal/ethers/react'
import BodyLayout from './layouts/BodyLayout'
import MainPage from './components/Index';
export default function Home() {
  return (
      <div className='w-full flex justify-center bg-slate-950'>
          <MainPage />
      </div>
  );
}
