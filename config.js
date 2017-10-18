const algoliasearch = require('algoliasearch');
const apiKey = require('./secrets.js').apiKey;
const appId = '5NICTDJ5Q3';
const client = algoliasearch(appId, apiKey);
const index = client.initIndex('instant_search');

// ---------------------
//
//  Helper Funcs
//
// ---------------------

const handleResponse = (err, content) => { err ? console.error(err) : console.log(content) };


// ---------------------
//
//  Synonyms
//
// ---------------------

const smartphoneSyn =
    {
        objectID: "smartphone-syn",
        type: "oneWaySynonym",
        input: "smartphone",
        synonyms: [
            "iphone"
        ]
    };

index.saveSynonym(smartphoneSyn, { forwardToReplicas: true }, handleResponse);


// ---------------------
//
//  Query Rules
//
// ---------------------

var rules = [
    {
        objectID: 'best-rule',
        condition: {
            pattern: 'best',
            anchoring: 'contains'
        },
        consequence: {
            params: {
                filters: 'rating >= 5',
                query: {
                    remove: ['best']
                }
            }
        },
        description: 'Remove the word best and filter for results w/ 5 stars'
    },
    {
        objectID: 'guitarhero-promotion',
        condition: {
            pattern: 'video game',
            anchoring: 'contains'
        },
        consequence: {
            promote: [
                { objectID: "9704115", "position": 0 },
                { objectID: "9706113", "position": 1 },
                { objectID: "9705114", "position": 2 }
            ]
        },
        description: 'Promote Guitar Hero games for "video games" query'
    },
    {
        objectID: 'free-shipping',
        condition: {
            pattern: 'free shipping',
            anchoring: 'contains'
        },
        consequence: {
            params: {
                filters: 'free-shipping:true',
                query: {
                    remove: ['free-shipping']
                }
            },
            userData: {
                free_ship_banner: "free_shipping_banner.jpg"
            }
        },
        description: 'Filter for free-shipping and display banner'
    },
    {
        objectID: 'brand-promotion',
        condition: {
            pattern: 'smartphone',
            anchoring: 'contains'
        },
        consequence: {
            userData: {
                samsung_banner: "samsung_note.jpg",
                apple_banner: "iphone.jpg"

            }
        },
        description: 'Display Apple and Samsung promotional banners'
    },
    {
        objectID: 'facet-test',
        condition: {
            pattern: '{facet:brand}',
            anchoring: 'contains'
        },
        consequence: {
            params: {
                query: {
                    remove: ['{facet:brand}']
                },
                automaticFacetFilters: ['brand']
            }
        },
        description: 'Automatic Facet Filter on Brands'
    }
];

index.batchRules(rules, { clearExistingRules: true, forwardToReplicas: true }, handleResponse);

