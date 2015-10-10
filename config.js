//REM: module.exports is the way we pass info back and forth between js files!
//module.exports at beginning of app is {}, but after we use require() and add
//properties to the exports{} object, we fill the object with useful data and settings

module.exports = {
	'port' : process.env.PORT || 8080, // set the port for our app
	'secret' : 'superSecretPasswordsecretThing', //used in creation of JWT tokens
   // 'database' : 'mongodb://localhost:27017/nodeAPI', //local only
   'database' : 'mongodb://kmorton:kmorton@ds051943.mongolab.com:51943/crm_database'
   
}