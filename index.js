let https = require('https');
let fs = require('fs');
let path = require('path');

let requestData = require('./request-data');
let controller = require('./controler');

let mediumLinks = [];
let allLinks = [];

requestData.requestByLink('https://medium.com')
    .then((allLinksTemp, mediumLinksTemp) => {
        allLinks = allLinksTemp;
        mediumLinks = mediumLinksTemp;
        controller.controler(allLinks, mediumLinks)
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

