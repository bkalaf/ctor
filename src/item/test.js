const cd = require('./checkdigit');
[
    '139277554854',
    '239277554854',
    '339277554854',
    '439277554854',
    '539277554854',
    '639277554854',
    '739277554854',
    '839277554854',
    '939277554854',
    '039277554854'
].map(upc => console.log(cd.validCheckDigit(upc)))