const Sequelize = require("sequelize");
const conection = require("./conexaoBanco");

let ClienteMensal = conection.define("mensals", {
    nome:{
        type: Sequelize.STRING,
        allowNUll: false
    }, 
    cpf:{
        type: Sequelize.STRING,
        allowNUll: false
    }, 
    telefone: {
        type: Sequelize.STRING,
        allowNUll: false
    }, 
    vagasPaga:{
        type: Sequelize.STRING,
        allowNUll: false
    },
    valor:{
        type: Sequelize.STRING,
        allowNUll: false
    },
    pagaDia: {
        type: Sequelize.STRING,
        allowNUll: false
    }, 
    pagaStatus: {
        type: Sequelize.STRING,
        allowNUll: false
    }
});

ClienteMensal.sync({force: false}).then(() =>{});

module.exports = ClienteMensal