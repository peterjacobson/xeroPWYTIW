# xeroPWYTIW
a user can Pay What They Think It's Worth for a service and be sent an email invoice for that amount by Xero

# Configuration
you'll need to 
- [ ] [generate your own public/private key pair (RSA x.509 certificate)](http://developer.xero.com/documentation/advanced-docs/public-private-keypair/#title3)
- [ ] [create a Xero PRIVATE app](http://developer.xero.com/) if you don't already have one, using the RSA x.509 certificate (put the public key in at Xero app creation)
- [ ] add these keys to Heroku with the heroku toolbelt
    + [ ] ``` heroku config:set XERO_CONSUMER_KEY:yourkeyfromXeroApp``` 
    + [ ] ``` heroku config:set XERO_CONSUMER_SECRET:yoursecretfromXeroApp``` 
    + [ ] ``` heroku config:set RSA_PRIVATE_KEY:"-----BEGIN PRIVATE KEY-----\nyourkeythatyoumadewiththatcommandLine\n-----END PRIVATE KEY-----``` 
- [ ] update /config.js

nice one

