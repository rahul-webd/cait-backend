import express from 'express';
import 'dotenv/config';

const app = express();

const port = process.env.PORT;
const firebaseConfig = process.env.FIREBASE_CONFIG;

app.get('/', (req, res) => {
    res.send('working');
});

app.listen(port, () => {
    console.log(`CAIT API listening on port ${port}`);
});