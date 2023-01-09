const express = require("express");
const router = express.Router();
const conection = require("../banco/conexaoBanco");
const BancoCliMensal = require("../banco/bancoCliMensal");
const bancoVeiculos = require("../veiculos/veiculos");
const id = require("faker/lib/locales/id_ID");
const flash = require("express-flash");

const bancoVaga = require("../banco/bancoVagas");
const Veiculos = require("../veiculos/veiculos");

router.get("/cadastrarVeiculos/:id", (req, res) => {

    let idMoto = req.params.id

    BancoCliMensal.findAll({
        where: {id: idMoto},
        include: [
            {
                model : bancoVeiculos, 
                where: {mensalId: idMoto}, 
                required : false
            }
        ]   
    }).then(motorista => {
        var obj;
        motorista.forEach(element => {
            obj = element
            for (const key in element) {                
                if (key == "veiculos" ) {
                    if (element[key].length >= Number(obj.vagasPaga)) {
                        res.send("Voce atingiu o limite de vagas disponivei!")
                    } else {
                        bancoVaga.findAll(
                            {where: {status: true}
                        }).then(vaga =>{
                            res.render("veiculos/cadaVei", {motoristas : motorista, id: idMoto, vaga : vaga})
                        });
                    };
                };
            };
        });
    });
});

router.post("/registrarVeiculo", (req, res) => {
    var veiculo = {
        categoria: req.body.categoria,
        modelo: req.body.modelo,
        marca: req.body.marca,
        placa: req.body.placa,
        mensalId: req.body.motoristaID,
        vaga: req.body.vaga
    }

    const Validacao = require("../public/js/validador")

    async function verificacao(){
        let veiculoValidado = Validacao.analiseDeDados({"dadosDe": "veiculo", "dados": veiculo}).then(validado =>{
            console.log(validado)

            if (validado.hasOwnProperty("status")) {
                res.send("Voce nao forneceu os seguintes dados: " + validado.vazios)
            } else {
                new Promise((resolve, reject) => {
                    bancoVaga.findOne({
                        where: {
                            numero: req.body.vaga
                        }
                    }).then(vaga => {
                        vaga.update({
                            status: false
                        })
                    })
                })
                res.redirect("/listar/" + validado.mensalId)
            }
            
        }).catch(err => {
            console.log(err)
        }) 
    }

    verificacao()

});


router.get("/veiculoDelete/:id", (req, res) => {
    var idVei = req.params.id

    Veiculos.findByPk(idVei).then(veiculo => {
        if(!veiculo){
            res.send("Veiculo nao escontrado")
        }else{
            var idMoto = veiculo.mensalId
            Veiculos.destroy({
                where: { id : idVei}
            }).then(() => {
                res.redirect("/listar/" + idMoto)
            })
        }
    })


})

router.get("/veiculoEdit/:id", (req, res) =>{
    var idVei = req.params.id

    Veiculos.findByPk(idVei).then(veiculo => {
        bancoVaga.findAll({
            where: {
                status: true
            }
        }).then(vagas => {
            res.render("veiculos/veiculoEdit", {vei: veiculo, vaga: vagas})
        })
        
    })
});


router.post("/veiculos/salvarEdicao", (req, res) => {

    Veiculos.findByPk(req.body.id).then(veiculo => {
        veiculo.update(
            {
                modelo: req.body.modelo,
                marca:  req.body.marca, 
                placa:  req.body.placa
            }
        ).then(() => {
            res.redirect("/listar/" + veiculo.mensalId)
        })
    })

})

module.exports = router