const getToken = (req) => {
    const autheader = req.headers.authorization
    const token = autheader.split(' ')[1]
    return token
}
module.exports = getToken