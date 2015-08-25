var express = require('express');
var router = express.Router();
var Xero = require('xero');

var xero = new Xero(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
console.log(xero);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	description: 'Luke and pete to make this awesome app'
  });
});

/*POST form to Xero  */
router.post('/invoice', function(req, res, next) {
	var invoiceData = {
		Type: xero.Invoices.SALE,
		Contact: {
			Name: 'Luke Kavanagh'
		},
		Date: new Date(),
		DueDate: '2015-08-23',
		LineAmountTypes: xero.Invoices.EXCLUSIVE,
		LineItems: [
			{
				Description: "Buns",
				Quantity: 18,
				UnitAmount: 120,
				AccountCode: 200,
			}
		]
	};
	console.log('hihi');
	xero.Invoices.create(invoiceData, function (err, invoice) {
	  if (err) {
	    res.json(err);
	  }
	  console.log(res);
	  res.json(null, invoice);
	});
	// xero.call('POST', 'https://api.xero.com/api.xro/2.0/Invoices', xeroRequest, function(err, json) {
	// 	if (err) {
 //      log.error(err);
 //      console.log(err);
 //      return res.json(400, {error: 'Unable to contact Xero'});
 //    }
 //    console.log(res);
 //    return res.json(200, json);
	// }); 
	res.redirect('/');
});

module.exports = router;
