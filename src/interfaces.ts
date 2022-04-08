interface emptyObject {}

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
    AffiliateFraction: string
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
    item: menuItem | emptyObject,
    limits: limitItem | emptyObject
}

export interface shopItems {
    [memo: string]: shopItem
}