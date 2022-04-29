export const rpcEndpoints: Array<string> = [
    `wax.greymass.com`,
    `api.wax.alohaeos.com`,
    `wax.eu.eosamsterdam.net`,
    `wax.blacklusion.io`,
    `wax.blokcrafters.io`,
    `api-wax-mainnet.wecan.dev`,
    `wax.cryptolions.io`,
    `api-wax.eosarabia.net`,
    `wax.eosdublin.io`,
    `wax.eoseoul.io`,
    `wax.eosphere.io`,
    `wax-public1.neftyblocks.com`,
    `wax.api.eosnation.io`,
    `api.waxsweden.org`
]

export const atomicEndpoints: Array<String> = [
    `wax.api.atomicassets.io`,
    `wax-aa.eu.eosamsterdam.net`,
    `aa.wax.blacklusion.io`,
    `api.wax-aa.bountyblok.io`,
    `atomic-wax-mainnet.wecan.dev`,
    `aa.dapplica.io`,
    `wax-atomic-api.eosphere.io`,
    `atomic.wax.eosrio.io`,
    `aa-wax-public1.neftyblocks.com`,
    `wax.hkeos.com/aa`,
    `atomic.ledgerwise.io`,
    `atomic.tokengamer.io`,
]

export const contracts = {
    shopContract: {
        name: 'shop.cait',
        scopes: {
            shop: 'shop.cait'
        },
        tables: {
            menu: 'menu',
            limits: 'limits'
        }
    }
}
