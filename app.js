// express
const express = require("express");
const app = express();

//view engine
app.set("view engine", "ejs");

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static
app.set(express.static("public"));
app.use(express.static(__dirname + '/public'));

//controler
const controlerMensal = require("./mensais/mensalControler")
app.use("/mensal", controlerMensal);

const controlerVeiulos = require("./veiculos/controllerVeiculo");
app.use("/veiculos", controlerVeiulos);

const controllerDiario = require("./diario/ControllerCliDiarios");
app.use("/diario", controllerDiario);


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
    res.render("home.ejs")
});