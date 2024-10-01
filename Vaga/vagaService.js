const { where } = require("sequelize");
const bancoVaga = require("../banco/bancoVagas");
const ServiceEstac = require("../Estacionamento/ServiceEstacionamento");
const modelEstacionamento = require("../banco/bancoEstacionamento");

class ServiceVaga {
    constructor(idEsta, numero, idMensal, status){
        this.idEsta = idEsta;
        this.numero = numero
        this.idMensal = idMensal,
        this.status = status
    }

    async VerificaNumeroUtilizado(){
        try {
            const res = await bancoVaga.findAndCountAll({
                attributes: ["numero"],
                where: { estacionamentoId: this.idEsta },
                include: [
                    {
                        model: modelEstacionamento,
                        attributes: ["numVagasDia", "numVagasMen"],
                        required: true, // Garante que o estacionamento deve existir
                        where: { id: this.idEsta }
                    }
                ]
            });
            
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject()
        }
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

    async create(){
        try {
            const response = await bancoVaga.create({
                numero : this.numero,
                status: false,
                estacionamentoId: this.idEsta,
                mensalId: this.idMensal
    
            })
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error)
        }
    }

};

module.exports = ServiceVaga