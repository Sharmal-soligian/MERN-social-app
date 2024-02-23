import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { verifyToken } from './middleware/verifyToken.js';

/* MIDDLEWARES */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* ENVIRONMENT SETUP */
dotenv.config();
const app = express();
app.use(express.json());
/* TO SAFEGAURD THE REQ */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
/* MORGAN FOR LOGIN */
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
/* SET THE DIRECTORY WHERE WE KEEP ASSETS */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE SETUP */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
/* WHENEVER WANT TO UPLOAD THE FILE USE THIS upload VARIABLE */
const upload = multer({ storage });

/* FILE ROUTES */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* ERROR HANDLING MIDDLEWARE */
app.use(errorHandler);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

/* MONGODB SETUP */
const port = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => console.log(`Server is listening in port: http://localhost:${port}`));
}).catch((error) => console.log(`${error} did not connect`));