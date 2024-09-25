const express = require("express");
const router = express.Router();
const bancoClienteMensal = require("../banco/bancoCliMensal");
const bancoVeiculos = require("../veiculos/veiculos");
const Validacao = require("../public/js/validador");


router.get("/cadastro", function(req, res){

    res.render("./mensal/cadaMensal.ejs")

});

router.post("/cadastrar", (req, res) =>{

    var dadosClientes = {
        nome : req.body.nome,
        cpf : req.body.cpf,
        telefone :  req.body.telefone,
        pagaDia : req.body.diaPaga,
        pagaStatus : req.body.pagamento,
        vagasPaga: req.body.vagasPaga,
        valor: ((req.body.vagasPaga) * 200 ),
        pagaDia: req.body.diaPaga,
        pagaStatus: req.body.pagamento
    }
        
        Validacao.analiseDeDados({"dadosDe": "mensal", "dados" : dadosClientes}).then(cadastrado => {
            if (cadastrado.hasOwnProperty("status")) {
                res.send("Voce nao forneceu os seguintes dados: " + cadastrado.vazios)
            } else {
                res.redirect("/listar/" + cadastrado.id)
            }
        }).catch(err => {
            console.log(err)
        });
});           

router.get("/listar", function(req, res){

    bancoClienteMensal.findAll({
        raw: true, order:[
            ["id", "DESC"]
        ]
    }).then(clientes =>{
        res.render("./mensal/listarMensal", {
            titulo : "Lista de clientes mensais",
            clientes : clientes
        })
    });

});

router.post("/mensal/deletar", (req, res) => {
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

router.get(("/mensal/editar/:id"), (req, res) => {
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

router.post(("/mensal/salvarEdicao"), (req, res) =>{

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


router.post("/mensal/pagamento/:id", (req, res) => {
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

router.post("/mensal/EditVaga/:id", (req, res) => {
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