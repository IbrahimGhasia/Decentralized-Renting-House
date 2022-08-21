import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import rentHouseAbi from "../constants/RentHouse.json"
import networkMapping from "../constants/networkMapping.json"
export default function Home() {
    const { runContractFunction } = useWeb3Contract()
    const { chainId, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const rentHouseAddress = networkMapping[chainString]["RentHouse"][0]

    const [theArray, setTheArray] = useState([])
    const [booking_id, setBooking_Id] = useState()
    const [checkinDate, setCheckinDate] = useState()
    const [checkoutDate, setCheckoutDate] = useState()

    const dispatch = useNotification()

    const onChangeCheckinDate = (e) => {
        setCheckinDate(e.target.value)
    }

    const onChangeCheckoutDate = (e) => {
        setCheckoutDate(e.target.value)
    }

    let date1 = new Date(checkinDate)
    let date2 = new Date(checkoutDate)

    let checkinDateinDays = getNumberOfDays(date1.getMonth(), date1.getUTCDate())
    let checkoutDateinDays = getNumberOfDays(date2.getMonth(), date2.getUTCDate())

    // console.log(checkinDateinDays)
    // console.log(checkoutDateinDays)

    function getNumberOfDays(month, day) {
        let days = 0
        for (let i = 0; i < month; i++) {
            days = days + 30
        }
        return days + day
    }

    const { runContractFunction: getPropertyArray } = useWeb3Contract({
        abi: rentHouseAbi,
        contractAddress: rentHouseAddress,
        functionName: "getPropertyArray",
        params: {},
    })

    const { runContractFunction: getBookingId } = useWeb3Contract({
        abi: rentHouseAbi,
        contractAddress: rentHouseAddress,
        functionName: "getBookingId",
        params: {},
    })

    const { runContractFunction: getBookingCheckinDate } = useWeb3Contract({
        abi: rentHouseAbi,
        contractAddress: rentHouseAddress,
        functionName: "getBookingCheckinDate",
        params: {
            booking_id: booking_id,
        },
    })

    const { runContractFunction: getBookingCheckoutDate } = useWeb3Contract({
        abi: rentHouseAbi,
        contractAddress: rentHouseAddress,
        functionName: "getBookingCheckoutDate",
        params: {
            booking_id: booking_id,
        },
    })

    const handleSubmit = async (property_Id, price) => {
        let totalPrice = price * (checkoutDateinDays - checkinDateinDays)

        if (!isWeb3Enabled) {
            dispatch({
                type: "error",
                title: "Connect a Wallet!",
                position: "bottomL",
                icon: "bell",
            })
        }

        const bookingId = await getBookingId()
        setBooking_Id(bookingId)
        let prevCheckOutDay, prevCheckInDay
        ;(await getBookingCheckoutDate()) == undefined
            ? ((prevCheckOutDay = 0), (prevCheckInDay = 0))
            : (prevCheckOutDay = (await getBookingCheckoutDate()).toString()) &&
              (prevCheckInDay = (await getBookingCheckinDate()).toString())
        if (checkinDateinDays == prevCheckInDay || checkinDateinDays <= prevCheckOutDay) {
            handlePropertyNotAvailableError()
        } else {
            runContractFunction({
                params: {
                    abi: rentHouseAbi,
                    contractAddress: rentHouseAddress,
                    functionName: "rentProperty",
                    msgValue: totalPrice,
                    params: {
                        property_id: property_Id,
                        checkinDate: checkinDateinDays,
                        checkoutDate: checkoutDateinDays,
                    },
                },
                onError: (error) => {
                    if (
                        error.message.includes("RentHouse__PropertyNotAvailableForTheSelectedDate")
                    ) {
                        handlePropertyNotAvailableError()
                    }
                },
                onSuccess: handleSubmitSuccess,
            })
        }
    }

    const handleSubmitSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Transaction Complete",
            message: "Property Booked!",
            position: "bottomL",
            icon: "bell",
        })
    }

    const handlePropertyNotAvailableError = async () => {
        // await tx.wait(1)
        dispatch({
            type: "error",
            title: "Already Booked!",
            message: "Property is already booked for the dates! Please choose different dates",
            position: "bottomL",
            icon: "bell",
        })
    }

    async function updateUIValues() {
        const propertyArray = await getPropertyArray()
        setTheArray(propertyArray)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <div className="container mx-auto">
            <p className="py-4 px-4 font-medium tracking-widest text-skyblue text-lg border-b-2 border-grey-700">
                Find holiday rentals , cabins, beach houses 🏖️, unique homes and experiences around
                the world 🌍 – all made possible by Hosts on Decentralized Renting House 🏠
            </p>
            <div className="py-4 px-4">
                {theArray.map((item, index) => {
                    return (
                        <div key={index} className="mb-10 ">
                            <div className="block justify-center p-6 max-w-3xl bg-white rounded-lg border border-grey-700 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <h5 className="mb-2 text-4xl font-bold tracking-tight text-blue italic border-b-2 border-grey-700">
                                    {item[2]}
                                </h5>
                                <div>
                                    <div className="tracking-wide text-lg text-gray-600">
                                        <span className="font-medium tracking-wide text-skyblue text-lg">
                                            Property ID :{" "}
                                        </span>
                                        {item[0].toString()}
                                    </div>
                                    <div className="tracking-wide text-lg text-gray-600">
                                        <span className="font-medium tracking-wide text-skyblue text-lg">
                                            Owner Address :{" "}
                                        </span>
                                        {item[1].toString()}
                                    </div>
                                    <div className="tracking-wide text-lg text-gray-600">
                                        <span className="font-medium tracking-wide text-skyblue text-lg">
                                            Description :{" "}
                                        </span>
                                        {item[3]}
                                    </div>
                                    <div className="tracking-wide text-lg text-gray-600">
                                        <span className="font-medium tracking-wide text-skyblue text-lg">
                                            Price (per night) :{" "}
                                        </span>
                                        {parseInt(item[4].toString()) / 1000000000000000000} Matic
                                    </div>
                                    {/* {ethers.utils.parseUnits(item[4].toString(), "ether")} */}
                                </div>
                                {item[5] ? (
                                    <div>
                                        <div className="grid gap-6 items-end md:grid-cols-2 mt-4">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    id="checkinDate"
                                                    name="checkinDate"
                                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=" "
                                                    onChange={onChangeCheckinDate}
                                                />
                                                <label
                                                    htmlFor="checkinDate"
                                                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                                >
                                                    Checkin-Date :
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    id="checkoutDate"
                                                    name="checkoutDate"
                                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=" "
                                                    onChange={onChangeCheckoutDate}
                                                />
                                                <label
                                                    htmlFor="checkoutDate"
                                                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                                >
                                                    Checkout-Date :
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="text-white bg-blue hover:bg-skyblue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
                                                onClick={() => {
                                                    handleSubmit(
                                                        item[0].toString(),
                                                        item[4].toString()
                                                    )
                                                }}
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    className="mr-2 -ml-1 w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                                                </svg>
                                                Rent now
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-rose-600 text-xl font-bold">
                                        Property Deactivated by Owner
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                {/* {isrented ? <div></div> : null} */}
            </div>
        </div>
    )
}
