const express = require("express");
const router = express.Router();
router.get("/registrarVaga", (req, res) => {
    res.render("./vaga/cadaVagas")
})

router.get("/listarVagas", (req, res) => {

    bancoVaga.findAll({
        where: {status: false },
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