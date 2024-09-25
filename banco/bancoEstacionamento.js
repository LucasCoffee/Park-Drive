const { DataTypes } = require("sequelize");
const connection = require("./conexaoBanco");
const modelEstacionamento = connection.define("estacionamento", {
    CNPJ: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },  
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numVagasMen: {
        type: DataTypes.INTEGER, // Changed to INTEGER
        allowNull: false
    },
    numVagasDia: {
        type: DataTypes.INTEGER, // Changed to INTEGER
        allowNull: false
    },
    numVagasMenUsadas: {
        type: DataTypes.INTEGER, // Changed to INTEGER
    },
    valorMensal: {
        type: DataTypes.FLOAT, // Changed to FLOAT for monetary value
        allowNull: false
    },
    valorDiario: {
        type: DataTypes.FLOAT, // Changed to FLOAT for monetary value
        allowNull: false
    }
});


module.exports = modelEstacionamento;
