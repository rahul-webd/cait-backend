export const disValidatePropName = (prop: string) => {
    let dvpn: string = prop;
    if (prop.includes('_')) {
        dvpn = prop.replace(/_/g, '.');
    }
    return dvpn;
}