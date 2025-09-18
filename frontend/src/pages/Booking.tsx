import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
    const {stripePromise} = useAppContext();
    const search = useSearchContext();
    const {hotelId} = useParams();

    const [numberOfNights , setNumberOfNights] = useState(0);

    useEffect(()=> {
        if(search.checkIn && search.checkOut) {
            const nights  = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);

            setNumberOfNights(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut])

//     useEffect(() => {
//   if (numberOfNights) {
//     createPaymentIntent(hotelId, numberOfNights).then(setPaymentIntentData);
//   }
// }, [numberOfNights]);

    const {data: hotel } = useQuery({
        queryKey : ["fetchHotelById", hotelId],
        queryFn : () => apiClient.fetchHotelById(hotelId as string),
        enabled : !!hotelId
    })


    const {data: paymentIntentData} = useQuery({
        queryKey : ["createPaymentIntent", hotelId, numberOfNights],
        queryFn : () => apiClient.createPaymentIntent(hotelId as string, numberOfNights),
        enabled : !! hotelId && numberOfNights > 0,
    })
    
    const { data : currentUser} = useQuery({
        queryKey : ["fetchCurrentUser"],
        queryFn : apiClient.fetchCurrentUser
    });
    console.log({ numberOfNights, paymentIntentData });

    
    
//     if (!hotel || !currentUser || numberOfNights === null) {
//     return <div>Loading booking details...</div>;
//   }
    
console.log("Render conditions:", {
  currentUser,
  numberOfNights,
  paymentIntentData,
});
    return (
  <div className="grid md:grid-cols-[1fr_2fr] gap-4">
    {hotel ? (
      <BookingDetailSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights ?? 0}
        hotel={hotel}
      />
    ) : (
      <div>Loading hotel details...</div>
    )}

    {currentUser && numberOfNights > 0 && paymentIntentData ? (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntentData.clientSecret }}
      >
        <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
      </Elements>
    ) : (
        
      <div>Loading booking form...</div>
      
    )}
  </div>
);


};

export default Booking;