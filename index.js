import express from 'express';
import homepageRouter from './app/routes/homepage.route.js';
import roomRouter from './app/routes/room.route.js';
import authRouter from './app/routes/auth.route.js'
import cookieParser from 'cookie-parser';
import { decodeUserFromToken } from './app/middlewares/decodeUserFromToken.middleware.js';
import 'dotenv/config';
import './app/models/index.js';


const app  = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('public'));

app.use(decodeUserFromToken);
app.use('/', homepageRouter);
app.use('/rooms', roomRouter);
app.use('/', authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
