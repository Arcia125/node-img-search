'use strict';
const express = require('express');
const app = express();
const path = require('path');
const request = require('request');

const config = require('./config');
const db = require('./db');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/search/:search', (req, res) => {
	console.log(`A search was made for ${req.params.search}.`);
    let reqURI = `https://api.imgur.com/3/gallery/search${req.query.offset ? '/' + req.query.offset : ''}/?q=${req.params.search}`;
    request({
    	method: 'GET',
    	uri: reqURI,
    	headers: {
    		'Authorization': 'Client-ID 5cbe4ae69308c51'
    	}
    },
	(error, response, body) => {
    	if(error) {
    		console.log(error);
    	} else if (response.statusCode >= 200 && response.statusCode <= 300) {
    		let searchHistory = db.get().collection('search-history');
    		searchHistory.insertOne({
    			search_term: req.params.search, time_searched: new Date().toISOString()
    		},
    		(err, mongoRes) => {
    			if (err) {
    				console.log(err);
    			}
    		});
    		let bodyData = JSON.parse(body).data;
    		res.send(bodyData.map(imgObj => {
    			let newImgObj = {
    				url: imgObj.link,
    				title: imgObj.title,
    				image_poster: imgObj.account_url,
    				views: imgObj.views,
    				up_votes: imgObj.ups,
    				down_vowns: imgObj.downs,
    				score: imgObj.score,
    				time: imgObj.datetime
    			};
    			return newImgObj;
    		}));
    	}
    });
});

app.get('/api/history', (req, res) => {
	console.log('History Requested');
	let searchHistory = db.get().collection('search-history');
	searchHistory.find().sort({ _id: -1 }).limit(10).toArray((err, docs) => {
		if (err) {
			throw err;
		}
		res.send(docs);
	});
});

db.connect(config.db.url, function(err) {
    if (err) {
        console.log('Unable to connect to Mongodb.');
        throw err;
        process.exit(1);
    } else {
        app.listen(config.port, () => {
            console.log(`App listening on port ${config.port}`);
        });
    }
});
