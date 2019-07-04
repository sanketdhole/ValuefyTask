let https = require('https');
let fs = require('fs');
let path = require('path');

let requestData = require('./request-data');
let controller = require('./controller');

let mediumLinks = [];
let allLinks = [];

requestData.requestByLink('https://medium.com')
    .then((result) => {
        // it makes the first request and extract all the links
        allLinks = result.allLinks;
        mediumLinks = result.mediumLinks;
        controller.recursiveControler(allLinks, mediumLinks)
            .then(finalLinkList => {
                fs.writeFile(
                    path.join(__dirname, 'data', 'links.json'),
                    JSON.stringify(finalLinkList), err => {
                        if (err) {
                            console.log(err);
                        }
                    })
            })
            .catch(err => {
                console.log(err);
            })
    })
    .catch(err => {
        console.log(err);
    })

