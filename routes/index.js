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
  	description: 'The Enspiral foundation cobudget process'
  });
});

/*POST form to Xero  */
router.post('/invoice', function(req, res, next) {
	createXeroInvoice(req, emailAdminToEmailInvoiceToClient)
	res.redirect('/thanks');
});

/* GET thank you page. */
router.get('/thanks', function(req, res, next) {
  res.render('thanks');
});



function createXeroInvoice(req, notifyAdminByEmailOnSuccess) {

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
				AccountCode: config.invoiceAccountNumber,
				TaxType: taxType
			}
		]
	}

	xero.call('POST', '/Invoices', xeroRequest, function(err, json) {
		if (err) {
      console.log(err);
      return res.status(400).json({error: 'Unable to contact Xero'});
    }
    res = notifyAdminByEmailOnSuccess()
	}); 
}

function emailAdminToEmailInvoiceToClient() {

	var adminInvoiceNotification = {
  	to: config.xeroAdmin.email,
  	from: config.xeroAdmin.email,
  	subject: 'Email Xero PWYTIW Invoice: ' + config.invoiceProjectDescription,
  	text: "Kia ora!\nPretty please jump into Xero and\n 1. Email this new unapproved invoice to the contributor (just hit the email button on the invoice),   \n 2. Approve Invoice (so we know it's been emailled)\n\nThis is a stopgap measure, will be automated as soon as Xero extend their API to include email functionality\nNga mihi,\n\nLuke & Pete\npete.jacobson@enspiral.com"
  }
  sendgrid.send(adminInvoiceNotification, function(err, json) {
  	if (err) {console.error(err); }
  	console.log('email sent');
  	console.log(json)
  });
  // return res.status(200).json(json) //res.json(200, json);
}

module.exports = router;
