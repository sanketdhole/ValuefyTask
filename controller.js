let requestData = require('./request-data');
let fs = require('fs');

exports.controler = (allLinks, mediumLinks) => {
    //This function takes the allLinks list to be used to add other links.
    // mediumLinks is list of links which contains medium.com as domain
    //It returns new promise which is resolved when all the links are collected.
    return new Promise((resolve, reject) => {
        let activeConnections = 0;
        let linkCounter = 0;
        while (linkCounter !== mediumLinks.length) {
            if (activeConnections < 5 && (linkCounter - 1 !== mediumLinks.length)) {
                requestData.requestByLink(mediumLinks[linkCounter])
                    .then((newAllLinks, newMediumLinks) => {
                        activeConnections--;
                        allLinks = [...allLinks, ...newAllLinks];
                    }
                    ).catch(err => {
                        console.log(err)
                    })
                linkCounter++;
                activeConnections++;
            }
            else if ((linkCounter - 1) === mediumLinks.length) {
                requestData.requestByLink(mediumLinks[linkCounter])
                    .then((newAllLinks, newMediumLinks) => {
                        activeConnections--;
                        allLinks = [...allLinks, ...newAllLinks];
                        resolve(allLinks);
                    }
                    ).catch(err => {
                        console.log(err)
                    })
            }
        }
    })
}
