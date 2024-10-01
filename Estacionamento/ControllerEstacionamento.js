const express = require("express")
const router = express.Router();
const ServiceEstacionamento = require("./ServiceEstacionamento");



router.get("/cadastro/", async (req, res) =>{
    res.render("estacionamento/cadastro")
})

router.post("/cadastro/", async (req, res) =>{
    const {CNPJ, email, senha, nome, numVagasDia, numVagasMen, valorDiario, valorMensal} = req.body;

    try {
        const cadastroEsta = new ServiceEstacionamento(CNPJ, email, senha, nome, numVagasDia, numVagasMen, valorDiario, valorMensal)
            await cadastroEsta.Cadastro()
            res.redirect("/")
    } catch (error) {
            res.json({erro: error})
    }
 
})

//login
router.get("/login/", async (req, res) =>{
    res.render("estacionamento/login") 
})

router.post("/login/", async (req, res) =>{
    if(req.body.email == undefined || req.body.senha == undefined){
        res.send("Falta de informacoes")
    }

    try {
        const pesquisaUsuario = new ServiceEstacionamento(null, req.body.email, req.body.senha)
        const token = await pesquisaUsuario.validarSenha()
        res.cookie('token', token, { secure: true, httpOnly: true })
        res.redirect("/")
    } catch (erro) {
        console.log(erro)
        res.send("Erro ao fazer login")
    }})

router.get("/logout/", (req, res) => {
    res.cookie('token', undefined, { secure: true, httpOnly: true })
    res.redirect("/")
})
router.get("/cadastro/:id", async (req, res) =>{
    const idEsta = req.params.id;
    try {
        const estaInfos = await new ServiceEstacionamento(idEsta).buscarID();
        res.render(
            
        )
    } catch (error) {
        console.log(error)
        res.send("Erro na busca pelo estacionamento")
    }

})

module.exports = router
