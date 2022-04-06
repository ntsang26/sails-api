// /**
//  * TodoController
//  *
//  * @description :: Server-side actions for handling incoming requests.
//  * @help        :: See https://sailsjs.com/docs/concepts/actions
//  */

module.exports = {
    list: async (req, res) => {
        try {
            const authorizationHeader = req.headers['authorization']
            const token = authorizationHeader.split(' ')[1]
            const accessToken = await Token.findOne({ token: token })
            if (accessToken) {
                let toDos = await Todo.find({ owner: accessToken.owner })
                res.json({
                    data: toDos,
                })
            }
        } catch (error) {
            res.serverError("Something went wrong")
        }
    },
    findWorkById: async (req, res) => {
        try {
            const authorizationHeader = req.headers['authorization']
            const token = authorizationHeader.split(' ')[1]
            const accessToken = await Token.findOne({ token: token })
            if(accessToken) {
                let id = req.param("id")
                let data = await Todo.findOne({ id: id })
                res.json({
                    data: data,
                })
            }
        } catch (error) {
            res.serverError("Something went wrong")
        }
    },
    storeAdd: async (req, res) => {
        try {
            const authorizationHeader = req.headers['authorization']
            const token = authorizationHeader.split(' ')[1]
            const accessToken = await Token.findOne({ token: token })
            const data = req.body

            if (accessToken) {
                let work = data.work
                let desc = data.description
                let owner = accessToken.owner
                await Todo.create({ work: work, description: desc, owner: owner })
                res.json({ added: data, owner: owner })
            }
        } catch (err) {
            res.serverError("Something went wrong")
        }
    },
    storeEdit: async (req, res) => {
        try {
            const authorizationHeader = req.headers['authorization']
            const token = authorizationHeader.split(' ')[1]
            const accessToken = await Token.findOne({ token: token })
            if(accessToken) {
                let id = req.param("id")
                await Todo.update({ id: id }).set(req.body)
                res.json({
                    edited: req.body,
                })
            }
        } catch (err) {
            res.serverError("Something went wrong")
        }
    },
    destroy: async (req, res) => {
        try {
            const authorizationHeader = req.headers['authorization']
            const token = authorizationHeader.split(' ')[1]
            const accessToken = await Token.findOne({ token: token })
            if(accessToken) { 
                
            }
            let id = req.param("id")
            await Todo.destroy({ id: id })
            res.ok()
        } catch (err) {
            res.serverError("Something went wrong")
        }
    },
}
