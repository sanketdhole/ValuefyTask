let https = require('https');
let linkExtractor = require('./extract-links');

exports.requestByLink = (link) => {
    //This function takes the url as an argument
    // And returns new promise, which after resolving will give links on that page
    // It also provides links from medium.com domain
    return new Promise((resolve, reject) => {
        https.get(link, res => {
            let allLinks = [];
            let mediumLinks = [];
            let docTypeCheck = false;
            res.on('data', chunk => {
                chunk = chunk.toString();
                if (chunk.match('html')) {
                    docTypeCheck = true;
                }
                if (docTypeCheck) {
                    let result = linkExtractor.getLinks(chunk);
                    allLinks = [...allLinks, ...result.foundLinks];
                    mediumLinks = [...mediumLinks, ...result.mediumLinks];
                }
            });
            res.on('end', result => {
                resolve(allLinks, mediumLinks);
            })
        })
    })
}