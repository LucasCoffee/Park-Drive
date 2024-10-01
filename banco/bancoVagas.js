const Sequelize = require("sequelize");
const conection = require("./conexaoBanco");
const ClienteMensal = require("./bancoCliMensal");
const Estacionamento = require("./bancoEstacionamento");



let vaga = conection.define("vaga", {
   numero:{
    type: Sequelize.INTEGER,
    allowNull: true
   }, 
   status:{
    type: Sequelize.BOOLEAN,
    allowNull: true
   },
   estacionamentoId:{
      type: Sequelize.INTEGER,
      allowNull: true
   },
   mensalId:{
      type: Sequelize.INTEGER,
      allowNull: true
   }

});

ClienteMensal.hasMany(vaga);
vaga.belongsTo(ClienteMensal);

Estacionamento.hasMany(vaga);
vaga.belongsTo(Estacionamento);

module.exports = vaga



