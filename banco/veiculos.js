const {Sequelize, DataTypes} = require("sequelize");
const conection = require("./conexaoBanco");
const ClienteMensal = require("./bancoCliMensal");

const Veiculos = conection.define("veiculos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    categoria:{
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    placa: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    mensalId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vagaId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE, // Use DATE for timestamps
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE, // Use DATE for timestamps
        allowNull: false
    }
    
});


ClienteMensal.hasMany(Veiculos);
Veiculos.belongsTo(ClienteMensal);


module.exports = Veiculos;