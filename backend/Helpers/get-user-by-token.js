//Helpers/get-user-by-token.js  ............................................................................................................
const jwt = require('jsonwebtoken')

const User = require('../Model/User')

//Buscando usuario com o jwt
async function getUserByToken(token){
    if(!token){
        return resizeBy.status(401).json({message: "Acesso negado"})
    }
    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findOne({id: userId})

    return user
}

module.exports = getUserByToken