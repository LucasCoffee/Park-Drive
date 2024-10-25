const express = require("express");
const router = express.Router();
const ServiceEstacionamento = require("../Estacionamento/ServiceEstacionamento")
const ServiceCliDiario = require("./ServiceDiarios")

router.get("/estacionar", async (req, res) => {
    try {
        const {idEsta} = req.usuario;
        const service = new ServiceEstacionamento()
        const [response] = await service.buscaVagas(idEsta);

        res.render("diario/cadaDiarios", {vaga: response.dataValues.numVagasDia})

    } catch (error) {
        res.send("Erro no server")
    }

});

router.post("/salvarEntrada", async (req, res) => {
    try {
        const {idEsta} = req.usuario;
        const {placa, vaga} = req.body
        const dataSys = new Date()
        const horaMin = new Date( dataSys.getHours() + ":" + dataSys.getMinutes())
        const criarNovo  = new ServiceCliDiario(idEsta, placa, vaga, horaMin, null, null);
        await criarNovo.cadastrar()
            res.redirect("/diario/listarDiario")
    } catch (error) {
        
    }

});

router.get("/listarDiario", async (req, res) => {
    
    try {
        const clientesDiarios = new ServiceCliDiario()
        const response = await clientesDiarios.buscarTodos();
            res.render("./diario/listarDiarios", {titulo: "Listar clientes diarios", clientes: response})
    } catch (error) {
        console.log(error)
        res.send("Erro na busca das vagas")
    }
    
});

router.get("/:placa", async (req, res) => {
    
    try {
        const placa = req.params.placa
        const dadosVeiculo = new ServiceCliDiario(null, placa)
        if(placa != undefined){
            const response = await dadosVeiculo.buscarUnico();
            res.json(response)
        }else{
            res.send("Erro ao buscar placa")

        }

    } catch (error) {
        console.log(error)
        res.send("Erro ao buscar placa")
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
