const modelEsta = require("../banco/bancoEstacionamento")
const {Op} = require("sequelize")

class ServiceEsta{
    constructor(CNPJ, email, senha, nome, numVagasDia, numVagasMen, valorDiario, valorMensal){
        this.CNPJ = CNPJ,
        this.email = email,
        this.senha = senha,
        this.nome =  nome,
        this.numVagasDia = numVagasDia,
        this.numVagasMen = numVagasMen,
        this.valorDiario = valorDiario,
        this.valorMensal = valorMensal
    }
    //cadastro
    async Cadastro(){
        try {
            await this.VerificaDuplicado()
            await modelEsta.create({
                CNPJ: this.CNPJ,
                email: this.email,
                senha: this.senha,
                nome: this.nome,
                numVagasDia: this.numVagasDia,
                numVagasMen: this.numVagasMen,
                valorDiario: this.valorDiario,
                valorMensal: this.valorMensal
            });

            return { Mensagem: "Cadastro realizado com sucesso" };
            
        } catch (error) {
            console.log(error)
            return Promise.reject({Mensagem: "Erro no cadastro"})
        }
    }

    async VerificaDuplicado(){
        try {
            const estacionamento = await modelEsta.findOne({where: {[Op.or]: [{email: this.email }, {CNPJ: this.CNPJ}]} })
                if (estacionamento == null) {
                    return Promise.resolve()
                } else {
                    return Promise.resolve()
                }
        } catch (error) {
            console.error(error); // Log do erro para debugging
            return Promise.reject( new Error("Erro ao verificar duplicados"));
        }        
    }

//login

//update
    buscarID(){

    }
}

module.exports =  ServiceEsta