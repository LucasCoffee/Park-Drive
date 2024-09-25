const bancoVaga = require("../banco/bancoVagas");
const ServiceEstac = require("../Estacionamento/ServiceEstacionamento")

class Vaga {
    constructor(idEsta, numero){
        this.idEsta = idEsta;
    }

    async ConfereNumerosTotalDeVagas(){
        try {
            const {numVagasDiaUsadas} = await ServiceEstac.buscarID();
            if(numVagasDiaUsadas < numVagasDia){
                this.create();
            }else{
                return {Erro: "Limite de vagas atingido"}
            }
        } catch (error) {
            return {Erro: "Erro ao acessar banco de dados"}

        }

    }

    conferi(){
        try {
            constbancoVaga.findOne({
                where:{numero : numeroVaga}
            }).then(vagaProcurada =>{
        
                if (vagaProcurada == null || vagaProcurada == undefined) {
                    create()
                } else {
                    return 1
                }
            })
            .catch(erro => {
                console.log(erro)
            })
        } catch (error) {
            console.log(error)
        }
    }

    create(){
        bancoVaga.create({
            numero : numeroVaga,
            status: "Disponivel"
        })
        .then((vaga) => {
            console.log("vaga registrada com sucesso");
             return vaga
        })
        .catch((err) => {
            console.log("erro ao registra vaga")
        })
    }

};

module.exports = Vaga