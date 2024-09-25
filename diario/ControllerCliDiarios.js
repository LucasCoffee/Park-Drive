const express = require("express");
const router = express.Router();

router.get("/estacionar", (req, res) => {

    var horarios = {
        horEntrada: 0, 
        horSaida: 0,
        minEntrada: 0,
        minSaida: 0,
        dataEntrada: 0
    }

        horarios.horEntrada = new Date().getHours() 
        horarios.minEntrada = new Date().getMinutes()
        var date = new Date()
        horarios.dataEntrada = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        if (horarios.minEntrada < 9) {
            horarios.minEntrada = "0" + horarios.minEntrada
        };
        
    Vagas.findAll({
        where: {
            status: true
        }, 
        order: [
            ['numero', "ASC"]
        ]
    }).then( vaga => {
        res.render("./diario/cadaDiarios", {horarios : horarios, vagas : vaga})
    }).catch(err => {
        res.send("Erro de servidor")
    });
});

router.post("/salvarEntrada", (req, res) => {
    var entradaVei = {
        vaga: req.body.vaga,
        placa: req.body.placa,
        horEntrada: new Date().getHours(),
        horSaida: 0,
        minEntrada: new Date().getMinutes(),
        minSaida: 0,
        dataEntrada: new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear(),
        dataSaida: 0,
        horParado: 0,
        minParado: 0, 
        totParado: 0,
        valorApagar: 0
    }

    if (entradaVei.placa != undefined || entradaVei.placa != "") {

        Vagas.findByPk(entradaVei.vaga).then(vaga => {
            vaga.update(
                {status: false}
            );
        }).then(vagaUp => {
            console.log("Vaga atualizada")
        }).catch(err => {
            console.log("err", err )
        })

        localStorage.setItem(entradaVei.placa, JSON.stringify(entradaVei) );
        res.redirect("/listarDiario")
    } else {
        res.send("FIm")
    }
});

router.get("/listarDiario", (req, res) => {
    res.render("./diario/listarDiarios", {titulo: "Carros estacionados", clientes: arrCliente});
});

router.get("/diario/:placa", (req, res) => {
    var placa = req.params.placa
    registrarSaida(veiculo);

    if (veiculo != undefined) {
        res.render("./diario/saidaDiarios.ejs", {veiculo: veiculo})

    } else {
        res.send("Esse veiculo nao foi encontrado");
    }

})

router.get("/sair/:placa", async (req, res) => {
    //recebe a placa e busca
    var placa = req.params.placa;
    var veiculo = JSON.parse(localStorage.getItem(placa));
    
    if (veiculo != undefined) {

       await registrarSheets([
        [
            veiculo.placa,
            veiculo.dataEntrada,
            `${veiculo.horEntrada} : ${veiculo.minEntrada}`,
            `${veiculo.horSaida} : ${veiculo.minSaida}`
        ]
       ])

        Vagas.findByPk(veiculo.vaga).then(vaga => {
            vaga.update(
                {status: true}
            );
        }).then(vagaUp => {
            console.log(vagaUp)
        }).catch(err => {
            console.log(err)
        })
        localStorage.removeItem(placa);

        res.redirect("/listarDiario")
        
    } else {
        res.send("Esse veiculo nao foi encontrado")
    }
});


function registrarSaida(veiculo) {
    
    //marca a hora de saida e a diferença da hora de chegada
    veiculo.horSaida = new Date().getHours()
    veiculo.horParado = veiculo.horSaida - veiculo.horEntrada;

    //marca o minuto de saida e adiciona um zero se for menos que 9 minutos para ficar com dois digitos
    veiculo.minSaida = new Date().getMinutes()
    
    //difereça do minuto de entrada pro de saida
    veiculo.minParado = veiculo.minSaida - veiculo.minEntrada

    // total de tempo
    veiculo.totParado = (veiculo.horParado * 60 ) + veiculo.minParado;

    //marca a data de saida
    veiculo.dataSaida = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()

    for (const key in veiculo) {
        if (veiculo[key] < 0 ) {
            veiculo[key] = veiculo[key] * (- 1);
        }
        if (veiculo[key] <= 9 ) {
            veiculo[key] = "0" + veiculo[key]
        }
    }

    const valorEstarcionar = 0.1

        if (veiculo.totParado <= 5 ) {
            veiculo.valorApagar = "Cliente nao ficou mais que 5 minutos, saida gratis"
        } else if (veiculo.totParado <= 30 && veiculo.totParado > 5  ) {
            veiculo.valorApagar = 3
        } else if(veiculo.totParado > 30 ){
            veiculo.valorApagar = veiculo.totParado * valorEstarcionar
        };

        localStorage.setItem(veiculo.placa, JSON.stringify(veiculo) );
    
    return veiculo

}

module.exports = router
