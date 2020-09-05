// decoratorsBeforeExport: true
const fs = require('fs')

function change(key, value) {
    return function change(target) {
        target.descriptor[key] = value;
        return target;
    }
}

const IDENTIFIERS = ['upc', 'ean', 'isbn10', 'isbn13', 'isbn', 'asin', 'epid', 'walmartid', 'model', 'mpn']

function array_append(value, arr) {
    return [...arr, value];
}

function getValueAtIndex(ix) {
    return arr => arr[ix];
}
const fst = getValueAtIndex(0);

function eq(left) {
    return (right) => right === left;
}

function compl(p) {
    return x => !p(x);
}

function uomOf(measure) {
    return Array.isArray(measure) ? measure[measure.length - 1] : undefined;
}

function $(left, right) {
    return x => right(left(x));
}
const dne = x => compl(eq(x));

const OUNCES_TO_POUNDS = 1 / 16
const POUNDS_TO_OUNCES = 1 / OUNCES_TO_POUNDS;
const GRAMS_TO_POUNDS = 0.002204;
const POUNDS_TO_GRAMS = 1 / GRAMS_TO_POUNDS;

const addISBN10 = (id) => i => i.withIdentifier('isbn10', id)
const addISBN13 = (id) => i => i.withIdentifier('isbn10', id)

const addISBN = (id) => i => id.length === 10 ? addISBN10(id)(i) : addISBN13(id)(i)

const withIdentifier = (name) => i => id => i.withIdentifier(name, id);
const Op = function ItemContainer(...args) {
    this.ITEM = new Item(...args);
    return this;
};

Op.prototype.isbn = withIdentifer('isbn');
Op.prototype.upc: withIdentifier('upc');
Op.prototype.model: withIdentifier('model');
Op.prototype.mpn: withIdentifier('mpn');
Op.prototype.asin: withIdentifier('asin');
Op.prototype.epid: withIdentifier('epid');
Op.prototype.walmart: withIdentifier('walmart');

const d = new Op();
d.isbn

Op.isbn['10'] = addISBN10;
Op.isbn['13'] = addISBN13;
class Item {
    dims = [];
    notes = undefined;
    constructor(notes, weight, weightUOM = 'g', ...args) {
        this.dims = [
            ['weight', weight, weightUOM]
        ]
        this.notes = notes;
        let accum = [...args];
        while (accum.length > 0) {
            const [key, value, ...rest] = accum;
            this[key] = value;
            accum = rest;
        }
    };
    weight = () => this.getDim('weight')[0].slice(1);
    height = () => this.getDim('height')[0].slice(1);
    getDims() {
        return "hello, world"
    }
    getDim(measureOf) {
        return this.hasDim(measureOf) ? this.dims.filter($(fst, eq(measureOf))) : [];
    }
    hasDim(measureOf) {
        return this.dims.map(fst).includes(measureOf)
    }

    replaceDim(measureOf, value, uom) {
        this.dims = [...this.dims.filter($(dne(measureOf), fst)), [measureOf, value, uom]];
        return this;
    }
    addDim(measureOf, value, uom) {
        if (this.hasDim(measureOf)) {
            console.log('overwriting current value');
            return this.replaceDim(measureOf, value, uom);
        }
        this.dims = array_append([measureOf, value, uom], this.dims);
        return this;
    }
    calculateWeightChange() {
        if (uomOf(this.weight()) === 'g') {
            return this.weight();
        } else if (uomOf(this.weight()) === 'lb') {
            return [this.weight()[0] * POUNDS_TO_GRAMS, 'g'];
        }
        return [(this.weight()[0] / POUNDS_TO_OUNCES) * POUNDS_TO_GRAMS, 'g']
    }
    convertWeight() {
        const result = this.calculateWeightChange();
        this.replaceDim('weight', ...result);
        return this;
    }
    addKVP(key) {
        return (value) => {
            if (IDENTIFIERS.includes(key)) {
                this.withIdentifier(key, value);
            }
            this[key] = value;
            return this;
        }
    }
    brand(b) {
        return this.addKVP('brandName')(b)
    }
    withIdentifier(kind, value) {
        this[kind] = value;
        this.identifiers = array_append([kind, value], this.identifiers ? this.identifiers : [])
        return this;
    }
}
Item.of = {
    book(title, weight) {
        return undefined;
    },
    pole(notes, weight, brand, name, qty) {
        return new Item(notes, weight, 'g', 'brandName', brand, 'pieces', qty);
    }
};

console.log(Item.constructor.of)

const i1 = new Item('n', 1, 'lb');
const i2 = i1;
const t1 = Item.of.pole('graphite rod', 900, 'Quick International', 'The Boss', 2);
console.log(i1)
console.log(i2)
console.log(i2.getDim('weight'))
console.log(i2.getDim('height'))
console.log(i2.replaceDim('weight', 100, 'g').getDim('weight'));
console.log(new Item('something here', 1000, 'oz').brand('Colgate'))
console.log(t1.withIdentifier('upc', '1234'));
const i = new Item('note', 1234).addDim('height', 200, 'in');
console.log(i);
console.log(i.weight());
console.log(i)
console.log(i.height());

console.log(new Item('', 19, 'oz').convertWeight());
console.log(new Item('', 5, 'lb').convertWeight());