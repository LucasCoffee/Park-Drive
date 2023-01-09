// express
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const session = require("express-session");
const flash = require("express-flash");

//view engine
app.set("view engine", "ejs");

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//public
app.use(express.static("public"));

//static
app.set(express.static("public"));
app.use(express.static(__dirname + '/public'));

//controler
const controlerMensal = require("./mensais/mensalControler")
app.use("/", controlerMensal);

const controlerVagas = require("./Vaga/vagaControler");
app.use("/", controlerVagas);

const controlerVeiulos = require("./veiculos/controllerVeiculo");
app.use("/", controlerVeiulos);

const controlerDiario = require("./diario/ControllerCliDiarios");
app.use("/", controlerDiario);

const controlerRelatorios = require("./Relatorios/relatorioControler");
app.use("/", controlerRelatorios);

//banco 
const bancoClienteMensal = require("./banco/bancoCliMensal");
const bancoVeiculos = require("./veiculos/veiculos");

//cookie parser
app.use(cookieParser("jsjsjsNodejsjsjNode"))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(flash());

app.listen(1331, function(erro){
    if(erro){
        console.log("Um erro ocorreu ao ligar o servidor")
    }else{
        console.log("Servidor iniciado com sucesso")
    }
});

app.get("/", function(req, res){
    res.render("home.ejs")
});

app.get("/cadastrarDiario", (req, res) => {

    const DATA = new Date();

    let inputEntrada = {
        hor: DATA.getHours(),
        min: DATA.getMinutes(),
        seg: DATA.getSeconds(),
        dia: DATA.getDate(),
        mes: DATA.getMonth() + 1,
        ano: DATA.getFullYear()
    };

    res.render("cadaDiarios", {inputEntrada})

});

app.get("/listar/:id", (req, res) =>{

    let id = req.params.id;

    bancoClienteMensal.findAll({
        where: {id: id},
        include: {
            model : bancoVeiculos, 
            where: {mensalId: id}, 
            required : false
        }
    }
    ).then(clientes => {

        let arrayVeiculo;
        let arrayClientes;
  
        clientes.forEach(element => {
            arrayVeiculo = element.veiculos
            arrayClientes = element
        });

        if(clientes != undefined){
           res.render("mensal/viewClienteMensal", {veiculos: arrayVeiculo, clientes : arrayClientes})

        } else{
            res.redirect("/listar");
        }
    });
});