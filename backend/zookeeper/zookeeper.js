const zookeeper = require('node-zookeeper-client');

const zkClient = zookeeper.createClient('localhost:2181');

let range = {
    start: 0,
    cur: 0,
    end: 0,
}

const base62encoding = (cur) => {
    hash = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    hash_str = ''

    while (cur > 0) {
        hash_str += hash[cur % 62]
        cur = Math.floor(cur / 62)
    }

    return hash_str
}

const setTokenRange = async (start)=>{
    
    const data = Buffer.from(String(start), 'utf8');
    zkClient.setData('/token', data, (err) => {
        if (err) {
            console.log(err.stack)
            return
        }
        console.log('Available Range Updated')
    })
}

const getTokenRange = async ()=>{
    zkClient.getData('/token',(err,data)=>{
        if (err){
            console.log(err.stack);
            return;
        }
        // Getting the latest znode value (/token) and slide the range to next 1 million 
        range.start = parseInt(data.toString()) + 1000000;
        range.cur = parseInt(data.toString()) + 1000000;
        range.end = parseInt(data.toString()) + 2000000;
        console.log(`Next Range: ${range.start}-${range.end}`);
        setTokenRange(range.start);
    })
}

const createToken = async () => {

    let buffer = Buffer.from('0', 'utf8')

    zkClient.create('/token', buffer, zookeeper.CreateMode.PERSISTENT, (err, path) => {
        if (err) {
            console.log(err.stack);
            return;
        }
        console.log('Node: %s is created.', path);

    })

}

const checkIfTokenExists = async () => {
    zkClient.exists('/token', (err, stat) => {
        if (err) {
            console.log(err.stack)
            return
        }

        if (stat) {
            console.log('ZNode exists');
            console.log('Getting Next Range...');
        } else {
            console.log('Creating ZNode exists');
            createToken()
        }
    })

}

const removeToken = async () => {
    zkClient.remove('/token', (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Node is deleted.')
    })
}

const connectZK = async () => {
    zkClient.once('connected', async () => {
        const state = zkClient.getState();
        console.log('Current state is: %s', state);
        const id = zkClient.getSessionId();
        console.log('Session id is: %s', id.toString('hex'));
        checkIfTokenExists();
        getTokenRange();
    })

    zkClient.connect();
}

module.exports = { range, base62encoding, setTokenRange, getTokenRange, createToken, checkIfTokenExists, removeToken, connectZK }