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

let newActiveConnections = 0;
let allLinksGlobal = [];
let numberOfLinksToCheck = 10; // number of links to be checked.
let linkCounter = 0;
let linksResolved = 0;
exports.recursiveControler = (allLinks, mediumLinks) => {
    return new Promise((resolve, reject) => {
        var recursiveMethod = (mediumLinks) => {
            //This is the recursive method which will take medium link list as argument
            //It makes the recursive call by removing one links 
            //and pass other links to next call
            if (newActiveConnections < 5) {
                if (mediumLinks.length && linkCounter < numberOfLinksToCheck) {
                    //there are links and make recursive call at the end
                    requestData.requestByLink(mediumLinks.pop())
                        .then((result) => {
                            allLinksGlobal = [...allLinksGlobal, ...result.allLinks];
                            newActiveConnections--;
                            linksResolved++;
                            if (linksResolved === numberOfLinksToCheck) {
                                resolve(allLinksGlobal);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    newActiveConnections++;
                    linkCounter++;
                    recursiveMethod(mediumLinks);
                }
            }
            else {
                setTimeout(() => {
                    recursiveMethod(mediumLinks);
                }, 100)
            }
        }
        allLinksGlobal = [...allLinks];
        recursiveMethod(mediumLinks);
    });

}
