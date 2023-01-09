
 function relatorioProcess(){

    const bancoClienteMensal = require("../banco/bancoCliMensal");

    var relatorio = {
        clieTotal: 0,
        pagaEmDia: 0,
        pagaAtrad: 0,
    }

    return new Promise((resolve, reject) => {
        bancoClienteMensal.findAll().then(clienteAtrasados => {

            relatorio.clieTotal = clienteAtrasados.length
    
            clienteAtrasados.forEach(element => {    
                if (element["pagaStatus"] == "true") {
                    relatorio.pagaEmDia ++;
                } else {
                    relatorio.pagaAtrad ++;
                }
            });
            resolve(relatorio)
        });
    });    
}   

module.exports = relatorioProcess()