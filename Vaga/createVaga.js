const express = require("express");
const bancoVaga = require("../banco/bancoVagas");
const util = require("util");

class Vaga {
    constructor(){
    }

    conferi(numeroVaga){
        try {
            bancoVaga.findOne({
                where:{numero : numeroVaga}
            }).then(vagaProcurada =>{
        
                if (vagaProcurada == null || vagaProcurada == undefined) {
                    create()
                } else {
                    return 1
                }
            })
            .catch(erro => {
                console.log(erro)
            })
        } catch (error) {
            console.log(error)
        }
    }

    create(){
        bancoVaga.create({
            numero : numeroVaga,
            status: "Disponivel"
        })
        .then((vaga) => {
            console.log("vaga registrada com sucesso");
             return vaga
        })
        .catch((err) => {
            console.log("erro ao registra vaga")
        })
    }

};

module.exports = Vaga