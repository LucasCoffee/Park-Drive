const Sequelize = require("sequelize");
const conection = require("./conexaoBanco");
const Estacionamento = require("./bancoEstacionamento")

let vaga = conection.define("vaga", {
   numero:{
    type: Sequelize.INTEGER,
    allowNull: true
   }, 
   status:{
    type: Sequelize.BOOLEAN,
    allowNull: true
   }

});

module.exports = vaga



