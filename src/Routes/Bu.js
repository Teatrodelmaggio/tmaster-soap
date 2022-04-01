const express = require('express');
const soap = require('soap');
require('dotenv').config()

const buUserRouter = express.Router()
const url = process.env.WSDL_URL || ''

buUserRouter.route('/register')
    .post((req, res) => {
		var args = {req:
			{
				utente: process.env.SOAP_SERVER,
        password: process.env.SOAP_PASS,
        cassa: process.env.SOAP_CASSA,
				consentiSalvataggioParziale: '',
				anagrafiche: {
					cognome : req.body.cognome,
					nome : req.body.nome,
					telCell: req.body.telCell,
					telAltro: req.body.telAltro,
					mail1: req.body.mail1,
					sesso: req.body.sesso,
					stato: req.body.stato,
					citta: req.body.citta,
					provincia: req.body.provincia,
					indirizzo: req.body.indirizzo,
					cap: req.body.cap,
					azienda: req.body.azienda,
					indirizzo: req.body.indirizzo,
					piva: req.body.piva,
					cf: req.body.cf,
					rappresentanteFiscale: {
						cognome : req.body.cognome,
						nome : req.body.nome
					},
					sistemaOrigine: process.env.SOAP_ORIGIN,
					idSistemaOrigine: ''
				}
			}
		};
		soap.createClient(url, function(err, client) {
			client.salvaAnagrafiche(args, function(err, result) {
				res.json(result);   	
	    	});
		  //client.stampaTitoli(args, function(err, result) {
		    //let description = client.describe()
		    //res.send(description);
		  //});
		});
        
    })
buUserRouter.route('/update')
    .post((req, res) => {
		var args = {req:
			{
				utente: process.env.SOAP_SERVER,
        password: process.env.SOAP_PASS,
        cassa: process.env.SOAP_CASSA,
				consentiSalvataggioParziale: '',
				anagrafiche: {
					id: req.body.bu_user_id,
					cognome : req.body.cognome,
					nome : req.body.nome,
					telCell: req.body.telCell,
					telAltro: req.body.telAltro,
					mail1: req.body.mail1,
					sesso: req.body.sesso,
					stato: req.body.stato,
					citta: req.body.citta,
					provincia: req.body.provincia,
					indirizzo: req.body.indirizzo,
					cap: req.body.cap,
					azienda: req.body.azienda,
					indirizzo: req.body.indirizzo,
					piva: req.body.piva,
					cf: req.body.cf,
					azienda: req.body.azienda,
					rappresentanteFiscale: {
						cognome : req.body.cognome,
						nome : req.body.nome
					},
					sistemaOrigine: process.env.SOAP_ORIGIN,
					idSistemaOrigine: ''
				}
			}
		};
		soap.createClient(url, function(err, client) {
			client.salvaAnagrafiche(args, function(err, result) {
				res.json(result);
	        	
	    	});
		  //client.stampaTitoli(args, function(err, result) {
		    //let description = client.describe()
		    //res.send(description);
		  //});
		});
        
    })
buUserRouter.route('/tokenlink/:buUserId/:link')
    .all((req, res) => {
		//soap.createClient(url, function(err, client) {
		soap.createClient(url, function(err, client) {
			var buUserId = req.params.buUserId;
			var link = req.params.link;
			link = decodeURIComponent(link.replace(/\+/g, ' '));
			client.generaTokenSSO(
				{req:
					{
						utente: process.env.SOAP_SERVER,
						password: process.env.SOAP_PASS,
						cassa: process.env.SOAP_CASSA,
						idAnagrafica: buUserId
					}
				}, function(err, result) {
					res.send(link+'&ssoToken='+result.generaTokenSSOResult.token);
			});
		});  
		})
module.exports = buUserRouter;
