const { Op } = require("sequelize");
const bancoClienteMensal = require("../banco/bancoCliMensal")
const bancoVeiculos = require("../banco/veiculos")
const bancoVagas = require("../banco/bancoVagas")
class ServiceMensal{
    constructor(id, idEsta, nome, cpf, telefone, pagaDia, emailEsta) {
        this.id = id
        this.idEsta = idEsta;
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.pagaDia = pagaDia;
        this.emailEsta = emailEsta
    }
    async cadastrar(){

        try {
            const cliente = await bancoClienteMensal.create({
                nome: this.nome, 
                cpf: this.cpf, 
                telefone: this.telefone,
                pagaDia: this.pagaDia, 
                id_estacionamento: this.idEsta})
                return Promise.resolve(cliente.id)
                
        } catch (error) {
            console.log(err)
            return Promise.reject(null)
        }
    }

    async buscarTodos(){
        
        try {
            return await bancoClienteMensal.findAll({where: {id_estacionamento : this.idEsta},
                raw: true, order:[
                    ["id", "DESC"]
                ]
            })
        } catch (error) {
            console.log(error)
            throw error("Erro de no servidor")
        }
    }

    async buscarUnico(){
        
        try {
            return await bancoClienteMensal.findAll(
                {where: {[Op.and]: [{id_estacionamento : this.idEsta}, {id : this.id}]},
                include: [
                    {
                        model : bancoVeiculos, 
                        where: {mensalId: this.id}, 
                        required : false
                    },
                    {
                        model : bancoVagas, 
                        where: {mensalId: this.id}, 
                        required : false
                    }
                ]
            })
        } catch (error) {
            console.log(error)
            throw error("Erro de no servidor")
        }
    }

    //terminar depois
    async DeletarClientr(){
        try {
           await bancoClienteMensal.destroy({
                where: {
                    id : idCliente
                }
            })
        } catch (error) {
            
        }
    }


}

module.exports = ServiceMensal