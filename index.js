import express from 'express';
import homepageController from './app/controllers/homepage-controller.js';
import homepageRouter from './app/routes/homepage.route.js';
import 'dotenv/config';
import './app/models/index.js';


const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('public'));

app.use('/', homepageRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
