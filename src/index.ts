import express from 'express';
import 'dotenv/config';
import { setShopitems } from './main';

const app = express();

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('working');
});

app.get('/setShopItems', async (req, res) => {
    await setShopitems();
    res.end();
});

app.listen(port, () => {
    console.log(`CAIT API listening on port ${port}`);
});

//use bash scripts well
//add service account json key to cloud storage