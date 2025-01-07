const CarAPI = require("./server/cars");
const AuthAPI = require("./server/auth");
const UserAPI = require('./server/users');
const express = require('express');

function initialize() {
    let api = express();

    api.use('/userManagement', UserAPI());
    api.use('/carros', CarAPI());
    api.use('/auth', AuthAPI());

    return api;
}

module.exports = {
    initialize: initialize,
};