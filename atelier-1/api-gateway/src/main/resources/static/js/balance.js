function formatBalance(number) {
    if (typeof number !== 'number') {
        throw new TypeError('Le paramètre doit être un nombre');
    }

    let formattedNumber = number.toFixed(2);
    formattedNumber = formattedNumber.replace('.', ',');

    return formattedNumber;
}

export { formatBalance };
