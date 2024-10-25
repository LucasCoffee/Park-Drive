const bancoDiarios = require("../banco/bancoCliDiario")


class ServiceDiario{
    constructor(idEsta, placa, vaga, horaEntrada, horaSaida, valor){
        this.idEsta = idEsta;
        this.vaga = vaga
        this.placa = placa
        this.horaEntrada = horaEntrada;
        this.horaSaida = horaSaida
        this.valor = valor
    }

    async cadastrar(){
        try {
            return await bancoDiarios.create({idEsta: this.idEsta, placa: this.placa, horaEntrada: this.horaEntrada, horaSaida: this.horaSaida, valorPago: 4, vaga: this.vaga})
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async buscarTodos(){
        try {
            return await bancoDiarios.find({})
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async buscarUnico(){
        try {
            console.log(this.placa)
            return await bancoDiarios.findOne({"placa": this.placa})
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}


module.exports = ServiceDiario