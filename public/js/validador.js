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
                        resolve(dados)
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
                        resolve(dados)
                    } else {
                        reject({status: null, vazios: "Esse CPF ja foi cadastrado"})
                    }
                })
            }
        })
        
    }
}


/* <input class="form-control" type="tel" minlength="8" maxlength="16" id="phone" name="phone"
 placeholder="(11) 9999-9999" onkeypress="mask(this, mphone, $('#country-code').val());"
  onblur="mask(this, mphone, $('#country-code').val());" required="true"></input>
 */

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
            var dadosConferidos = await this.confereValores.Verificar(dadosBrutos)
            var valoresDuplicados = await this.duplicado.validar(dadosConferidos)
            var dadosRegistrados = await this.registrador.criarRegistro(valoresDuplicados)
            return dadosRegistrados
        } catch (error) {
            return error
        }
    }
}

module.exports = new Verificador()


// var veiculo = {
//     categoria: "carro",
//     modelo: "GT",
//     marca: "Ford",
//     placa: "FIB848D9",
//     mensalId: 2,
//     vaga: 5
// }

// const  Validacao = new Verificador()

// async function verificacao(){
//     let veiculoValidado = Validacao.analiseDeDados({"dadosDe": "veiculo", "dados": veiculo}).then(validado =>{
//         console.log(validado)

//         if (validado.hasOwnProperty("status")) {
//             res.send("Voce nao forneceu os seguintes dados: " + validado.vazios)
//         } else {
//           console.log(validado)
//         }
        
//     }).catch(err => {
//         console.log(err)
//     }) 
// }

// verificacao()
