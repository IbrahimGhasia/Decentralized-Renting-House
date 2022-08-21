import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-3 border-b-2 flex flex-row justify-between items-cneter bg-skyblue sticky top-0 z-50">
            <h1 className="py-4 px-4 font-bold text-3xl text-white">Decentralized Renting House</h1>

            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6 text-white text-lg">Home</a>
                </Link>
                <Link href="/rent-out">
                    <a className="mr-4 p-6 text-white text-lg">Become a host</a>
                </Link>

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
