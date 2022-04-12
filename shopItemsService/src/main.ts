import { getShopItemsFromContract, validatePropertyName } from "./helpers";
import { collections, schemas, shopData, shopItem } from "./schemas";
import * as admin from 'firebase-admin';
import "dotenv/config";

import * as serviceAccount from '../key.json';

const sa: any = serviceAccount;

admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: 'https://cait-49fc0-default-rtdb.firebaseio.com'
})

const filterShopItems = async () => {
    const shopItems = await getShopItemsFromContract();
    const collections: collections = {
        colNames: [],
        colItems: {}
    }
    
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

        const vcn = validatePropertyName(cn);

        collections.colItems[vcn] = {
            schemas: {
                schNames: [],
                schItems: {}
            },
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

        const schemas: schemas = {
            schNames: [],
            schItems: {}
        }

        for (const sn of schemaNames) {

            const vsn: string = validatePropertyName(sn);
            const schemaItems: Array<shopItem> = 
            collectionItems.filter(shopItem => {

                if (Object.keys(shopItem.item).length !== 0) {
                    const si: any = shopItem.item;

                    return si.SchemaName === sn;
                }

                return false;
            });

            schemas.schNames.push(vsn);
            schemas.schItems[vsn] = schemaItems;
        }

        collections.colNames.push(vcn);
        collections.colItems[vcn].schemas = schemas;
        collections.colItems[vcn].items = collectionItems;
    }

    return { 
        collections: collections,
        items: shopItems
    }
}

export const setShopitems = async () => {

    const shopData: shopData = await filterShopItems();
    const ref = admin.database().ref('shopData');

    await ref.update(shopData, error => {
        if (error) {
            console.log(error);
        } else {
            console.log('data successfully updated');
        }
    })
}
// Add timestamp for new items - will help in doing a check for latest items