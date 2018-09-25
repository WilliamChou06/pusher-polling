const mongoose = require('mongoose');


// Map global promises

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://guillhermec:pass123456@pusherpoll-shard-00-00-9ld1t.mongodb.net:27017,pusherpoll-shard-00-01-9ld1t.mongodb.net:27017,pusherpoll-shard-00-02-9ld1t.mongodb.net:27017/test?ssl=true&replicaSet=pusherpoll-shard-0&authSource=admin')
.then(() => {
    console.log('MongoDB Connected')
})
.catch(err => console.log(err))