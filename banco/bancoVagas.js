const Sequelize = require("sequelize");
const conection = require("./conexaoBanco");
const Veiculo = require("./../veiculos/veiculos")

let parkingspace = conection.define("parkingspace", {
   numero:{
    type: Sequelize.INTEGER,
    allowNull: true
   }, 
   status:{
    type: Sequelize.BOOLEAN,
    allowNull: true
   }

});



parkingspace.sync({force: false}).then({})



module.exports = parkingspace



