const path = require('path')
const app = require(path.join(__dirname,'/app'))
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const connectDatabase = require(path.join(__dirname,'/database/connection'))
require('dotenv').config({ path: path.join(__dirname,'/database/config.env') });
// this is a change
// Uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`MAIN ERROR: ${err}`)
    console.log(`ERROR: ${err.message}`)
    console.log(`message : There is some  Uncaught Exception -------`)
})

// PORT
const port = process.env.PORT || 3000

// connecting to database
connectDatabase();

// listen on port

const server = app.listen(port)
// Unhandled Promiser exception
process.on('unhandledRejection', (err) => {
    console.log(`err: ${err.message}`)
    console.log(`MAIN ERROR: ${err}`)
    console.log(`Shutting down due to unhandled promise rejection -------`)
     server.close(()=>{
        process.exit(1)
     })
});
