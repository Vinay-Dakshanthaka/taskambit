const {google} =require('googleapis')
const credentials = require('../config/client_secret_25562083860-n3d7n949u2d9me1gn2skkptik4ktfa96.apps.googleusercontent.com.json')

const auth = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    'http://localhost:3002'
  );

  