//models
const Pet = require('../Model/Pet')
const ImagePet = require('../Model/ImagePet')
const User = require('../Model/User')
//helpers
const getToken = require('../Helpers/get-token')
//bibliotecas
const jwt = require('jsonwebtoken')

module.exports = class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const available = true //sempre que um novo pet for cadastrado sera disponivel

        //validações
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatório' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'A cor é obriatório' })
            return
        }

        //definindo quem cadastrou o pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')//decodificando o token para pegar o id
        currentUser = await User.findByPk(decoded.id)

        //criando o objeto pet
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            UserId: currentUser.id
        })
        //salvando no banco de dados
        try {
            const newPet = await pet.save()
            res.status(200).json({ message: 'Pet cadastrado com sucesso', newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //buscar todos os pets
    static async getAll(req, res) {
        const pets = await Pet.findAll({
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({ pets: pets })
    }

    //filtrar pets por usuario
    static async getAllUserPets(req, res) {
        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        const pets = await Pet.findAll({
            where: { UserId: currentUserId },
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({ pets })
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {// inNaN == é um Not a Number
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        //buscar pet pelo id
        const pet = await Pet.findByPk(id)

        //validando se o pet existe
        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }
        res.status(200).json({ pet: pet })
    }

    static async removePetById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {// inNaN == é um Not a Number
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        //buscar pet pelo id
        const pet = await Pet.findByPk(id)

        //validando se o pet existe
        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }

        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        if (pet.UserId !== currentUserId) {
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        await Pet.destroy({ where: { id: id } })
        res.status(200).json({ message: 'Pet destruido com sucesso!!!' })
    }

    static async updatePet(req, res) {
        const id = req.params.id

        const { name, age, weight, color } = req.body

        const updatedPet = {}

        //buscar pet pelo id
        const pet = await Pet.findByPk(id)

        //validando se o pet existe
        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }

        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        if (pet.UserId !== currentUserId) {
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        } else {
            updatedPet.name = name
        }
        if (!age) {
            res.status(422).json({ message: 'O age é obrigatório' })
            return
        } else {
            updatedPet.age = age
        }
        if (!weight) {
            res.status(422).json({ message: 'O weight é obrigatório' })
            return
        } else {
            updatedPet.weight = weight
        }
        if (!color) {
            res.status(422).json({ message: 'O color é obrigatório' })
            return
        } else {
            updatedPet.color = color
        }

        //trabalhar as imagens
        const images = req.files
        if (!images || images.length === 0) {
            res.status(422).json({ message: 'As imagens são obrigatórias' })
            return
        } else {
            //Atualizar as imagens do PET
            const imageFilenames = images.map((image) => image.name)
            //remover as imagens antigas
            await ImagePet.destroy({ where: { PetId: pet.id } })
            //Adicionar novas imagens
            for (let i = 0; i < imageFilenames.length; i++) {
                const fileName = imageFilenames[i]
                const newImagePet = new ImagePet({ Image: fileName, PetId: pet.id })
                await newImagePet.save()
            }
        }
        await Pet.update(updatedPet, { where: { id: id } })

        res.status(200).json({ message: 'Pet atualizado com sucesso' })
    }

    static async schedule(req, res) {
        const id = req.params.id
        //buscar pet pelo id
        const pet = await Pet.findByPk(id)
        //validando se o pet existe
        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }
        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        if (pet.UserId === currentUserId) {
            res.status(422).json({ message: 'O pet já é seu' })
            return
        }

        //checar se o usuario já agendou a visita
        if (pet.adopter) {
            if (pet.adopter === currentUserId) {
                res.status(422).json({ message: 'Voce já agendou uma visita para esse pet' })
                return
            }
        }

        pet.adopter = currentUserId

        await pet.save()

        res.status(200).json({ message: `Visita agendada por ${currentUser.name}` })

    }

    static async concludeAdoption(req, res) {
        const id = req.params.id
        //buscar pet pelo id
        const pet = await Pet.findByPk(id)
        //validando se o pet existe
        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }
        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        if (pet.UserId !== currentUserId) {
            res.status(422).json({ message: 'ID invalido' })
            return
        }

        pet.available = false

        await pet.save()

        res.status(200).json({ message: 'adoção concluida' })
    }

    static async getAllUserAdoptions(req, res) {
        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        const pets = await Pet.findAll({
            where: { adopter: currentUserId },
            order: [['createdAt', 'DESC']]
        })

        res.status(200).json({ pets })
    }
}