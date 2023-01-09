const Sequelize = require("sequelize")

const conection = new Sequelize({
    host: "localhost",
    username: "root",
    password: "1234567",
    dialect: "mysql",
    database: "clientesmensais",
    dialectModulo: require("mysql2"),
    benchmark: true
});

conection
    .authenticate()
    .then(()=>{
        console.log("Conexão com banco foi um sucesso");
    })
    .catch((msgErro) =>{
        console.log(msgErro)
})



module.exports = conection