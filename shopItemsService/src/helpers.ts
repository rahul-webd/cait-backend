import { JsonRpc } from 'eosjs';
import { rpcEndpoints, contracts, atomicEndpoints } from './data';
import fetch from 'node-fetch';
import { limitItem, limitItems, limitItemsObj, menuItem, menuItems, 
    menuItemsObj, shopItem, shopItems, templateItem, templateItems } from './schemas';

const shopContract = contracts.shopContract;
const shopContractName = shopContract.name;
const shopScope = shopContract.scopes.shop;
const menuTable = shopContract.tables.menu;
const limitsTable = shopContract.tables.limits;

const limit = 100;

const getRpcEndpoint = () => {
    const rand = Math.floor(Math.random() * rpcEndpoints.length);
    return `https://${rpcEndpoints[rand]}`;
}

const getTableRows = async (table: string, lowerBound: string) => {
    const rpcEndpoint = getRpcEndpoint();
    const rpc = new JsonRpc(rpcEndpoint, { fetch });

    try {
        const rows = await rpc.get_table_rows({
            json: true,
            code: shopContractName,
            scope: shopScope,
            table: table,
            lower_bound: lowerBound,
            limit: limit,
            reverse: false,
            show_payer: false
        });
        return rows;
    } catch (error) {
        console.log(error);
    }

    return false;
}

const sleep = () => new Promise(r => setTimeout(r, 2000));

const getShopMenuRows = async () => {
    let more: boolean = true;
    let lowerBound: string = '';
    let menuItems: Array<menuItem> = []

    while (more) {
        const menuRows: menuItems | boolean = await getTableRows(menuTable, lowerBound);

        if (menuRows) {

            menuItems = [ ...menuItems, ...menuRows.rows ]
            lowerBound = menuRows.next_key;
            more = menuRows.more;
        } else {
            await sleep();
        }
    }

    return menuItems;
}

const getShopLimitRows = async () => {
    let more: boolean = true;
    let lowerBound: string = '';
    let limitItems: Array<limitItem> = []

    while (more) {
        const limitRows: limitItems | boolean = await getTableRows(limitsTable, lowerBound);
        
        if (limitRows) {

            limitItems = [ ...limitItems, ...limitRows.rows ]
            lowerBound = limitRows.next_key;
            more = limitRows.more;
        } else {
            await sleep();
        }
    }
    
    return limitItems;
}

export const getShopItemsFromContract = async () => {
    const shopItems: shopItems = {}

    const menuItems = await getShopMenuRows();
    const limitItems = await getShopLimitRows();

    const menuItemsObj: menuItemsObj = 
    menuItems.reduce((prev: menuItemsObj, cur: menuItem) => {
        return {
            ...prev,
            [validatePropertyName(cur.Memo)]: cur
        }
    }, {});

    const limitItemsObj: limitItemsObj = 
    limitItems.reduce((prev: limitItemsObj, cur: limitItem) => {
        return {
            ...prev,
            [validatePropertyName(cur.Memo)]: cur
        }
    }, {});

    for (const memo in menuItemsObj) {
        const shopItem: shopItem = {
            item: {},
            limits: {}
        }

        const menuItem = menuItemsObj[memo];
        shopItem.item = menuItem;

        if (limitItemsObj.hasOwnProperty(menuItem.Memo)) {
            const limitItem = limitItemsObj[memo];
            shopItem.limits = limitItem;
        }

        shopItems[validatePropertyName(memo)] = shopItem;
    }

    return shopItems;
}

export const createTemplateObj = async () => {
    const shopItems = await getShopItemsFromContract();
    const templateItems: templateItems = {};

    for (const memo in shopItems) {
        const si: any = shopItems[memo].item
        templateItems[memo] = {
            Memo: si.Memo,
            TemplateId: si.TemplateId,
            TemplateData: {}
        }
    }

    const ti = addTemplateData(templateItems);
    return ti;
}

const addTemplateData = async (templateItems: templateItems) => {
    const templateItemValues = Object.values(templateItems);

    const ids: Array<number> = templateItemValues.map((si: any) => {
        if (si && Object.keys(si).length !== 0) {
            return si.TemplateId;
        }
    });

    const completeBatch: Array<number> = [ ...ids ];

    const limit = 100;

    while (completeBatch.length !== 0) {
        const batch: Array<number> = completeBatch.slice(0, limit);

        const templates: Array<any> = await getTemplateData(batch, limit);

        if (templates) {
            for (const t of templates) {
                const id = Number(t.template_id);
                const idIndex = ids.indexOf(id);
                const idMemo: string = 
                validatePropertyName(templateItemValues[idIndex].Memo);
                console.log(idMemo);
                const templateItem: templateItem = templateItems[idMemo];
                let immData: any = t.immutable_data;
                const validImmData: any = {}

                // validating user added immutable data keys

                for (const key in immData) {
                    const validKey = validatePropertyName(key);
                    validImmData[validKey] = immData[key];
                }

                t.immutable_data = validImmData;

                templateItem.TemplateData = t;
            }
            completeBatch.splice(0, limit);
        }
    }
    return templateItems;
}

const getTemplateData = async (templateIds: Array<number>, 
    limit: number) => {
    const ae = getAtomicEndpoint();

    const seperator: string = '%2C';
    const ids: string = templateIds.join(seperator);
    
    const res = 
    await fetch(`${ae}/templates?ids=${ids}&page=1&limit=${limit}&order=desc&sort=created`)
        .then(resp => resp && resp.json())
        .then(res => res && res.data)
        .catch(error => console.log(error));

    return res;
}

const getAtomicEndpoint = () => {
    const rand = Math.floor(Math.random() * atomicEndpoints.length);
    return `https://${atomicEndpoints[rand]}/atomicassets/v1`;
}

export const validatePropertyName = (propertyName: string): string => {

    return propertyName
        .replace(/\./g, '%2P')
        .replace(/\$/g, '%2D')
        .replace(/#/g, '%2H')
        .replace(/\[/g, '%2O')
        .replace(/\]/g, '%2C')
        .replace(/\//g, '%2S');
}