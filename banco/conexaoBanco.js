const {Sequelize} = require("sequelize")
const databaseName = "Estacionamento";
const mysql = require("mysql2/promise");
const banco = {
    host: "localhost",
    username: "root",
    password: "1234567",
    dialect: "mysql",
    database: "Estacionamento",
    dialectModulo: require("mysql2"),
    benchmark: true
}

const connection = new Sequelize(banco);

const criarBancoDeDados = async () => {
    const client = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234567",
    });
    await client.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
    await client.end();
};

(async () => {
    try {
        await criarBancoDeDados(); // Chama a função para criar o banco
        await connection.authenticate()
        console.log("Conexão com banco foi um sucesso");
        await connection.sync({ force: false });    
    } catch (error) {
        console.log(error)
        return error
    }
})()
  
module.exports = connection