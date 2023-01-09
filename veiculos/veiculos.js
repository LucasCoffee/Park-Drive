const Sequelize = require("sequelize");
const conection = require("../banco/conexaoBanco");
const Clientesmensais = require("../banco/bancoCliMensal");
const ClienteMensal = require("../banco/bancoCliMensal");
const { fa } = require("faker/lib/locales");

const Veiculos = conection.define("veiculos", {
    categoria:{
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    modelo: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    marca: {
        type: Sequelize.STRING,
        allowNull: false
    },
    placa: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    mensalId:{
        type: Sequelize.STRING,
        allowNull: false
    }
    
});

Veiculos.sync({force: false}).then(() =>{});


ClienteMensal.hasMany(Veiculos);
Veiculos.belongsTo(ClienteMensal);

module.exports = Veiculos;