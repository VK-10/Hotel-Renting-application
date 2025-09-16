import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import * as apiClient from '../api-client'
import { BsMap } from 'react-icons/bs'
import { BiHotel, BiMoney, BiStar } from "react-icons/bi"
import { BsBuilding } from "react-icons/bs"
import type { HotelType } from "../../../backend/src/shared/type"

const MyHotels = () => {
    const { data: hotelData, error } = useQuery<HotelType[]>({
        queryKey: ["fetchMyHotels"],
        queryFn: apiClient.fetchMyHotels,
        // onError: (error: unknown) => {
        //     console.error("Error fetching hotels:", error);
        // },
    });

    if (error) {
        console.error("Error fetching hotels:", error);
    }

    const hotels = hotelData as HotelType[] | undefined;

if (!hotels || hotels.length === 0) {
    return <span>No Hotels found</span>
}

    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">My Hotels</h1>
                <Link 
                    to="/add-hotel" 
                    className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
                >
                    Add Hotel
                </Link>
            </span>
            <div className="grid grid-cols-1 gap-8">
                {hotels.map((hotel) => (
                    <div key={hotel._id} className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                        <h2 className="text-2xl font-bold">{hotel.name}</h2>
                        <div className="whitespace-pre-line">{hotel.description}</div>
                        
                        {/* Hotel details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsMap className="mr-2" />
                                {hotel.city}, {hotel.country}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsBuilding className="mr-2" />
                                {hotel.type}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiMoney className="mr-2" />
                                ${hotel.pricePerNight} per Night
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiHotel className="mr-2" />
                                {hotel.adultCount} adults, {hotel.childCount} children 
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiStar className="mr-2" />
                                {hotel.starRating} Star{hotel.starRating !== 1 ? 's' : ''}
                            </div>
                        </div>
                        
                        <span className="flex justify-end">
                            <Link 
                                to={`/edit-hotel/${hotel._id}`} 
                                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
                            >
                                View Details
                            </Link>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyHotels