require('dotenv').config()

const express = require('express');
const soap = require('soap');
const eventRouter = express.Router()
const url = process.env.WSDL_URL || ''

eventRouter.route('/list/:codiceevento')
    .all((req, res) => {
      var codiceevento = req.params.codiceevento;
      var rows = []
      var args = {req:
        {
          utente: process.env.SOAP_SERVER,
          password: process.env.SOAP_PASS,
          cassa: process.env.SOAP_CASSA,
          filtri: {
            attributes: {
                      xsi_type: {
                          type: 'FiltroEventoCodice',
                          xmlns: process.env.XMLNS_URL
                        }
                      },
                      ':codice' : codiceevento
          }
        }
      };
      soap.createClient(url, (err, client) => {
        client.caricaListaEventiAsync(args).then( async(result) => {
          // console.log(result[0])
          await Promise.all(result[0].caricaListaEventiResult.eventi.map((recita, index) => {
            var argsEvent = {
              req: {
                utente: process.env.SOAP_SERVER,
                password: process.env.SOAP_PASS,
                cassa: process.env.SOAP_CASSA,
                idEvento: recita.id
              }
            };
            return client.caricaDettaglioEventoAsync(argsEvent).then((resultEvent) => {
              result[0].caricaListaEventiResult.eventi[index].posti = resultEvent[0].caricaDettaglioEventoResult.dettaglioEvento.fasce[0].posti;
              result[0].caricaListaEventiResult.eventi[index].ordini = resultEvent[0].caricaDettaglioEventoResult.dettaglioEvento.ordiniPosto;
              // console.log(result.caricaListaEventiResult.eventi[i])
              // rows.push(result[0].caricaListaEventiResult.eventi[index])
              
              //result.caricaListaEventiResult.eventi[i].ordini = resultEvent.caricaDettaglioEventoResult.dettaglioEvento.ordiniPosto;
            });
          }));
          res.json(result[0].caricaListaEventiResult);
        })
      });
    })
eventRouter.route('/seats/:codicerecita')
    .all((req, res) => {
      var codicerecita = req.params.codicerecita;
      var args = {req:
        {
          utente: process.env.SOAP_SERVER,
          password: process.env.SOAP_PASS,
          cassa: process.env.SOAP_CASSA,
          idEvento: codicerecita
        }
      };
      try {
        soap.createClient(url,{wsdl_options: {timeout: 1000}}, function(err, client) {
        if(client) {
          client.caricaDisponibilitaEvento(args, function(err, result) {
          res.json(result);
          });
        } else {
          res.json({});
        }
        //client.stampaTitoli(args, function(err, result) {
          //let description = client.describe()
          //res.send(description);
        //});
        });
      } catch (err) {
          console.log(err);
          res.json({})
      }
    })

eventRouter.route('/ranges/:codicerecita')
    .all((req, res) => {
      var codicerecita = req.params.codicerecita;
    var args = {req:
      {
        utente: process.env.SOAP_SERVER,
        password: process.env.SOAP_PASS,
        cassa: process.env.SOAP_CASSA,
        idEvento: codicerecita
      }
    };
    soap.createClient(url, function(err, client) {
      client.caricaDettaglioEvento(args, function(err, result) {
        res.json([result.caricaDettaglioEventoResult.dettaglioEvento.fasce[0].posti,result.caricaDettaglioEventoResult.dettaglioEvento.ordiniPosto]);
        });
      //client.stampaTitoli(args, function(err, result) {
        //let description = client.describe()
        //res.send(description);
      //});
    });
        
    })
module.exports = eventRouter;
