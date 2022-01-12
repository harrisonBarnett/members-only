const mongoose = require('mongoose')

module.exports = function(DB_URL) {
    mongoose.connect(
        DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(()=> console.log('Successfully connected to MongoDB...'))
    .catch(err => console.error(err))
}