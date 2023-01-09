const express = require("express");
const app = express.Router()
const bancoClienteMensal = require("../banco/bancoCliMensal");
const Relatorio = require("../Relatorios/relatoriosScript");

var ativos = 0

app.get("/relatorios", (req, res) =>{

    var dados

    async function calcularRelatorios(){
        dados = await Relatorio

        res.render("./relatorios/relatorios", {
            dadosRelatorios: dados
        });

        ativos++;
    }

    calcularRelatorios()

});

app.get('/relatorio/atrasados', (req, res) => {

    var clientes = []

    bancoClienteMensal.findAll({
        where: {pagaStatus: "false"}
    }).then(clienteAtrasados => {
    
        clienteAtrasados.forEach(atradados => {
          
            clientes.push(atradados)
    
        });

        res.render("./mensal/listarMensal", {
            titulo : "Lista de cliente com pagamento atradados", 
            clientes: clienteAtrasados
        })
    });
});

app.get("/relatorio/emdia", (req, res) => {

    bancoClienteMensal.findAll({
        where: {pagaStatus: "true"}
    }).then(clienteEmDia => {
        res.render("./mensal/listarMensal", {
            titulo: "Lista de clientes com pagamento em dia",
            clientes: clienteEmDia
        });
    })
    
});

module.exports = app