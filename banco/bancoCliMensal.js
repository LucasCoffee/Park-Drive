const Sequelize = require("sequelize");
const connection = require("./conexaoBanco");
const Estacionamento = require("./bancoEstacionamento");

let ClienteMensal = connection.define("mensal", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    telefone: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    vagasPaga: {
        type: Sequelize.INTEGER, // Changed to INTEGER if it's a count
        allowNull: false
    },
    valor: {
        type: Sequelize.FLOAT, // Changed to FLOAT for monetary value
        allowNull: false
    },
    pagaDia: {
        type: Sequelize.BOOLEAN, // Changed to BOOLEAN if it's true/false
        allowNull: false
    }, 
    pagaStatus: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

ClienteMensal.sync({force: false}).then({})


module.exports = ClienteMensal;
