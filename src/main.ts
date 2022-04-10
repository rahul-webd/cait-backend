import { getShopItemsFromContract } from "./helpers";
import { collections, schemas, shopData, shopItem } from "./schemas";
import * as admin from 'firebase-admin';
import "dotenv/config";

import * as serviceAccount from './caitServiceAccountKey.json';

const sa: any = serviceAccount;

admin.initializeApp({
    credential: admin.credential.cert(sa)
})

const filterShopItems = async () => {
    const shopItems = await getShopItemsFromContract();
    const collections: collections = {}
    
    const ShopItemValues = Object.values(shopItems);
    const collectionNames: Array<string> = 
    ShopItemValues.reduce((prev: Array<string>, cur: shopItem) => {
        
        if (Object.keys(cur.item).length !== 0) {
            const ci: any = cur.item;   //FIXME types
            const cn: string = ci.CollectionName

            if (!prev.includes(cn)) {

                return [ ...prev, cn ]
            }
        }
        return prev;
    }, []);

    for (const cn of collectionNames) {

        collections[cn] = {
            schemas: {},
            items: []
        }

        const collectionItems: Array<shopItem> = 
        ShopItemValues.filter((shopItem: shopItem) => {

            if (Object.keys(shopItem.item).length !== 0) {
                const si: any = shopItem.item;

                return si.CollectionName === cn;
            }
            return false;
        });

        const schemaNames: Array<string> = 
        collectionItems.reduce((prev: Array<string>, cur: shopItem) => {
            
            if (Object.keys(cur).length !== 0) {
                const ci: any = cur.item;
                const sn: string = ci.SchemaName;

                if (!prev.includes(sn)) {

                    return [ ...prev, sn ]
                }
            }
            return prev;
        }, []);

        const schemas: schemas = {}

        for (const sn of schemaNames) {

            const schemaItems: Array<shopItem> = 
            collectionItems.filter(shopItem => {

                if (Object.keys(shopItem.item).length !== 0) {
                    const si: any = shopItem.item;

                    return si.SchemaName === sn;
                }

                return false;
            });

            schemas[sn] = schemaItems;
        }

        collections[cn].schemas = schemas;
        collections[cn].items = collectionItems;
    }

    return { 
        collections: collections,
        items: shopItems
    }
}

export const setShopitems = async () => {

    const shopData: shopData = await filterShopItems();
    console.log(Object.keys(shopData.collections).length);

    const store = admin.firestore();
    const collectionName = 'shopData';

    await store.collection(collectionName).doc('collections')
        .set(shopData.collections, { merge: true })
        .then(val => {
            console.log(val);
        }, error => {
            console.log(error);
        });

    await store.collection(collectionName).doc('items')
        .set(shopData.items, { merge: true })
        .then(val => {
            console.log(val);
        }, error => {
            console.log(error);
        });
}
// Add timestamp for new items - will help in doing a check for latest items