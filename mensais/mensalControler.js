const express = require("express");
const router = express.Router();
const ServiceMensal = require("./ServiceMensal")

router.get("/cadastro", function(req, res){
    res.render("./mensal/cadaMensal.ejs")
});

router.post("/cadastrar", async (req, res) =>{

    const { idEsta, email } = req.usuario;
    const { nome, cpf, telefone, pagaDia} = req.body; 

    try {
        const criar = new ServiceMensal(null, idEsta, nome, cpf, telefone, pagaDia, email )
        const id = await criar.cadastrar()
        res.redirect(`/mensal/visualizarCliente/${id}`)
    } catch (error) {
        res.json({mensagem: "Erro no cadastro"})

    }

});           

router.get("/listar", async (req, res) => {

    if(req.usuario == undefined){
        res.redirect("/")
    }
    const { idEsta } = req.usuario;


    try {
        const serviceMensal = new ServiceMensal(null, idEsta)
        const clientes = await serviceMensal.buscarTodos()
        res.render("./mensal/listarMensal", {
            titulo : "Lista de clientes mensais",
            clientes : clientes
        })
    } catch (error) {
        res.render("./mensal/listarMensal", {
            titulo : "Erro na busca tente novamente",
            clientes : []
        })
    }

});

router.get("/visualizarCliente/:id", async function(req, res){
    const { id } = req.params;
    const { idEsta } = req.usuario;

    try {
        const serviceMensal = new ServiceMensal(id, idEsta)
        const mensal = await serviceMensal.buscarUnico();
        res.render("./mensal/viewClienteMensal", {
            clientes : mensal[0]?.dataValues,
            veiculos: mensal[0]?.dataValues.veiculos || [],
            vagas: mensal[0]?.dataValues.vagas || []

        })
    } catch (error) {
        res.render("./mensal/listarMensal", {
            titulo : "Erro na busca tente novamente",
            clientes : []
        })
    }

});




router.post("/deletar", (req, res) => {
    let idCliente = req.body.idCliente

    if(idCliente != undefined){
        if (!isNaN(idCliente)) {
            bancoClienteMensal.destroy({
                where: {
                    id : idCliente
                }
            }).then(() => {
                res.redirect("/listar")
            })
        } else {
            res.redirect("/listar")
        }
    }else{
        res.redirect("/listar")
    }
})

router.get(("/editar/:id"), (req, res) => {
    let idCliente = req.params.id
    console.log(idCliente)
    if(isNaN(idCliente)){
        res.redirect("/listar");
    }else{
        bancoClienteMensal.findByPk(idCliente).then(cli => {
            if(cli != undefined){
                res.render("./mensal/editar", {clientes: cli})
            }else{
                res.redirect("/listar")
            }
        }).catch(erro => {
            res.redirect("/")
        })
    }

});

router.post(("/salvarEdicao"), (req, res) =>{

    let idCliente = req.body.id

    if(isNaN(idCliente)){
        res.redirect("/listar");
    }else{
        bancoClienteMensal.findByPk(idCliente).then(atualizarCliente => {

            atualizarCliente.update(
                {
                    nome : req.body.nome,
                    cpf : req.body.cpf,
                    telefone :  req.body.telefone,
                    categoria : req.body.categoria,
                    placa :  req.body.placa,
                    modelo : req.body.modelo,
                    vaga :  req.body.vaga,
                    pagaDia : req.body.diaPaga,
                }
            ).then( cliente => {
                res.redirect("/listar/" + idCliente)
            })
        }).catch(error => {
            console.log(error + "\n Cliente não encontrado")
        })
    }
    
});


router.post("/pagamento/:id", (req, res) => {
    let idCliente = req.params.id
    let status = req.body.status
    bancoClienteMensal.findByPk(idCliente).then(clientes => {

        clientes.update({
            pagaStatus : status
        }).then(() => {
            res.redirect("/listar/" + idCliente )
        })

    }).catch(err => {
        console.log(err)
    })
});

router.post("/EditVaga/:id", (req, res) => {
    let idCliente = req.params.id
    let vaga = req.body.vaga

    bancoClienteMensal.findByPk(idCliente, {
        include: {
            model : bancoVeiculos, 
            where: {mensalId: idCliente}, 
            required : false
        }
    }).then(clientes => {

        if(clientes.veiculos.length > vaga){
            res.send("Voce precisa retirar um veiculo antes de diminuir o numero de vagas")
        }else{
            clientes.update({
                vagasPaga : vaga
            }).then(() => {
                res.redirect("/listar/" + idCliente )
            })
        }
    }).catch(err => {
        console.log(err)
    })
})
module.exports = router