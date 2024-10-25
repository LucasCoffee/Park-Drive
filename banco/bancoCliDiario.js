const mongoose = require("mongoose");

var ClienteDiarioShema = new mongoose.Schema({
    idEsta: Number,
    placa: String,
    horaEntrada: String,
    horaSaida: String,
    valorPago: Number,
    vaga: Number
})

const ClienteDiario = mongoose.model("diarios", ClienteDiarioShema);


module.exports = ClienteDiario