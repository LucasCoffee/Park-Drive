const Sequelize = require("sequelize");
const conection = require("./conexaoBanco");
const ClienteMensal = require("./bancoCliMensal");


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

ClienteMensal.hasMany(vaga);
vaga.belongsTo(ClienteMensal);

module.exports = vaga



