const bancoClienteMensal = require("../banco/bancoCliMensal");
const bancoVaga = require("../banco/bancoVagas");

function validacao(dadosClientes){
    
    let elementoNUll = []

    return new Promise((resolve, reject) => {
        if (dadosClientes != null) {
            for (const key in dadosClientes) {
                if (dadosClientes[key] == undefined || dadosClientes[key] == "" || dadosClientes[key] == "0") {
                    elementoNUll.push(key)
                }
            }
        } else {
            reject(dadosClientes + "Valores nulo")
        }

        if (elementoNUll.length > 0 ) {
            reject(elementoNUll)
        } else {
            resolve(dadosClientes)
        }
    })
};

function registroCliente(dadosValidados){

    console.log(typeof(dadosValidados))
    console.log(dadosValidados)

    return  new Promise((resolve, reject) => {
    
        bancoClienteMensal.create(dadosValidados)
        .then((clientes) => {
            console.log('Cliente cadastrado com sucesso');
            resolve(clientes)

            }).catch((err) => {
                console.log("Sync error")
                reject(null)
        });
    })
}

function marcacaoVaga(){

    bancoVaga.findOne({
        where: {
            status : true
        }
        }).then(vagaAchada => {
            bancoVaga.findByPk(vagaAchada.id).then(vagaAtu => {
                vagaAtu.update(
                    {status : false }
                )
            })
        })
}

async function main(dadosClientes) { 

    try {
        let dadosValidados = await validacao(dadosClientes)
        let clienteCriado = await registroCliente(dadosValidados)
        return {
            status: true,
            cliente: clienteCriado
        }
    
    } catch (error) {
        let res = {
            status : false,
            invalidos: error
        }
        return(res)
    }
};


module.exports = main