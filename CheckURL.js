const fs = require('fs')
const request = require('request');
const opts = process.argv.slice(2);   //remove the first two arguments 'E:\\Node.js\\node.exe','E:\\DPS909\\releast0.1\\CheckURL.js'
const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g; //from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const regexp = new RegExp(urlR); //match Url using regular expression
const colors = require('colors');
const { rejects } = require('assert');

//if there's no input
if (opts.length == 0) {
    console.log("You didn't enter any argument.");
    console.log("To check current version: --v, --version, /v, /version .");
    console.log("To test URLs: enter filename");
    return process.exit(0);
}

let option = "--good";
let resultList = [];
let result = { url: String, status: Number }

//process with different inputs
if (opts[0].startsWith("--") || opts[0].startsWith("/")) {     //if it's a commnand that start with -- or /
    if (opts[0] == "--v" || opts[0] == "--version" || opts[0] == "/v" || opts[0] == "/version") {
        console.log("Current version: 1.0");
    } else if (opts[0] == "--good" || opts[0] == "/good" || opts[0] == "--bad" || opts[0] == "/bad" || opts[0] == "--all" || opts[0] === "/all") {
        option = opts[0];
        console.log(option)
        opts.shift();
        opts.map(arg => {
            readFile(arg, option);
        })
    } else if (opts[0] == "--j" || opts[0] == "/j" || opts[0] == "--json" || opts[0] == "/json") {

        // let promise1 = new Promise((resolve, reject) => {
        //     if (true) {
        //         printJSON(opts[1])
        //         resolve(resultList)
        //     }
        // })
        // promise1.then((resultList) => {
        //     console.log(resultList);

        // });
        printJSON(opts[1])

    } else if (opts[0] == "--ignore") {
        readUrlsWithoutIgnore(opts[1], opts[2]);
    } else {
        console.log("Invalid input, please enter '--v' for version or filename for testing.");
    }

} else if (fs.existsSync(opts[0]) == false) {               //check if the file exist
    console.log("filename " + opts[0] + " does not exist.")
} else (
    opts.map(arg => {
        readFile(arg, option);
    })
)

function printResult() {
    console.log(resultList)
}

function readUrlsWithoutIgnore(ignoreFile, file) {
    fs.readFile(ignoreFile, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var strData = data.toString();
            var ignoreURLs = strData.match(regexp);
            ignoreURLs = [...new Set(ignoreURLs)];

            fs.readFile(file, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    var strData = data.toString();
                    var URLs = strData.match(regexp);
                    URLs = [...new Set(URLs)];

                    for (let i = 0; i < URLs.length; i++) {
                        let isIgnore = false;
                        for (let j = 0; j < ignoreURLs.length; j++) {
                            if (URLs[i].startsWith(ignoreURLs[j])) {
                                isIgnore = true;
                            }
                        }

                        if (!isIgnore) {
                            request.get({ uri: URLs[i], timeout: 5000 }, function (err, res, body) {
                                if (err) {
                                    console.log(colors.yellow(`${err} ${URLs[i]}`));
                                } else if (res.statusCode == 200) {
                                    console.log("This page is ok: " + URLs[i].green)
                                } else if (res.statusCode == 404 || res.statusCode == 400) {
                                    console.log("Can not find this page: " + URLs[i].red)
                                } else {
                                    console.log("Unkown status: " + URLs[i].grey)
                                }
                            })
                        }
                    }
                }
            })
        }
    })
}

function printJSON(filename) {
    fs.readFile(filename, (err, data) => {                 //read the file
        if (err) {
            console.log(err);
        } else {
            var strData = data.toString();
            var URLs = strData.match(regexp);
            URLs = [...new Set(URLs)];
            URLs.forEach(url => {
                request.get({ uri: url, timeout: 5000 }, function (err, response, body) {
                    if (err) {
                        // console.log("Error encountered: " + url)
                    } else {
                        result.url = url
                        result.status = response.statusCode
                        resultList.push(result)
                        console.log(resultList)
                    }
                })
            })
            printResult()
        }
    })
}

function readFile(filename, opts) {
    fs.readFile(filename, (err, data) => {                 //read the file
        if (err) {
            console.log(err);
        } else {
            var strData = data.toString();
            var URLs = strData.match(regexp);
            URLs = [...new Set(URLs)];
            for (let i = 0; i < URLs.length; i++) {
                request.get({ uri: URLs[i], timeout: 5000 }, function (err, response, body) {
                    if (opts == "--all" || opts == "/all") {
                        if (err) {
                            console.log("Error encountered: " + URLs[i])
                        } else if (response.statusCode == 200) {
                            console.log("This page is ok: " + URLs[i].green)
                        } else if (response.statusCode == 400 || response.statusCode == 404) {
                            console.log("Can not find this page: " + URLs[i].red)
                        } else {
                            console.log("Unkown status: " + URLs[i].grey)
                        }
                    } else if (opts == "--good" || opts == "/good") {
                        if (!err && response.statusCode == 200) {
                            console.log("This page is ok: " + URLs[i].green)
                        }
                    } else if (opts == "--bad" || opts == "/bad") {
                        if (!err && (response.statusCode == 400 || response.statusCode == 404)) {
                            console.log("Can not find this page: " + URLs[i].red)
                        }
                    }
                })

            }

        }
    })
}


