import { templateItem } from "./schemas";

export const validatePropertyName = (propertyName: string): string => {

    return propertyName
        .replace(/\./g, '%2P')
        .replace(/\$/g, '%2D')
        .replace(/#/g, '%2H')
        .replace(/\[/g, '%2O')
        .replace(/\]/g, '%2C')
        .replace(/\//g, '%2S');
}

export const disValidatePropertyName = 
    (propertyName: string): string => {

    return propertyName
        .replace(/%2P/g, '.')
        .replace(/%2D/g, '$')
        .replace(/%2H/g, '#')
        .replace(/%2O/g, '[')
        .replace(/%2C/g, ']')
        .replace(/%2S/g, '/');
}

export const disValidateMemoKeys = (items: any) => {

    const optItems: any = {}

    for (const memo in items) {
        const m = disValidatePropertyName(memo);
        optItems[m] = items[m]
    }

    return optItems;
}

export const validateNames = (items: string[]) => {
    const optItems = items.map(item => validatePropertyName(item));

    return optItems;
}

export const disValidateNames = (items: string[]) => {
    const optItems = items.map(item => disValidatePropertyName(item));
    console.log(optItems);

    return optItems;
}

export const disvalidateImmData = (item: templateItem) => {
    const td: any = item.TemplateData;
    
    const immData: any = td.immutable_data;
    const optImmData: any = {}

    for (const key in immData) {
        const k = disValidatePropertyName(key);
        optImmData[k] = immData[key]
    }

    td.immutable_data = optImmData;

    return item;
}