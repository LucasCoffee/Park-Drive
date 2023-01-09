const express = require("express");
const router = express.Router();

const bancoVaga = require("../banco/bancoVagas")

let CriarVaga = require("./createVaga");
let vagaNova = new CriarVaga;


router.post("/cadastrarVagas", (req, res) => {
    let numeroVaga = Number(req.body.nunVaga)
 
    bancoVaga.findOne({
        where:{numero : numeroVaga}
    }).then(vagaProcurada =>{
        if (vagaProcurada == null || vagaProcurada == undefined) {
            bancoVaga.create({
                numero : numeroVaga,
                status: true
            })
            .then((vaga) => {
                res.render("./vaga/viewVaga", {vaga : vaga});
            })
            .catch((err) => {
                console.log("erro ao registra vaga")
            })
        } else {
            res.redirect("/listarVagas");
        }
    })

});

router.get("/registrarVaga", (req, res) => {
    res.render("./vaga/cadaVagas")
})

router.get("/listarVagas", (req, res) => {

    bancoVaga.findAll({
        raw: true, order:[
            ["numero", "ASC"]
        ]
    }).then(vagas => {
        res.render("./vaga/listarVagas", {
            titulo: "Lista de vagas cadastradas",
            vagas: vagas
        })
    })
});

router.get("/listarVagas/:id", (req, res) => {

    let idVaga = req.params.id

    bancoVaga.findOne({
        where: {id : idVaga}
    }).then(vaga => {
        console.log(vaga)
        if (vaga != undefined) {
            res.render("./vaga/viewVaga", {vaga: vaga})
        } else {
            res.redirect("/listarVagas")
        }
    }).catch(erro => {
        console.log("Erro no banco de vagas", erro)
        res.redirect("/listarVagas")
    })

})

module.exports = router