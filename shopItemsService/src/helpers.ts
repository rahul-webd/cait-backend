import { Api, JsonRpc, RpcError } from 'eosjs';
import { rpcEndpoints, contracts } from './data';
import fetch from 'node-fetch';
import { limitItem, limitItems, limitItemsObj, menuItem, menuItems, menuItemsObj, shopItem, shopItems } from './schemas';

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
            [cur.Memo]: cur
        }
    }, {});

    const limitItemsObj: limitItemsObj = 
    limitItems.reduce((prev: limitItemsObj, cur: limitItem) => {
        return {
            ...prev,
            [cur.Memo]: cur
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

        shopItems[memo] = shopItem;
    }

    return shopItems;
}