// express
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://localhost:27017/estacionamento", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Mongo OK")
    })
    .catch((err) => {
        console.log("Mongo Bad")

        console.log(err)
    })

//view engine
app.set("view engine", "ejs");

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static
app.set(express.static("public"));
app.use(express.static(__dirname + '/public'));

async function verificarToken(req, res, next) {
    const tokenRecuperado = req.cookies.token; // Recuperando o token do cookie

    try {
        jwt.verify(tokenRecuperado, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.redirect("/estacionamento/login")
            }
            req.usuario = decoded;
            next();
          });
    } catch (error) {
        res.redirect("/estacionamento/login")
    }
  }

//controler
const controlerMensal = require("./mensais/mensalControler")
app.use("/mensal",verificarToken, controlerMensal);

const controlerVeiulos = require("./veiculos/controllerVeiculo");
app.use("/veiculos",verificarToken, controlerVeiulos);

const controllerDiario = require("./diario/ControllerCliDiarios");
app.use("/diario",verificarToken, controllerDiario);

const controllerEstacionamento = require("./Estacionamento/ControllerEstacionamento");
app.use("/estacionamento", controllerEstacionamento);

app.listen(1331, (erro) =>{
    if(erro){
        console.log("Um erro ocorreu ao ligar o servidor")
    }else{
        console.log("Servidor iniciado com sucesso")
    }
});

app.get("/", function(req, res){
    console.log(req.cookies)
    if(req.cookies.token == undefined || req.cookies.token == "undefined"){
        res.render("PaginaInicial.ejs")
    }else{
        res.render("home.ejs")
    }

});