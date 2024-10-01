const {Op, where} = require("sequelize");
const bcrypt = require("bcrypt");
const modelEstacionamento = require("../banco/bancoEstacionamento");
require('dotenv').config()
const jwt = require("jsonwebtoken")
const bancoVaga = require("../banco/bancoVagas")

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
            await this.VerificaDuplicado();
            await this.Crip();

            await modelEstacionamento.create({
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

    async Crip(){
        return new Promise((resolve, reject) => {
            bcrypt.hash(this.senha, 10, (err, hash) => {
                if(err){
                    reject({erro: err, status: false})
                }else{
                    this.senha = hash
                    resolve({erro: false, status: true})
                }
            })
        })
    }

    async VerificaDuplicado(){
        try {
            const estacionamento = await modelEstacionamento.findOne({where: {[Op.or]: [{email: this.email }, {CNPJ: this.CNPJ}]} })
                if (estacionamento == null) {
                    return Promise.resolve()
                } else {
                    return Promise.reject()
                }
        } catch (error) {
            console.error(error); // Log do erro para debugging
            return Promise.reject( new Error("Erro ao verificar duplicados"));
        }        
    }

    
    async validarSenha(){
        try {
            const {id, senha} = await this.buscarIDouEmail();
            const coerente = await bcrypt.compare(this.senha, senha)
            if (coerente) {
                const token = jwt.sign({ email: this.email, idEsta : id }, process.env.SECRET, { expiresIn: '4h' });
                return token;
            } else {
                throw new Error('Senha inválida'); // Lança um erro se a senha não corresponder
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }

    }
    async buscaVagas(idEsta){
        try {
            const res = await modelEstacionamento.findAll({
                attributes: ["numVagasDia", "numVagasMen"], 
                where: {id: idEsta},
                include: [
                    {   model: bancoVaga, 
                        attributes: ["numero"],
                        where: {estacionamentoId: idEsta},
                        required: false
                    }
                ]
            })
            return Promise.resolve(res)
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }

    async buscarIDouEmail(){
        try {
            const res = await modelEstacionamento.findOne({attributes: ["id","senha"], where: {email: this.email}})
            console.log(res)
            return Promise.resolve(res)
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }
}

module.exports =  ServiceEsta