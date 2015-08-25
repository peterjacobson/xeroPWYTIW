var express = require('express');
var router = express.Router();
var Xero = require('xero');

var xero = new Xero(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, process.env.RSA_PRIVATE_KEY);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	description: 'Luke and pete to make this awesome app'
  });
});

/*POST form to Xero  */
router.post('/invoice', function(req, res, next) {
	var xeroRequest = {
			Type: "ACCREC",
			Contact: {
				Name: "Luke",
			},
			Date: "2015-08-25",
			DueDate: "2015-08-25",
			LineAmountTypes: "Exclusive",
			LineItems: [
				{
					Description: "Buns",
					Quantity: 2,
					UnitAmount: 3,
					AccountCode: 200,
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
