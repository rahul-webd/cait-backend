import { Reference } from '@firebase/database-types';
import * as admin from 'firebase-admin';
import * as serviceKey from '../key.json';
import { FILESAVEERROR, INVALIDHASH } from './exceptions';
import { disValidateNames, disValidateMemoKeys,
    disvalidateImmData, validateNames, 
    validatePropertyName } from './helpers';
import { resize } from './ipfsResizer';
import { Data, ResizedMedia, shopItems, templateItem } from './schemas';
import { Storage } from '@google-cloud/storage';

const sk: any = serviceKey;

admin.initializeApp({
    credential: admin.credential.cert(sk),
    databaseURL: 'https://cait-49fc0-default-rtdb.firebaseio.com',
    storageBucket: 'cait-49fc0.appspot.com'
})
const db = admin.database();

export const getItems = async (lowerBound: string | undefined,
    limit: number) => {

    const ref = db.ref('shopData/items');
    let query;

    if (lowerBound) {
        lowerBound = validatePropertyName(lowerBound);

        query = ref.orderByKey().startAfter(lowerBound).limitToFirst(limit);
    } else {
        query = ref.limitToFirst(limit);
    }

    const snapshot = await query.once('value').catch(err => {
        console.log(err);
    });

    if (snapshot && snapshot.exists()) {
        let data: shopItems = snapshot.val();
        const optItems: shopItems = disValidateMemoKeys(data);

        return optItems;
    } else {
        return { error: 'no data found' }
    }
}

export const getItem = async (name: string) => {

    name = validatePropertyName(name);

    const ref = db.ref(`shopData/items/${name}`);

    const snapshot = await ref.once('value').catch(err => {
        console.log(err);
    });

    if (snapshot && snapshot.exists()) {

        return snapshot.val();
    } else {
        return { error: 'no data found' }
    }
}

export const getColNames = async () => {
    const ref = db.ref(`shopData/collections/colNames`);

    const snapshot = await ref.once('value').catch(err => {
        console.log(err);
    });

    if (snapshot && snapshot.exists()) {

        const data: string[] = snapshot.val();
        const optData = disValidateNames(data);

        return optData;
    } else {
        return { error: 'no data found' }
    }
}

export const getSchNames = async (colName: string) => {

    colName = validatePropertyName(colName);

    const ref = 
        db.ref(`shopData/collections/colItems/${colName}/schemas/schNames`);

    const snapshot = await ref.once('value').catch(err => {
        console.log(err);
    });

    if (snapshot && snapshot.exists()) {

        const data: string[] = snapshot.val();
        const optData = disValidateNames(data);

        return optData;
    } else {
        return { error: 'no data found' }
    }
}

export const getColItems = async (colName: string, 
    lowerBound: string | undefined, limit: number) => {

    colName = validatePropertyName(colName);

    const ref = db.ref(`shopData/collections/colItems/${colName}/items`);
    let query;

    if (lowerBound) {
        lowerBound = validatePropertyName(lowerBound);

        query = ref.orderByKey().startAfter(lowerBound)
        .limitToFirst(limit);
    } else {
        query = ref.limitToFirst(limit);
    }

    const snapshot = await query.once('value').catch(err => {
        console.log(err);
    });

    if (snapshot && snapshot.exists()) {
        const items: shopItems = snapshot.val();
        const optItems: shopItems = disValidateMemoKeys(items);
        
        return optItems;
    } else {
        return { error: 'no data found' }
    }
}

export const getSchItems = async (colName: string, schName: string,
    lowerBound: string | undefined, limit: number) => {

    colName = validatePropertyName(colName);
    schName = validatePropertyName(schName);
    
    const ref = 
    db.ref(`shopData/collections/colItems/${colName}/schemas/schItems/${schName}`);
    let query;
    
    if (lowerBound) {
        lowerBound = validatePropertyName(lowerBound);

        query = ref.orderByKey().startAfter(lowerBound)
        .limitToFirst(limit);
    } else {
        query = ref.limitToFirst(limit);
    }

    const snapshot = await query.once('value').catch(err => {
        console.log(err);
    });

    if (snapshot && snapshot.exists()) {
        const items: shopItems = snapshot.val();
        const optItems: shopItems = disValidateMemoKeys(items);

        return optItems;
    } else {
        return { error: 'no data found' }
    }
}

export const getTemplates = async (memo: string | undefined, 
    ids: string[] | undefined) => {

    let ref;
    let queries: Reference[] = [];
    let res: any[] = []

    
    if (memo) {
        memo = validatePropertyName(memo);
        ref = db.ref(`templateData/${memo}`);

        queries.push(ref);
    } else if (ids) {
        ids = validateNames(ids);

        queries = ids.map(id => db.ref(`templateData/${id}`));
    }

    if (memo || ids) {
        await Promise.all(
            queries.map(query => query.once('value', snapshot => {
                if (snapshot.exists()) {
                    const item: templateItem = snapshot.val();
                    const optItem = disvalidateImmData(item);

                    res.push(optItem);
                } else {
                    res.push({ error: 'no data found' })
                }
            }, error => {
                res.push({ error: error.name })
            }))
        );
    }

    return res;
}

const uploadResizedMedia = async (resizedMedia: ResizedMedia, 
    name: string): Promise<Data> => {

    const res: Data = {
        data: '',
        error: ''
    }

    const storage = new Storage();

    if (resizedMedia.buffer) {

        await storage.bucket('cait-49fc0.appspot.com')
            .file(`resized/${name}`)
            .save(resizedMedia.buffer, {
                metadata: {
                    contentType: resizedMedia.mime
                }
            })
            .then(() => {
                res.data = 'file saved succesfully';
            }).catch((err: any) => {
                res.error = FILESAVEERROR
            })
    } else {

        res.error = 'no media to upload';
    }

    return res;
}

export const resizeMedia 
    = async (hash: string | undefined): Promise<Data> => {

    const res: Data = {
        data: '',
        error: ''
    }

    if (hash) {

        const resizedData: Data = await resize(hash);
    
        if (!resizedData.error && resizedData.data) {
    
            const resizedMedia: ResizedMedia = resizedData.data;
            const uploadRes: Data 
                = await uploadResizedMedia(resizedMedia, hash);
    
            if (!uploadRes.error && uploadRes.data) {
    
                res.data = 'file resized and saved successfully';
            } else {
    
                res.error = uploadRes.error
            }
        } else {
    
            res.error = resizedData.error;
        }
    } else {

        res.error = INVALIDHASH
    }
    
    return res;
}