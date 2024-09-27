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
    pagaDia: {
        type: Sequelize.INTEGER, // Changed to BOOLEAN if it's true/false
        allowNull: false
    },
    id_estacionamento: {
        type: Sequelize.INTEGER, // Changed to BOOLEAN if it's true/false
        allowNull: false
    }
});

ClienteMensal.sync({force: false}).then({})


module.exports = ClienteMensal;
