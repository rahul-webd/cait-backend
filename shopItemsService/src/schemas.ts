interface menuItemPrice {
    quantity: string,
    contract: string
}

export interface menuItem {
    Memo: string,
    CollectionName: string,
    SchemaName: string,
    TemplateId: number,
    Price: menuItemPrice,
    ProfitTo: string,
    AffiliateFraction: string,
}

export interface menuItems {
    rows: Array<menuItem>,
    more: boolean,
    next_key: string
}

export interface menuItemsObj {
    [memo: string]: menuItem
}

export interface limitItem {
    Memo: string,
    StartTimeOn: number,
    StartTime: string,
    StopTimeOn: number,
    StopTime: string,
    MaxToSellOn: number,
    MaxToSell: number,
    LeftToSell: number,
    MaxPerAccountOn: number,
    MaxPerAccount: number,
    MaxPerPurchaseOn: number,
    MaxPerPurchase: number,
    SecondsBetweenOn: number,
    SecondsBetween: number
}

export interface limitItems {
    rows: Array<limitItem>,
    more: boolean,
    next_key: string
}

export interface limitItemsObj {
    [memo: string]: limitItem
}

export interface shopItem {
    item: menuItem | undefined,
    limits: limitItem | undefined,
}

export interface shopItems {
    [memo: string]: shopItem
}

interface schItems {
    [name: string]: Array<shopItem>
}

export interface schemas {
    schNames: Array<string>,
    schItems: schItems
}

interface colItem {
    schemas: schemas,
    items: Array<shopItem>
}

interface colItems {
    [collectionName: string]: colItem
}

export interface collections {
    colNames: Array<string>,
    colItems: colItems
}

export interface shopData {
    collections: collections,
    items: shopItems
}

export interface templateItem {
    Memo: string,
    TemplateId: string,
    TemplateData: any
}

export interface templateItems {
    [memo: string]: templateItem
}