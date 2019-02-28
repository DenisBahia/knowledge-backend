const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/knowledge_stats", {useNewUrlParser: true})
    .catch(e => {
        const msg = "ERRO ao conectar mongodb"
        console.log(msg)
    })