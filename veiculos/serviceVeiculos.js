const modelVeiculos = require('../banco/veiculos')
const vagaService = require("../Vaga/vagaService")
class ServiceVeiculo{
    constructor(idMensal, idVaga, placa, modelo, marca, categoria  ){
        this.idMensal = idMensal,
        this.idVaga = idVaga,
        this.placa = placa,
        this.modelo = modelo,
        this.marca = marca,
        this.categoria = categoria
    }

    async cadastrar(){
        try {
            await modelVeiculos.create({
                    categoria: this.categoria,
                    modelo: this.modelo, 
                    marca: this.marca,
                    placa: this.placa,
                    mensalId: this.idMensal,
                    vagaId: this.idVaga
            })
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)

        }
    }

}

module.exports = ServiceVeiculo