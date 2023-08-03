//PetRoutes.js
const router = require('express').Router()
const PetController = require('../Controller/PetController')
const verifyToken = require('../Helpers/verify-token')
const { imageUpload } = require('../Helpers/image-upload')

//rotas privadas
//criar pet
router.post('/create', verifyToken, PetController.create)
//filtrar meus pets
router.get('/mypets', verifyToken, PetController.getAllUserPets)
//deletar um pet
router.delete('/:id', verifyToken, PetController.removePetById)
//editar um PET
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
//agendar pet
router.patch('/schedule/:id', verifyToken, PetController.schedule)
//concluir adoção
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)
//ver todas as adoções o usuario logado
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)


//rotas publicas
//ver todos os pets
router.get('/', PetController.getAll)
//ver pet pelo id
router.get('/:id', PetController.getPetById)

module.exports = router