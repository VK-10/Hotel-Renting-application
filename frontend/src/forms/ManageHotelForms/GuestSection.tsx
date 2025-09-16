import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

const GuestSection = () => {
    const { register, formState : {errors} } = useFormContext<HotelFormData>();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Guests</h2>
            <div className="flex grid-cols-2 gap-5 p-6 bg-gray-300">
                    <label className="text-gray-700 text-sm font-semibold">
                    Adults
                    <input className="border rounded w-full py-2 text-gray-700 font-normal"
                    type  = "number"
                    min = {1}
                    
                    {...register("adultCount", {
                        required: "this field is required",
                    })}

                    />
                    
                    {errors.adultCount && (
                        <span className="text-red-500">{errors.adultCount?.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-semibold">
                    Children
                    <input className="border rounded w-full py-2 text-gray-700 font-normal"
                    type  = "number"
                    min = {0}
                    
                    {...register("childCount", {
                        required: "this field is required",
                    })}

                    />
                    
                    {errors.childCount && (
                        <span className="text-red-500">{errors.childCount?.message}</span>
                    )}
                </label>

            </div>

        </div>
    )
};

export default GuestSection;