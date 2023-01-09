const e = require("express");
const bancoVeiculos = require("./veiculos");

function confereValores(veiculo){

    let elementoNUll = []

    return new Promise((resolve, reject) => {
        if (veiculo != null) {
            for (const key in veiculo) {
                if (veiculo[key] == null || veiculo[key] == "") {
                    elementoNUll.push(key)
                }
            }
        } else {
                reject(veiculo + "Objeto sem nenhum valor")
        }

        if (elementoNUll.length == 0 ) {
            resolve(veiculo)
        } else {
            reject(elementoNUll)
        }

    })

};

function criarRegistroVeiculo(valoresConferido){
    return new Promise((resolve, reject) => {

        bancoVeiculos.create({
            categoria: valoresConferido.categoria,
            modelo: valoresConferido.modelo,
            marca: valoresConferido.marca,
            placa: valoresConferido.placa,
            mensalId: valoresConferido.mensalId 
            }).then((veiculo) => {
            resolve("cliente: " + veiculo.modelo + "adicionado com sucesso")
        }).catch((error) => {
            console.log(error)
            reject("erro ao registrar veiculo")
        })

    })
}

async function main(veiculo){

    try {
        let valoresConferido = await confereValores(veiculo)
        let veiculoCriado = await criarRegistroVeiculo(valoresConferido)
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = main