const mongoose = require('mongoose')

const uri = process.env.URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database is connected to', uri);
}).catch((err) => {
    console.error('Error', err);
})