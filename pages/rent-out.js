import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification, CryptoLogos } from "web3uikit"
import { ethers } from "ethers"
import rentHouseAbi from "../constants/RentHouse.json"
import networkMapping from "../constants/networkMapping.json"

export default function Home() {
    const { runContractFunction } = useWeb3Contract()
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    // console.log(`ChainId is : ${chainString}`)
    const rentHouseAddress = networkMapping[chainString]["RentHouse"][0]
    const [propertyName, setPropertyName] = useState("")
    const [propertyDescription, setPropertyDescription] = useState("")
    const [propertyPrice, setPropertyPrice] = useState("")
    const [property_id, setPropertyID] = useState("")
    const [property_id2, setPropertyID2] = useState("")
    const [booking_id, setBookingID] = useState("")

    const dispatch = useNotification()

    const onChangeName = (e) => {
        setPropertyName(e.target.value)
    }

    const onChangeDescription = (e) => {
        setPropertyDescription(e.target.value)
    }

    const onChangePrice = (e) => {
        setPropertyPrice(e.target.value)
    }

    const onChangePropertyID = (e) => {
        setPropertyID(e.target.value)
    }

    const onChangePropertyID2 = (e) => {
        setPropertyID2(e.target.value)
    }

    const onChangeBookingID = (e) => {
        setBookingID(e.target.value)
    }

    const handleSubmit = async () => {
        runContractFunction({
            params: {
                abi: rentHouseAbi,
                contractAddress: rentHouseAddress,
                functionName: "rentOutProperty",
                params: {
                    property_name: propertyName,
                    property_description: propertyDescription,
                    price: ethers.utils.parseUnits(propertyPrice, "ether"),
                },
            },
            onError: (error) => console.log(error),
            onSuccess: handleSubmitSuccess,
        })
    }

    const handleWithdraw = async () => {
        runContractFunction({
            params: {
                abi: rentHouseAbi,
                contractAddress: rentHouseAddress,
                functionName: "withdraw",
                params: {
                    property_id: property_id,
                    booking_id: booking_id,
                },
            },
            onError: (error) => {
                if (error.message.includes("RentHouse__NotOwner")) {
                    handlePropertyNotOwnerError()
                }
            },
            onSuccess: handleWithdrawSuccess,
        })
    }

    const deactivate = async function () {
        runContractFunction({
            params: {
                abi: rentHouseAbi,
                contractAddress: rentHouseAddress,
                functionName: "makePropertyAsInActive",
                params: {
                    property_id: property_id2,
                },
            },
            onError: (error) => {
                console.log(`Error ${error}`)
            },
            onSuccess: handlePropertyDeactiveSuccess,
        })
    }

    async function updateUIValues() {}

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        } else {
            dispatch({
                type: "error",
                title: "Connect a Wallet!",
                position: "bottomL",
                icon: "bell",
            })
        }
    }, [isWeb3Enabled])

    const handleSubmitSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Transaction Complete",
            message: "Property Listed!",
            position: "bottomL",
            icon: "bell",
        })
    }

    const handleWithdrawSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Money Withdrawen",
            position: "bottomL",
            icon: "bell",
        })
    }

    const handlePropertyNotOwnerError = async () => {
        dispatch({
            type: "error",
            title: "You are not owner of the property!",
            position: "bottomL",
            icon: "bell",
        })
    }

    const handlePropertyDeactiveSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Property Deactive",
            message: "Property Deactivated Succesfully!",
            position: "bottomL",
            icon: "bell",
        })
    }

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 text-3xl border-b-2 text-blue">Become a Host</h1>
            <div className="py-4 px-4">
                <div className="grid gap-6 items-end md:grid-cols-3">
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="propertyName"
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={onChangeName}
                        />
                        <label
                            htmlFor="name"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                            Property Name :
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            id="description"
                            name="propertyDescription"
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={onChangeDescription}
                        />
                        <label
                            htmlFor="description"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                            Description :
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={onChangePrice}
                        />
                        <label
                            htmlFor="price"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                            Price (per night) MATIC :
                        </label>
                    </div>
                </div>

                <br />

                <div className="text-center">
                    <button
                        id="submit"
                        type="button"
                        className="text-white bg-skyblue hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleSubmit}
                    >
                        <CryptoLogos
                            chain="polygon"
                            onClick={function noRefCheck() {}}
                            size="25px"
                        />
                        <span className="ml-2 font-bold">Pay with MATIC</span>
                    </button>
                </div>
            </div>

            <h1 className="py-4 px-4 text-2xl ml-4 border-b-2 text-blue">Withdraw Your Funds</h1>
            <div className="grid gap-6 items-end md:grid-cols-5 mb-6 mt-6 ml-4">
                <div className="relative">
                    <input
                        type="text"
                        id="propertyID"
                        name="propertyID"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        onChange={onChangePropertyID}
                    />
                    <label
                        htmlFor="propertyID"
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Enter Your Property ID :
                    </label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        id="bookingID"
                        name="bookingID"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        onChange={onChangeBookingID}
                    />
                    <label
                        htmlFor="bookingID"
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Enter Booking ID :
                    </label>
                </div>
            </div>

            <div className="">
                <button
                    id="submit"
                    type="button"
                    className="text-white bg-skyblue hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-4"
                    onClick={handleWithdraw}
                >
                    <span className="font-bold">Withdraw</span>
                </button>
            </div>
            <h1 className="py-4 px-4 text-2xl ml-4 border-b-2 text-blue">
                Make Your Property Deactive
            </h1>
            <div className="grid gap-6 items-end md:grid-cols-5 mb-6 mt-6 ml-4">
                <div className="relative">
                    <input
                        type="text"
                        id="propertyID2"
                        name="propertyID2"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        onChange={onChangePropertyID2}
                    />
                    <label
                        htmlFor="propertyID2"
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Enter Your Property ID :
                    </label>
                </div>
            </div>
            <div className="">
                <button
                    id="submit"
                    type="button"
                    className="text-white bg-red-700 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-4 mb-4"
                    onClick={deactivate}
                >
                    <span className="font-bold">De-Activate</span>
                </button>
            </div>
        </div>
    )
}
