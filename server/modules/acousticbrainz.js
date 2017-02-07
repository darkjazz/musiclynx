var express = require('express');
var couch = require('node-couchdb');

const dbName = "js_div_db";
const max_links = 30;

/*
const startkey = ["Ann"];
const endKey = ["George"];
const viewUrl = "_design/list/_views/by_firstname";

const queryOptions = {
    startkey,
    endkey
};

couch.get(dbName, viewUrl, queryOptions).then(({data, headers, status}) => {
    // data is json response
    // headers is an object with all response headers
    // status is statusCode number
}, err => {
    // either request error occured
    // ...or err.code=EDOCMISSING if document is missing
    // ...or err.code=EUNKNOWN if statusCode is unexpected
});
*/
