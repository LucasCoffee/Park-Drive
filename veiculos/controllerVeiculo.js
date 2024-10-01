const express = require("express");
const router = express.Router();
const ServiceEstacionamento = require("../Estacionamento/ServiceEstacionamento");    
const ServiceVaga = require("../Vaga/vagaService");
const ServiceVeiculo = require("./serviceVeiculos")

router.get("/cadastrarVeiculos/:id", async (req, res) => {
    const {idEsta} = req.usuario;
    const {id} = req.params
    const Service = new ServiceEstacionamento(idEsta)

    try {
        const [response] = await Service.buscaVagas(idEsta);
        const vagasJaCriada = [];
        const vagas = [];
        response.dataValues?.vagas.forEach(numero => {
            vagasJaCriada.push(numero.dataValues.numero)
        })

        for(let i = 1; i < response.dataValues.numVagasMen; i++){
                if(!vagasJaCriada.includes(i)){
                    vagas.push(i)
                }
        }
            
        res.render("veiculos/cadaVei", {motoristas : [], id: id, vagas : vagas || []})

    } catch (error) {
        console.log(error)
        res.send("Erro de busca nas informações")
    }

});

router.post("/registrarVeiculo/:idMensal", async (req, res) => {
    const {idEsta} = req.usuario
    const {idMensal} = req.params
    const {vaga, placa, modelo, marca, categoria} = req.body;
   
    try {
        const vagaService = new ServiceVaga(Number(idEsta), Number(vaga), Number(idMensal))
        const {id} = await vagaService.create();
        console.log(id)

        const serviceVeiculo = new ServiceVeiculo(Number(idMensal), Number(id), placa, modelo, marca, categoria )
        await serviceVeiculo.cadastrar();
        res.redirect("/mensal/listar")
    } catch (error) {
        console.log(error)
        res.send("Erro de cadastro")
    }



    
});


router.get("/veiculoDelete/:id", (req, res) => {
    var idVei = req.params.id

    Veiculos.findByPk(idVei).then(veiculo => {
        if(!veiculo){
            res.send("Veiculo nao escontrado")
        }else{
            var idMoto = veiculo.mensalId
            Veiculos.destroy({
                where: { id : idVei}
            }).then(() => {
                res.redirect("/listar/" + idMoto)
            })
        }
    })


})

router.get("/veiculoEdit/:id", (req, res) =>{
    var idVei = req.params.id

    Veiculos.findByPk(idVei).then(veiculo => {
        bancoVaga.findAll({
            where: {
                status: true
            }
        }).then(vagas => {
            res.render("veiculos/veiculoEdit", {vei: veiculo, vaga: vagas})
        })
        
    })
});


router.post("/veiculos/salvarEdicao", (req, res) => {

    Veiculos.findByPk(req.body.id).then(veiculo => {
        veiculo.update(
            {
                modelo: req.body.modelo,
                marca:  req.body.marca, 
                placa:  req.body.placa
            }
        ).then(() => {
            res.redirect("/listar/" + veiculo.mensalId)
        })
    })

})

module.exports = router