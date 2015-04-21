var JWT   = require('jsonwebtoken');  // used to sign our content
var aguid = require('aguid');
var ES    = require('esta');
var redisClient = require('./redis_connection');


module.exports = function sign(request, callback) {
  // payload is the object that will be signed by JWT below
  var payload = { jti : aguid() }; // v4 random UUID used as Session ID below

  if (request.payload && request.payload.email) {
    payload.person = aguid(request.payload.email);
  } // see: http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#issDef
  else { // no email is set (means an anonymous person)
    payload.person = "anonymous";
  } // this will need to be extended for other auth: http://git.io/pc1c

  var token = JWT.sign(payload, process.env.JWT_SECRET); // http://git.io/xPBn

  var session = {   // set up session record for inserting into ES
    index: process.env.ES_INDEX,
    type:  "session",
    id  :  payload.jti,
    person: payload.person,
    ua: request.headers['user-agent'],
    created: new Date().toISOString()
  }
  redisClient.set(session.id, JSON.stringify(session))
  // redisClient.end();
  ES.CREATE(session, function(esres) {
    // creating the session in ES as a fallback
  });
  return callback(token, session);
}
