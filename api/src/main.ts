import * as admin from 'firebase-admin';
import * as serviceKey from '../key.json';
import { disValidatePropName } from './helpers';

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

    const res = await query.get().then(snapshot => {
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

export const getItem = async (name: string) => {
    const ref = db.ref(`shopData/items/${name}`);

    const res = await ref.get().then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });


    console.log(res);
    return res;
}

export const getColNames = async () => {
    const ref = db.ref(`shopData/collections/colNames`);

    const res = await ref.get().then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val();
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

    const res = await ref.get().then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val();
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

    const res = await query.get().then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val();
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

    const res = await query.get().then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return { error: 'no data found' }
        }
    }, error => {
        return { error }
    });

    console.log(res);
    return res;
}