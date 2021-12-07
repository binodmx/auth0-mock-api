const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

var access_token = '';
var client_secret = '';

function generateAccessToken() {
    if (access_token == '') {
        var iat = Math.floor(Date.now() / 1000);
        var exp = iat + 86400;
        access_token = jwt.sign(`{"iss":"http://localhost:3000/","sub":"sub1@clients","aud":"https://localhost:9443","iat":${iat},"exp":${exp},"azp":"client1","scope":"default","gty":"client-credentials"}`, 'auth0-mock');
    }
}

function generateClientSecret() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    for (var i = 0; i < 64; i++) {
        client_secret += characters.charAt(Math.floor(Math.random() * 64));
    }
}

app.get('/test', (req, res) => {
    process.stdout.write("[GET] /test called\n");
    res.send('{message: "/test"}\n');
});

app.get('/.well-known/openid-configuration', (req, res) => {
    process.stdout.write("[GET] /.well-known/openid-configuration called\n");
    var getOpenIdConfiguration = JSON.parse(fs.readFileSync('getOpenIdConfigurationResponse.json', 'utf8'));
    res.send(getOpenIdConfiguration);
});

app.post('/api/v2/clients', (req, res) => {
    process.stdout.write("[POST] /api/v2/clients called\n");
    generateClientSecret();
    var createApplicationResponse = JSON.parse(fs.readFileSync('createApplicationResponse.json', 'utf8').toString().replace('<client_secret>', client_secret));
    res.send(createApplicationResponse);
});

app.get('/api/v2/clients/client1', (req, res) => {
    process.stdout.write("[GET] /api/v2/clients/client1 called\n");
    var getApplicationResponse = JSON.parse(fs.readFileSync('getApplicationResponse.json', 'utf8').toString().replace('<client_secret>', client_secret));
    res.send(getApplicationResponse);
});

app.patch('/api/v2/clients/client1', (req, res) => {
    process.stdout.write("[PATCH] /api/v2/clients/client1 called\n");
    var updateApplicationResponse = JSON.parse(fs.readFileSync('updateApplicationResponse.json', 'utf8').toString().replace('<client_secret>', client_secret));
    res.send(updateApplicationResponse);
});

app.post('/api/v2/client-grants', (req, res) => {
    process.stdout.write("[POST] /api/v2/client-grants called\n");
    var createClientGrantResponse = JSON.parse(fs.readFileSync('createClientGrantResponse.json', 'utf8'));
    res.send(createClientGrantResponse);
});

app.get('/api/v2/client-grants', (req, res) => {
    process.stdout.write("[GET] /api/v2/client-grants called\n");
    var getClientGrantResponse = JSON.parse(fs.readFileSync('getClientGrantResponse.json', 'utf8'));
    res.send(getClientGrantResponse);
});

app.post('/oauth/token', (req, res) => {
    process.stdout.write("[POST] /oauth/token called\n");
    generateAccessToken();
    var getAccessTokenResponse = JSON.parse(fs.readFileSync('getAccessTokenResponse.json', 'utf8').toString().replace('<access_token>', access_token));
    res.send(getAccessTokenResponse);
});

app.listen(port, () => console.log(`Auth0 mock API is running on port ${port}!`))
