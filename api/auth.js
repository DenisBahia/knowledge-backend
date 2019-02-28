const {authSecret} = require("../.env")
const jwt = require("jwt-simple")
const bcrypt = require("bcrypt-nodejs")

module.exports = app => {

    const signin = async (req, res) => {

        if (!req.body.email || !req.body.password){ 
            return res.status(400).send("Informe usuario e senha!")
        }

        const user = await app.db("users")
            .where({email: req.body.email})
            .first()
        if (!user){
            return res.status(400).send("Usuario invalido!")
        }

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch){
            return res.status(400).send("Senha invalida!")
        }

        const now = Math.floor(Date.now() / 1000)

        const payLoad = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payLoad,
            token: jwt.encode(payLoad, authSecret)
        })

    }

    const validateToken = async (req, res) => {

        const userData = req.body || null

        try {
            if (userData){
                const token = jwt.decode(userData.token, authSecret)
                //if (new Date(token.exp * 1000) > new Date()){
                    return res.send(true)
                //}
            }
        } catch(e){
        }

        return res.send(false)

    }

    return {signin, validateToken}

}