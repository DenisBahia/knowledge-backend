const mongoose = require("mongoose")

mongoose.connect("mongodb://heroku_gbchlddp:Mmsvndo8@@ds155665.mlab.com:55665/heroku_gbchlddp", {useNewUrlParser: true})
    .catch(e => {
        const msg = "ERRO ao conectar mongodb"
        console.log(msg)
    })