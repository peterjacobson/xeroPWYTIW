var express = require('express');
var router = express.Router();
var Xero = require('xero');

var config = require('./../config');

var xero = new Xero(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, process.env.RSA_PRIVATE_KEY);

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
    return res.status(200).json(json) //res.json(200, json);
	}); 
	// res.redirect('/');
});

module.exports = router;
