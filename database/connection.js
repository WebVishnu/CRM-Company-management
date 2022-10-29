const mongoose = require('mongoose');

connectionParameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

function connectDatabase(){

    mongoose.connect(process.env.DB_URL, connectionParameters)
        .then(console.log('connnection successfull'))
        .catch((e) => {
            console.log('Sorry there is some error in database connection\n======================='+`Error: ${e}`)
        })
}

module.exports = connectDatabase;
