import express, {Request, Response} from "express";
import multer from 'multer';
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model.js";
import type { HotelType } from "../shared/type.js";
import verifytoken from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

//api/my-hotels
router.post("/", verifytoken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('city is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel Type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price per Night is required and must be a number'),
    body("facilities").notEmpty().isArray().withMessage('Facilities is required'),
    body("name").notEmpty().withMessage('Name is required'),

],upload.array("imageFiles", 6),async (req:Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;
        const imageUrls = await uploadImages(imageFiles);

        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        const hotel = new Hotel(newHotel);
        
        await hotel.save();

        res.status(201).send(hotel);
        
    } catch(e) {
        console.log("Error creating hotel: ", e);
        res.status(500).json({message: "Something went wrong"})
    }
})

router.get("/", verifytoken, async(req: Request, res:Response)=> {

    try {
        const hotels = await Hotel.find({userId: req.userId})
        res.json(hotels);
    } catch(error) {
        res.status(500).json({ message: "Error fetching hotels"})
    }
});

router.get("/:id", verifytoken, async (req:Request, res: Response)=> {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        })

        res.json(hotel);

    } catch (e) {
        res.status(500).json({message : "Error fetching hotels"})
    }
});

router.put("/:hotelId", verifytoken, upload.array("imageFiles"), async (req:Request, res: Response)=> {
    try{
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, {new : true});

        if (!hotel) {
            return res.status(404).json({ message: "hotel not found"});
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || []),];
        await hotel.save();
        res.status(201).json(hotel);
        
    } catch (error) {
        res.status(500).json({ message: "Somthing went wrong"})
    }
})



async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64');
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log(imageUrls)

    return imageUrls;
}


export default router;