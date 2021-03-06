const bcrypt = require("bcrypt-nodejs")

module.exports = app => {

    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {

        const user = {...req.body}
        if (req.params.id) user.id = req.params.id

        if (!req.originalUrl.startsWith("/users")) user.admin = false
        if (!req.user || !req.user.admin) user.admin = false
        
        try {
            
            existsOrError(user.name, "Nome não encontrado")
            existsOrError(user.email, "EMail não encontrado")
            existsOrError(user.password, "Senha não encontrada")
            existsOrError(user.confirmPassword, "Confirmação de senha não encontrada")
            equalsOrError(user.password, user.confirmPassword, "Confirmação de senha inválida")

            const userFromDB = await app.db("users")
                .where({email: user.email}).first()
            if (!user.id){
                notExistsOrError(userFromDB, "Usuário já cadastrado!")
            }
            
        } catch(msg){
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)

        delete user.confirmPassword

        if (user.id) {
            app.db("users")
                .update(user)
                .where({id: user.id})
                .whereNull("deletedAT")
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db("users")
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const get = (req, res) => {

        app.db("users")
            .select("id", "name", "email", "admin", "deletedAT")
            .whereNull("deletedAT")
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))

    }

    const getById = (req, res) => {

        app.db("users")
            .where({id: req.params.id})
            .whereNull("deletedAT")
            .select("id", "name", "email", "admin")
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))

    }

    const remove = async (req, res) => {

        try {
            
            const articles = await app.db("articles")
                .where({userId: req.params.id})
            notExistsOrError(articles, "Usuário com artigos.")

            const rowsUpdated = await app.db("users")
                .update({deletedAT: new Date()})
                .where({id: req.params.id})
            existsOrError(rowsUpdated, "Usuário não encontrado.")
            
            res.status(204).send()

        } catch (ex) {
            res.status(500).send(ex)
        }

    }

    return {save, get, getById, remove}

}