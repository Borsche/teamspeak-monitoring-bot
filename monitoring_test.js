const isPortReachable = require('is-port-reachable');

checkPort(25420, "85.214.231.163").then(isReachable => {
    console.log("Is port reachable? ", isReachable);
})

checkPort(10011, "ts.syrucx.net").then(isReachable => {
    console.log("Is port reachable? ", isReachable);
})

async function checkPort(port, host) {
    return await isPortReachable(port, { host: host });
}