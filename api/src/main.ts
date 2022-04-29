import { Reference } from '@firebase/database-types';
import * as admin from 'firebase-admin';
import * as serviceKey from '../key.json';
import { disValidateNames, disValidatePropertyName, disValidateMemoKeys, disvalidateImmData } from './helpers';
import { shopItem, shopItems, templateItems } from './schemas';

const sk: any = serviceKey;

admin.initializeApp({
    credential: admin.credential.cert(sk),
    databaseURL: 'https://cait-49fc0-default-rtdb.firebaseio.com'
})
const db = admin.database();

export const getItems = async (lowerBound: string, limit: number) => {
    const ref = db.ref('shopData/items');
    let query;

    if (lowerBound) {
        query = ref.orderByKey().startAfter(lowerBound).limitToFirst(limit);
    } else {
        query = ref.limitToFirst(limit);
    }

    const res = await query.once('value', snapshot => {
        if (snapshot.exists()) {
            let data: shopItems = snapshot.val();
            const optItems: shopItems = disValidateMemoKeys(data);

            return optItems;
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    return res;
}

export const getItem = async (name: string) => {
    const ref = db.ref(`shopData/items/${name}`);

    const res = await ref.once('value', snapshot => {
        if (snapshot.exists()) {

            return snapshot.val();
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    return res;
}

export const getColNames = async () => {
    const ref = db.ref(`shopData/collections/colNames`);

    const res = await ref.once('value', snapshot => {
        if (snapshot.exists()) {

            const data: string[] = snapshot.val();
            const optData = disValidateNames(data);

            return optData;
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    console.log(res);
    return res;
}

export const getSchNames = async (colName: string) => {
    const ref = 
    db.ref(`shopData/collections/colItems/${colName}/schemas/schNames`);

    const res = await ref.once('value', snapshot => {
        if (snapshot.exists()) {

            const data: string[] = snapshot.val();
            const optData = disValidateNames(data);

            return optData;
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    console.log(res);
    return res;
}

export const getColItems = async (colName: string, lowerBound: string | boolean,
    limit: number) => {
    const ref = db.ref(`shopData/collections/colItems/${colName}/items`);
    let query;

    if (lowerBound) {
        query = ref.orderByKey().startAfter(lowerBound)
        .limitToFirst(limit);
    } else {
        query = ref.limitToFirst(limit);
    }

    const res = await query.once('value', snapshot => {
        if (snapshot.exists()) {
            const items: shopItems = snapshot.val();
            const optItems: shopItems = disValidateMemoKeys(items);

            return optItems;
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    console.log(res);
    return res;
}

export const getSchItems = async (colName: string, schName: string,
    lowerBound: string | boolean, limit: number) => {
    const ref = 
    db.ref(`shopData/collections/colItems/${colName}/schemas/schItems/${schName}`);
    let query;

    if (lowerBound) {
        query = ref.orderByKey().startAfter(lowerBound)
        .limitToFirst(limit);
    } else {
        query = ref.limitToFirst(limit);
    }

    const res = await query.once('value', snapshot => {
        if (snapshot.exists()) {
            const items: shopItems = snapshot.val();
            const optItems: shopItems = disValidateMemoKeys(items);

            return optItems;
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    console.log(res);
    return res;
}

export const getTemplates = async (memo: string | undefined, 
    ids: string[] | undefined) => {
    let ref;
    let queries: Reference[] = [];
    let res: any[] = []
    if (memo) {
        ref = db.ref(`templateData/${memo}`);
        queries.push(ref);
    } else if (ids) {
        queries = ids.map(id => db.ref(`templateData/${id}`));
    }

    if (memo || ids) {
        await Promise.all(
            queries.map(query => query.once('value', snapshot => {
                if (snapshot.exists()) {
                    const items: templateItems = snapshot.val();
                    let optItems: templateItems = 
                        disValidateMemoKeys(items);

                    optItems = disvalidateImmData(optItems);

                    res.push(optItems);
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