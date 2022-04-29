import express from 'express';
import cors from 'cors';
import { getItems, getItem, getColNames, getSchNames, getColItems,
    getSchItems, 
    getTemplates} from './main';

const port = process.env.PORT || 8080;
const app = express();

const options: cors.CorsOptions = {
    origin: '*'
}

app.use(cors(options));
app.use(express.json());

app.post('/get_drops', async (req, resp) => {
    const body = req.body;
    const lowerBound: string = body.lowerBound;
    const limit: number = body.limit;

    const res = await getItems(lowerBound, limit);
    resp.send(res);
});

app.post('/get_drop', async (req, resp) => {
    const body = req.body;
    const name: string = body.name;

    const res = await getItem(name);
    resp.send(res);
});

app.get('/get_collection_names', async (req, resp) => {
    const res = await getColNames();
    resp.send(res);
});

app.post('/get_schema_names', async (req, resp) => {
    const body = req.body;
    const colName: string = body.colName;

    const res = await getSchNames(colName);
    resp.send(res);
});

app.post('/get_collection_drops', async (req, resp) => {
    const body = req.body;
    const colName: string = body.colName;
    const lowerBound: string | boolean = body.lowerBound;
    const limit: number = body.limit;

    const res = await getColItems(colName, lowerBound, limit);
    resp.send(res);
});

app.post('/get_schema_drops', async (req, resp) => {
    const body = req.body;
    const colName: string = body.colName;
    const schName: string = body.schName;
    const lowerBound: string | boolean = body.lowerBound;
    const limit: number = body.limit;

    const res = await getSchItems(colName, schName, lowerBound, limit);
    resp.send(res);
});

app.post('/get_templates', async (req, resp) => {
    const body = req.body;
    const memo: string | undefined = body.memo;
    const ids: string[] | undefined = body.ids;

    let res = {}

    if (!memo && !ids) {
        res = { error: 'no query found' }
    } else {
        res = await getTemplates(memo, ids);
    }

    resp.send(res);
})

app.listen(port, () => {
    console.log(`api listening at port ${port}`);
});