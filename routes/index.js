var express = require('express');
var router = express.Router();
var Xero = require('xero');
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var config = require('./../config');

console.log(process.env.XERO_CONSUMER_KEY);
var xero = new Xero(process.env.XERO_CONSUMER_KEY, process.env.XERO_CONSUMER_SECRET, process.env.RSA_PRIVATE_KEY);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	description: 'Luke and pete to make this awesome app'
  });
});

/*POST form to Xero  */
router.post('/invoice', function(req, res, next) {

	var taxType = req.body.payGst == 'on' ? 'OUTPUT2' : 'NONE';
	var now = new Date();
	var invoiceCreated = now.toISOString();
	var dueDate = new Date();
	dueDate.setDate(now.getDate() + config.daysUntilPaymentDue)
	var invoiceDue = dueDate.toISOString();

	var xeroRequest = {
		Type: "ACCREC",
		Contact: {
			Name: req.body.name,
			EmailAddress: req.body.email,
		},
		Date: invoiceCreated,
		DueDate: invoiceDue,
		LineAmountTypes: "Exclusive",
		LineItems: [
			{
				Description: config.invoiceProjectDescription,
				Quantity: 1,
				UnitAmount: req.body.contribution,
				AccountCode: 200,
				TaxType: taxType
			}
		]
	}

	xero.call('POST', '/Invoices', xeroRequest, function(err, json) {
		if (err) {
      console.log(err);
      return res.status(400).json({error: 'Unable to contact Xero'});
    }
    var adminInvoiceNotification = {
    	to: config.xeroAdmin.email,
    	from: config.xeroAdmin.email,
    	subject: 'Email Xero PWYTIW Invoice: ' + config.invoiceProjectDescription,
    	text: 'Please jump into Xero and\n 1. Email Invoice,   \n 2. Approve Invoice.\n\nThis is a stopgap measure, will be automated as soon as Xero extend their API to include email functionality'
    }

    sendgrid.send(adminInvoiceNotification, function(err, json) {
    	if (err) {console.error(err); }
    	console.log('email sent');
    	console.log(json)
    });
    return res.status(200).json(json) //res.json(200, json);
	}); 
	// res.redirect('/');
});

module.exports = router;
