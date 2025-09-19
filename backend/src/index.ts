import express, {Request, Response} from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoutes from './routes/users.js'
import authRoutes from "./routes/auth.js"
import myHotelRoutes from './routes/my-hotels.js'
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary'
import hotelRoutes from './routes/hotels.js'
import bookingRoutes from './routes/my-bookings.js'
import path from 'path'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_ClOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 

})

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to database'))
  .catch((error) => {
    console.log('MongoDB connection error:', error);
    // Continue running without MongoDB for development
  });

const app = express();
app.use(cookieParser());

// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === "production") {
//     // More permissive CSP for production
//     res.setHeader(
//       "Content-Security-Policy",
//       "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
//       "style-src * 'unsafe-inline'; " +
//       "font-src * data:; " +
//       "script-src * 'unsafe-inline' 'unsafe-eval'; " +
//       "frame-src *; " +
//       "connect-src *;"
//     );
//   } else {
//     // Stricter CSP for development (optional)
//     res.setHeader(
//       "Content-Security-Policy",
//       "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; " +
//       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
//       "font-src 'self' data: https://fonts.gstatic.com;"
//     );
//   }
//   next();
// });


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin : process.env.FRONTEND_URL || "http://localhost:5173" ,
  credentials: true,
})
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/my-hotels", myHotelRoutes)
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes)

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const PORT =  process.env.PORT || 7000;
app.listen(PORT, ()=> {
    console.log(`server running on localhost:${PORT}`)
})


