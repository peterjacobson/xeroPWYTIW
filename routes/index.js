var express = require('express');
var router = express.Router();
var Xero = require('xero');

var xero = new Xero(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	description: 'Luke and pete to make this awesome app'
  });
});

/*POST form to Xero  */
router.post('/invoice', function(req, res, next) {
	var xeroRequest = {
		Invoice: {
			Type: "ACCREC",
			Contact: {
				ContactID: "",
			},
			DueDate: "",
			LineItems: [
				{
					Description: "",
					Quantity: "",
					UnitAmount: "",
					AccountCode: "",
				}
			],
			Status: "AUTHORISED",
		}
	}
	console.log('hihi');
	xero.call('POST', 'https://api.xero.com/api.xro/2.0/Invoices', xeroRequest, function(err, json) {
		if (err) {
      log.error(err);
      return res.json(400, {error: 'Unable to contact Xero'});
    }
    console.log(res);
    return res.json(200, json);
	}); 
	res.redirect('/');
});

module.exports = router;
