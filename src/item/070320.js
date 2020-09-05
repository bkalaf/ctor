const fs = require('fs');

const dim = (measureOf, value, uom) => [measureOf, value, uom];
const weight = (value) => dim('weight', value, 'g');
const chest = (value, qualify) => dim('chest', value, qualify);
const waist = (value) => dim('waist', value, 'in');
const length = (value) => dim('length', value, 'in');
const isEvenLen = x => x.length % 2 === 0;
const isOddLen = x => x.length % 2 === 1;
const isEmpty = x => x.length === 0;
const dims = (...args) => isOddLen(args) ? oddDims(...args) : evenDims(...args)
const oddDims = (mOf, value, qualify, ...rest) => isEmpty(rest) ? [mOf, value, qualify] : [...dims(...rest), [mOf, value, qualify]];
const evenDims = (mOf, value, ...rest) => isEmpty(rest) ? [mOf(value)] : [mOf(value), ...dims(...rest)]
const neck = (value) => dim('neck', value, 'in');
const sleeve = (val1, val2) => dim('sleeve', `${val1}/${val2}`, 'in');
const fittedShirt = (n, s1, s2, sh) => [neck(n), sleeve(s1, s2), dim('shirt', sh, '')];
const singleFabric = (material, percent) => ({
    [material]: percent
})
const fabric = (material, percent, ...rest) => rest.length > 0 ? {...fabric(...rest), ...singleFabric(material, percent) } :
    singleFabric(material, percent);
const clean = (action, qualify, ...rest) => rest.length > 0 ? {
    ...clean(...rest),
    ... {
        [action]: [true, qualify]
    }
} : {
    [action]: [true, qualify]
};

const data = {
    items: [{
            manufacturer: 'UCP International Co, Ltd',
            notes: 'Halloween cat table decoration',
            upc: '014433488290300',
            brandname: 'Wal-Mart'
        },
        {
            notes: 'yard sign for Halloween',
            msrp: 9.99,
            upc: '011822943857',
            measurements: [
                ['weight', 688, 'g']
            ]

        },
        {
            notes: 'Spooky Scarecrow Halloween painting',
            bullets: [
                'Haunted scarecrow with syncronized lights and sound',
                'Painted on canvas',
                'Frame has rounded edges to prevent creasing',
                'Dimensions: 14 x 10'
            ],
            battery: [3, 'AA'],
            length: [14, 'in'],
            width: [14, 'in'],
            weight: [832, 'g'],
            brandname: 'Giggles',
            msrp: 14.99
        },
        {
            brandname: 'The Newport Co',
            manufacturer: '',
            material: {
                wool: 100
            },
            woolmark: '1002085W',
            members: [
                [
                    'pants',
                    {
                        dims: {
                            weight: [420, 'g'],
                            waist: [36, 'in'],
                            length: [32, 'in']
                        }
                    }
                ],
                [
                    'jacket',
                    {
                        dims: {
                            chest: [44, 'in', 'R'],
                            weight: [734, 'g']
                        }
                    }
                ]
            ]
        },
        {
            notes: 'Come sit for a spell Halloween witch',
            upc: '886946928383',
            origin: 'CH',
            msrp: 9.99,
            weight: [322, 'g'],
            brandname: 'CELEBRATE IT',
            height: [7, 'in']
        },
        {
            notes: 'halloween bear decorations',
            upc: '739277554854',
            weight: [230, 'g']
        },
        {
            notes: 'mummy is watching you Halloween decoration',
            brandname: 'CELEBRATE IT',
            upc: '886946928383',
            msrp: 12.99,
            weight: [334, 'g'],
            origin: 'CH',
            height: [7, 'in']
        },
        {
            notes: 'chinese checkers',
            weight: [789, 'g'],
            upc: '0447754184006',
            players: { min: 2, max: 6 },
        },
        {
            title: 'Yahtzee',
            weight: [596, 'g'],
            upc: '032244047343',
            players: { min: 1, max: 6 },
            ageRange: { min: 8 }
        },
        {
            manufacturer: 'CANALI',
            brandname: 'Bernini',
            care: {
                'dry-clean': [true, 'only']
            },
            material: {
                wool: 100
            },
            weight: [800, 'g'],
            doubleBreasted: true,
            identifiers: [
                ['wpl', 1249246]
            ],
            color: 'charcoal'
        },
        {
            brandname: 'Van Heusen',
            kind: 'fitted-shirt',
            color: 'dark gold',
            care: {
                tumble: [true, 'perm-press'],
                iron: [true, 'medium'],
                bleach: false,
                wash: ['warm', 'gentle']
            },
            weight: [298, 'g'],
            measurements: fittedShirt(16.5, 34, 35, 'L'),
            origin: 'KR',
            material: { polyester: 100 }
        },
        {
            color: 'black',
            care: {
                'dry-clean': [true, 'only']
            },
            brandname: 'May Company, California',
            manufacturer: 'Nino Cerruti',
            origin: 'US',
            members: [
                ['jacket', { weight: [781, 'g'], chest: [44, 'R'] }],
                [
                    'pants',
                    {
                        weight: [364, 'g'],
                        waist: [36, 'in'],
                        length: [32, 'in']
                    }
                ]
            ]
        },
        {
            brandname: 'Sartini Uomo',
            origin: 'IT',
            care: { 'dry-clean': [true, 'only'] },
            material: {
                wool: 100
            },
            color: 'dark brown',
            members: [
                ['jacket', { chest: [40, 'L'], weight: [670, 'g'] }],
                ['pants', { weight: [436, 'g'] }]
            ]
        },
        {
            brandname: 'Bill Blass Menswear',
            care: {
                'dry-clean': [true, 'only']
            },
            material: {
                wool: 100
            },
            members: [
                ['jacket', { weight: [860, 'g'], jacket: [46, 'in', 'R'] }],
                ['pants', { weight: [460, 'g'], waist: [36, 'in'], length: [34, 'in'] }]
            ]
        },

        {
            brandname: 'Jones New York',
            material: {
                wool: 100
            },
            identifiers: [
                ['numbered', 476]
            ],
            members: [
                [
                    'jacket',
                    {
                        weight: [806, 'g'],
                        chest: [46, 'in', 'L']
                    }
                ],
                ['pants', { weight: [442, 'g'], waist: [34, 'in'], length: [32, 'in'] }]
            ]
        },
        {
            brandname: "Joseph & Feiss International",
            measurements: [
                dims(waist, 32, length, 36, weight, 438)
            ],
            type: 'pants'
        },
        {
            brandname: 'Enrico Corsini',
            type: 'jacket',
            identifiers: [
                ['CA', 38774]
            ],
            materials: fabric('polyester', 50, 'modal', 50),
            origin: 'CA',
            measurements: chest(44, 'R'),
            care: clean('dry-clean', 'only')
        },
        {
            brandname: 'Lanificio d\'ASndorrio',
            origin: 'IT',
            members: [
                ['pants', { measurements: dims(waist, 36, length, 32) }],
                ['jacket', { measurements: chest(44, 'R') }]
            ],
            material: fabric('wool', 100),
            notes: 'drop 6',
            color: 'light gray'
        },
        {
            brandname: 'ERNENEGILDO ZEGNA',
            manufacturer: 'KILGORE TROUT',
            origin: 'IT',
            material: fabric('wool', 50, 'silk', 50),
            care: clean('dry-clean', 'only'),
            notes: 'capio bembes, 100%',
            members: [
                ['jacket', { measurements: chest(44, 'R') }],
                ['pants', { measurements: dims(waist, 36, length, 32) }]
            ]

        },
        {
            brandname: 'DOCKERS',
            measurements: dims(weight, 446, waist, 36, length, 34),
            origin: 'DR',
            material: fabric('polyester', 100),
            identifiers: [
                ['wpl', 'WPL423'],
                ['style', '405242953']
            ],
            care: {
                wash: 'cold',
                bleach: 'non-cl',
                dry: 'tumble',
                iron: 'cool'
            }
        },
        {
            brandname: 'Phillipe Gabriel',
            care: clean('dry-clean', 'only'),
            measurements: dims('chest', 44, 'R', weight, 830)
        },
        {
            brandname: 'DOCKERS',
            measurements: dims(weight, 600, waist, 36, length, 34),
            origin: 'DR',
            material: fabric('cotton', 100),
            identifiers: [
                ['woolmark', '833H-WPL423'],
                ['model', 'DKR21']
            ],
            care: {
                wash: 'warm',
                bleach: 'non-cl',
                dry: ['tumble', 'warm'],
                iron: true
            }
        }
    ]
};

function _moveWeightToMeasurements(item) {
    if ('weight' in item) {
        const value = item['weight'];
        delete item.weight;
        const arr = ('measurements' in item) ? item.measurements : [];
        item.measurements = [...arr, value];
    }

    return item;
}
const identity = x => x;

function moveProp(toMove, destination, xformFunc = identity) {
    return function(item) {
        if (toMove in item) {
            const value = item[toMove];
            delete item.weight;
            const arr = (destination in item) ? item[destination] : [];
            item[destination] = [...arr, xformFunc(value, toMove)];
        }

        return item;
    }
}
const toTuple = (value, key) => [key, value];
const moveWeightToMeasurements = moveProp('weight', 'measurements');
const moveHeightToMeasurements = moveProp('height', 'measurements')
const moveLengthToMeasurements = moveProp('length', 'measurements');
const moveWidthToMeasurements = moveProp('width', 'measurements');
const moveUPCToIdentifiers = moveProp('upc', 'identifiers', toTuple)
const moveMSRPToPrice = moveProp('msrp', 'price', toTuple);
const result = data.items.map(moveWeightToMeasurements);
console.log(waist(32));
console.log(dims(waist, 32, length, 36))
console.log(fabric('polyester', 50, 'modal', 50))
console.log(clean('dry-clean', 'only'))
console.log(dims('chest', 44, 'R'))
console.log(dims('chest', 44, 'R', weight, 238))
console.log(chest(44, 'R'))

console.log(JSON.stringify(data, null, '\t'))

function composeOnce(f, g) {
    return x => g(f(x))
}

function compose(...args) {
    return args.reduce(composeOnce, identity);
}
const combined = compose(moveWeightToMeasurements, moveMSRPToPrice, moveHeightToMeasurements, moveWidthToMeasurements,
    moveLengthToMeasurements, moveUPCToIdentifiers);

console.log(JSON.stringify({ items: data.items.map(combined) }, null, '\t'));

// fs.writeFileSync('070320-2.json', JSON.stringify({ items: data.items.map(combined) }, null, '\t'))