exports.getLinks = (stringData) => {
    // This function extracts the links from the document
    // It takes string as argument and returns two lists
    // foundLinks - It provides all the links to be stored in the file
    // mediumLinks - It provides the links which can be used to get next pages
    let pattern = /(http|ftp|https):\/\/([\w-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&\~+#-])?/gm
    let p;
    let result = {};
    result.foundLinks = [];
    result.mediumLinks = [];
    do {
        p = pattern.exec(stringData);
        if (p) {
            if (p[0].match(/(.*)medium.com(.*)/)) {
                if (result.mediumLinks.indexOf(p[0]) < 0) {
                    result.mediumLinks.push(p[0]);
                }
            }
            if (result.foundLinks.indexOf(p[0]) < 0) {
                result.foundLinks.push(p[0]);
            }
        }
    } while (p);
    return result;
}