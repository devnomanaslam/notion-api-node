const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db_url = process.env.DATABASE_URL;
const token_url = process.env.TOKEN_URL;

// get token from notion
app.post('/api/notion/token', (req, res) => {
    const tokenRequestBody = req.body;

    let data = JSON.stringify(tokenRequestBody);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: token_url,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Basic ${tokenRequestBody.client_id}:${tokenRequestBody.client_secret}`
            'Authorization': `Basic ${Buffer.from(`${tokenRequestBody.client_id}:${tokenRequestBody.client_secret}`).toString('base64')}`
        },
        data: data
    };
    axios.request(config)
        .then((response) => {
            res.status(200).json({
                message: 'Token received successfully.',
                response: response
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
                message: error.message
            });
        });

});


// get database from motion
app.post('/api/notion/database', (req, res) => {
    const tokenObject = req.body;
    const token = tokenObject.token;

    let config = {
        method: 'post',
        url: db_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };

    axios.request(config)
        .then((response) => {
            res.status(200).json({
                message: 'successfully.',
                response: response
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
                message: error.message
            });
        });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
