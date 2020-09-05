const FIELDS = {
    brandname: 'brandname',
    notes: 'notes',
    h: 'height',
    l: 'length',
    w: 'width',
    wgt: 'weight',
    upc: 'upc',
    asin: 'asin',
    epid: 'epid',
    walmart: 'walmart',
    isbn: 'isbn',
    isbn10: 'isbn10',
    isbn13: 'isbn13',
    model: 'model',
    mpn: 'mpn',
    color: 'color',
    size: 'size',
    author: 'author',
    publisher: 'publisher',
    artist: 'artist',
    studio: 'studio',
    actor: 'actor',
    director: 'director',
    releaseYear: 'releaseYear',
    ean: 'ean',
    pages: 'pages',
    time: 'run-time',
    children: 'children',
    type: 'type',
    gender: 'gender',
    age: 'age',
    neck: 'neck',
    chest: 'chest',
    bust: 'bust',
    waist: 'waist',
    inseam: 'inseam',
    sleeve: 'sleeve',
    shoe: 'shoe',
    head: 'head',
    shoulder: 'shoudler',
    hem: 'hem',
    length: 'long',
    capacity: 'capacity',
    duration: 'duration',
    rn: 'rn',
    wpl: 'wpl',
    itemNo: 'item-number',
    styleNo: 'style-number',
    title: 'title'
};
const colorBase = (prefix) => ({
    RD: [prefix, 'red'],
    OR: [prefix, 'orange'],
    YE: [prefix, 'yellow'],
    GR: [prefix, 'green'],
    BL: [prefix, 'blue'],
    VI: [prefix, 'purple'],
    BR: [prefix, 'brown'],
    WH: [prefix, 'white'],
    BK: [prefix, 'black'],
    PI: [prefix, 'pink'],
    TA: [prefix, 'tan'],
    LI: [prefix, 'lime'],
    AM: [prefix, 'amber'],
    AQ: [prefix, 'aqua'],
    GO: [prefix, 'gold'],
    CH: [prefix, 'charcoal'],
    GY: [prefix, 'grey'],
    BG: [prefix, 'blue-grey']
});
const createColor = {
    L: colorBase('light'),
    D: colorBase('dark'),
    M: colorBase('medium'),
    B: colorBase('bright'),
    N: colorBase('')
};
const compose = (f, g) => x => g(f(x));
const $$ = (...args) => args.reduce(compose, a => a);
const isUndefined = (x) => typeof x === 'undefined';
const isNotUndefined = (x) => !isUndefined(x);
const createDimension = (mOf, value, uom, qualifier = undefined) =>
    isNotUndefined(qualifier) ? [mOf, value, uom, qualifier] : [mOf, value, uom]
const createIdentifier = (validator, idOf, id) => [idOf, validator(id), id];

const waist = value => createDimension('waist', value, 'in')
const long = value => createDimension('long', value, 'in')
const chest = (value, qualify) => createDimension('chest', value, 'in', qualify);
const always = (x) => (y) => x;
class ItemBuilder {
    backing;
    current;
    currySet = (key) => (value) => this.set(key, value);
    set(key, value) {
        if (isNotUndefined(value)) {
            this.current[key] = value;
        }
        return this;
    }
    constructor() {
        this.defaultValue = () => ({
            measurements: [],
            identifiers: [],
            qty: 1
        })
        this.backing = [];
        this.current = this.defaultValue();
        this.brand = this.currySet(FIELDS.brandname);
        this.notes = this.currySet(FIELDS.notes);
        this.color = this.currySet(FIELDS.color);
        const measurements = [
            FIELDS.l,
            FIELDS.w,
            FIELDS.h,
            FIELDS.wgt,
            FIELDS.chest,
            FIELDS.neck,
            FIELDS.sleeve,
            FIELDS.inseam,
            FIELDS.waist,
            FIELDS.bust,
            FIELDS.long,
            FIELDS.head,
            FIELDS.hem,
            FIELDS.shoe,
            FIELDS.shoulder,
            FIELDS.capacity,
            FIELDS.duration
        ];
        const identifiers = [
            FIELDS.upc,
            FIELDS.ean,
            FIELDS.asin,
            FIELDS.epid,
            FIELDS.model,
            FIELDS.mpn,
            FIELDS.walmart,
            FIELDS.styleNo,
            FIELDS.itemNo,
            FIELDS.rn,
            FIELDS.wpl,
            FIELDS.isbn10,
            FIELDS.isbn13,
            FIELDS.isbn
        ];
    }
    qty(q) {
        this.current.qty = q;
        return this;
    }
    final() {
        this.backing.push(this.current);
        this.current = this.defaultValue();
        return this;
    }
    _ = this.final;
    $(notes, weight, brandname, barcode) {
        this.brand(brandname);
        this.notes(notes);
        this.set(FIELDS.wgt, createDimension('weight', weight, 'g'));
        if (isNotUndefined(barcode)) {
            this.upc(barcode);
        }
        return this;
    }
    $$(upc, model) {
        this.set(FIELDS.upc, createIdentifier('upc', upc));
        this.set(FIELDS.model, createIdentifier('model', model));
    }
    isbn(x) {
        if (x.length === 10) {
            this.set('isbn10', x);
        } else if (x.length === 13) {
            this.set('isbn13', x);
        } else {
            this.set(createIdentifier(always(false), x, 'isbn'));
        }
    }
    ofBook(title, weight, pages, isbn) {
        this.$(undefined, weight, undefined);
        this.set(FIELDS.title, title);
        this.set(FIELDS.pages, pages);
        return this.isbn(isbn);
    }
    gender(gender) {
        if (['M', 'F', 'U'].includes(gender)) {
            this.set(FIELDS.gender, gender);
        } else {
            throw new Error(`UNSUPPORTED GENDER VALUE: ${gender}`)
        }
    }
    addDimensions(...args) {
        this.current.measurements = [...this.current.measurements, ...args];
    }
    ofClothing(notes, weight, brandname, gender, type, ...sizes) {
        this.gender(gender);
        this.set(FIELDS.type, type);
        this.$(notes, weight, brandname);
        this.addDimensions(...sizes.map(([f, x]) => Array.isArray(x) ? f(...x) : f(x)));
        return this;
    }
    size(sizeOf, value, uom) {
        this.addDimensions(createDimension(sizeOf, value, uom))
        return this;
    }
    coo = this.currySet('origin');
    model = this.currySet('model');
    upc = this.currySet('upc');
    isbn = this.currySet('isbn');
    asin = this.currySet('asin');
    format = this.currySet('format');
    artist = this.currySet('artist');
    title = this.currySet('title');
    length = value => this.currySet('length')(this.addDimensions(createDimension('length', value, 'in')));
    music(title, artist) {
        this.title(title);
        this.artist(artist);
        return this.format('CD');
    }
    ofCD(title, artist, weight, upc) {
        return this.$(undefined, weight, 'unknown').upc(upc).music(title, artist);
    }
    defect(value) {
        this.current.defects = isUndefined(this.current.defects) ? [value] : [...this.current.defects, value]
        return this;
    }
    china = () => this.coo('CH');
    usa = () => this.coo('US');
}

const ib = new ItemBuilder();
console.log(ib);
ib.color(createColor.N.R);
console.log(ib);

ib.color(createColor.D.B)
console.log(ib);

ib.ofClothing('notes', 999, 'Jones New York', 'M', 'suit', [waist, 36], [long, 34], [chest, [44, 'R']])
    .final().$('notes', 100, 'board game').final();
console.log(JSON.stringify(ib.current, null, '\t'))
console.log(JSON.stringify(ib.backing, null, '\t'))

const log0905 = new ItemBuilder();
log0905.$('stuffed plush Dory', 126, 'Disney').upc('79246398484').model(36571).asin('B01B7P1DD4')._()
    .$('blackberry absinthe candle', 154, 'Illume').upc('644911959677')._()
    .$('ginger citron candle', 152, 'Illume').upc('644911983924')._()
    .$('100% soy wax candle', 68, 'Illume')._()
    .$('pineapple splash candle', 900, 'Illume').upc('747610451841')._()
    .$('pink desert twilight', 510, 'Illume').upc('64491197431')._()
    .$('candle in wooden holder', 818)._()
    .$('bathroom spray', 150, 'Poo-pourri').upc('8488580003896')._()
    .$('blackberry absinthe bar soap', 182, 'Narrative').upc('644911964183').qty(2)._()
    .$('Yahtzee', 596, 'Milton Bradley').upc('032244047343')._()
    .ofCD('Fueled by Anger', 'Reckless Abandon', 84, '736211347572').defect('cracked case')._()
    .$('vegan canvas wallet', 134, 'Bungalow 360').upc('84978101235').asin('B00HFZ0GK8').china()._()
    .$('photo paper glossy II', 220, 'Canon').upc('013803089417')._()
    .$('advanced photo paper', 364, 'Hewlett Packard', '829160743110')._()
    .$('chinese checkers', 754, 'Pavillion', '047754184006')._()
    .$('Happy Feet board game', 370, 'Happy Feet', '810655050578').china()._()
    .$('Photosmart A617', 1170, 'Hewlett Packard', '088278051642').china().defect('missing battery and does not hold power')._()
    .$('Christmas ornament', 126, 'Lenox', '882864052425').title('Skating Mickey').qty(2)._()
    .$('Christmas ornament', 94, 'Lenox', '882864281647').title('Tree w/ Presents')._()
    .$('dog wall art', 62, 'Retro Pets', 'Jack Russell Terrier: Patron Saint of Perpetual Motion')._()
    .ofBook('A Gift From Bob', 178, 0, '9781250104960')._()
    .$('dual usb wall charger', 66, 'Walmart', '810011410190')._()
    .$('dvd case', 436, 'Case Logic').model('050764001')._()
    .$('shower curtain', 110, 'Ambersomme').asin('B01BLQ482C').title('Yes You Can').coo('TU')._();
console.log(log0905.backing)