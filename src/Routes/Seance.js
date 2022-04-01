const express = require('express');
const soap = require('soap');
const JSON5 = require('json5');
require('dotenv').config();


const seanceRouter = express.Router()
const url = process.env.WSDL_URL || ''

seanceRouter.route('/room/:codicesala')
    .all((req, res) => {
      var codicesala = req.params.codicesala;
      var args = {req:
        {
          utente: process.env.SOAP_SERVER,
          password: process.env.SOAP_PASS,
          cassa: process.env.SOAP_CASSA,
          idSala: codicesala
          
        }
    };
    soap.createClient(url, function(err, client) {
      client.caricaDettaglioSala(args, function(err, result) {
          res.json(result.caricaDettaglioSalaResult.dettaglioSala.settori[0].posti);
        });
      //client.stampaTitoli(args, function(err, result) {
        //let description = client.describe()
        //res.send(description);
      //});
    });
        
    })
module.exports = seanceRouter;
