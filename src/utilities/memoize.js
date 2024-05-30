export default fn => {
    const cache = {}
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache[key]) {
            console.log('accessed cache')
            return cache[key];
        }
        else {
            const result = fn.apply(this, args);
            cache[key] = result;
            return result;
        }
    }
}

