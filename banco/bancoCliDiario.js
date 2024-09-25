const {Sequelize, DataTypes} = require("sequelize");
const conection = require("./conexaoBanco");

var ClienteDiario = conection.define("diarios", {
    placa:{ 
        freezeTableName: true,
        type: DataTypes.DATE
    }, 
    horaEntrada: {
        freezeTableName: true,
        type: DataTypes.TIME
    }, 
    horaSaida: {
        freezeTableName: true,
        type: DataTypes.TIME
    }, 
    valorPago: {
        freezeTableName: true,
        type: DataTypes.NUMBER
    }, 
    
}); 

ClienteDiario.sync({force: false}).then(() =>{});


module.exports = ClienteDiario