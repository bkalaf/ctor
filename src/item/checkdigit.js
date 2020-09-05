function padLeft(padChar, count, text) {
    if (text.length > count) { return text }

    const intermediate = padLeft(padChar, count, [padChar, text].join(''));
    // console.log(intermediate);
    return intermediate;
}

function checkDigitMultiplier(value) {
    if (value === 16) {
        return 0;
    } else if (value % 2 === 0) {
        return 1;
    }
    return 3;
}

function validCheckDigit(text) {
    if ((text || '').length === 0) {
        return ['FAILURE', new Error(`INSUFFICIENT TEXT LENGTH: ${text || 'undefined'}`)];
    }
    const paddedText = padLeft('0', 16, text).split('');
    // console.log(paddedText)
    const subValue =
        paddedText
        .map((c, ix) => {
            // console.log(`c: ${c} ix: ${ix} checkDigitMulti: ${checkDigitMultiplier(ix)} parseInt: ${parseInt(c, 10)}`);
            return checkDigitMultiplier(ix) * parseInt(c, 10)
        })
        .reduce((pv, cv) => pv + cv, 0) % 10;
    const calculated = subValue === 10 ? 0 : 10 - subValue;
    const entered = parseInt(paddedText.reverse()[0]);
    return calculated === entered ? ['SUCCESS', text] : ['FAILURE', new Error(`CHECK DIGIT VALIDATION FAIL: Expected: ${calculated} Received: ${entered} for upc: ${text}.`)]
};

module.exports = {
    validCheckDigit
}