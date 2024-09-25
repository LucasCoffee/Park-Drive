const express = require("express")
const router = express.Router();
const ServiceEstacionamento = require("./ServiceEstacionamento");
//cadastro

router.get("/cadastro/", async (req, res) =>{
    res.render("estacionamento/cadastro")
})

router.post("/cadastro/", async (req, res) =>{
    const {CNPJ, email, senha, nome, numVagasDia, numVagasMen, valorDiario, valorMensal} = req.body;

    try {
        const cadastroEsta = new ServiceEstacionamento(CNPJ, email, senha, nome, numVagasDia, numVagasMen, valorDiario, valorMensal)
            await cadastroEsta.Cadastro()
            res.send("Criado")
    } catch (error) {
            res.json({erro: error})
    }
 
})

//login
router.get("/login/", async (req, res) =>{
    res.render() 
})

router.post("/login/", async (req, res) =>{
    const {email, senha} = req.body
})

//update

router.get("/cadastro/", async (req, res) =>{
    res.render() 
})

router.put("/cadastro/", async (req, res) =>{
    const {CNPJ, email, senha, nome, numVagasDia, numVagasMen, valorDiario, valorMensal} = req.body;

    
    
 
})

//getInfos
router.get("/cadastro/:id", async (req, res) =>{
    const idEsta = req.params.id;
    try {
        const estaInfos = await new ServiceEstacionamento(idEsta).buscarID();
        res.render()
    } catch (error) {
        console.log(error)
        res.send("Erro na busca pelo estacionamento")
    }

})

module.exports = router
