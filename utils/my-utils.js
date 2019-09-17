module.exports = {
    info(name, ...rest) {
        console.log(`[${new Date().toLocaleString()}][${name.toString()}]`, ...rest)
    }
}