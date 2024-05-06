import { NextRequest, NextResponse } from "next/server";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export async function POST(request: NextRequest) {
  try {
    await Moralis.start({
      apiKey: String(process.env.NEXT_PUBLIC_MORALIS_API_KEY),
    });

    const { address } = await request.json();

    const chain = EvmChain.ETHEREUM;

    const nativeChainBalanceResponse =
      await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
      });

    const tokenBalanceResponse =
      await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
      });

    return NextResponse.json(
      {
        message: "sent successfull",
        nativeTokenBalance: nativeChainBalanceResponse,
        token: tokenBalanceResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "server error " });
  }
}
