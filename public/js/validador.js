const bancoClienteMensal = require("../../banco/bancoCliMensal");
const bancoVeiculos = require("../../veiculos/veiculos");

class ConfereValores{

    Verificar(elemento){
            
        let elementoNUll = []

        return new Promise((resolve, reject) => {

            for (const key in elemento) {
                if (elemento[key] == null || elemento[key] == "") {
                    elementoNUll.push(key)
                }
            }

            if (elementoNUll.length == 0 ) {
                resolve(elemento)
            } else {
                reject({status: null, vazios : elementoNUll})
            }
        })
    }
}

class VerificarValoresDublicados{
    validar(dados){

      return  new Promise((resolve, reject) => {
            if (dados.dadosDe == "veiculo") {
                bancoVeiculos.findOne({
                    where: {placa: dados.dados.placa}
                }).then(veiculo => {
                    if(veiculo == undefined){
                        resolve(dados.dados)
                    } else {
                        reject({status: null, vazios: "A placa desse veiculo já foi cadastrada"})
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else if(dados.dadosDe == "mensal") {
                bancoClienteMensal.findOne({
                    where: {cpf: dados.dados.cpf}
                }).then(cliente => {
                    if (cliente == undefined) {
                        resolve(dados.dados)
                    } else {
                        reject({status: null, vazios: "Esse CPF ja foi cadastrado"})
                    }
                })
            }
        })
        
    }
}
class RegistrarNoBanco{

    criarRegistro(dados){

        return  new Promise((resolve, reject) => {

            for (const key in dados) {
                if (key == "nome") {

                    bancoClienteMensal.create(dados)
                    .then((res) => {
                        console.log('Cadastrado com sucesso');
                        resolve(res)
                    }).catch((err) => {
                        console.log("Sync error")
                        reject(null)
                    });
                    
                } else if(key == "modelo"){
                    bancoVeiculos.create(dados)
                    .then((res) => {
                        console.log('Cadastrado com sucesso');
                        resolve(res)
            
                    }).catch((err) => {
                        console.log("Sync error")
                        reject(null)
                    });
                }
           }
        })
    }
}


class Verificador{
    constructor(){
        this.confereValores = new ConfereValores()
        this.registrador = new RegistrarNoBanco()
        this.duplicado = new VerificarValoresDublicados()
    }

    async analiseDeDados(dadosBrutos){

        try {
            var dadosConferidos = await this.confereValores.Verificar(dadosBrutos.dados)
            var valoresDuplicados = await this.duplicado.validar(dadosBrutos)
            var dadosRegistrados = await this.registrador.criarRegistro(valoresDuplicados)
            return dadosRegistrados
        } catch (error) {
            console.log(error)
            
            return error
        }
    }
}

module.exports = new Verificador()

