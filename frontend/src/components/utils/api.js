//esse arquivo ira consumir a API
//axios
import axios from "axios"

export default axios.create({
    baseURL: 'http://localhost:5000'
})
