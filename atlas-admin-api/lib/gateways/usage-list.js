'use strict';

var config = require('../../config');
var common = require('../../common');
var Logstash = require('../services/logstashProvider');
var qs = require('querystring');
var express = require('express');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;

function UsageList() {
  var router = express.Router();

  router.route('/:timePeriod').get(function (req, res) {
    var isAdmin = (common.user.role === 'admin')? true : false;
    
    if (!isAdmin) {
      res.end(JSON.stringify(common.errors.not_permitted));
      return;
    }

    var timePeriod = req.params.timePeriod;

    Logstash.search.top_usage(timePeriod).then(function (data) {
      console.log('data', data);
      res.end(data);
    }, function (error) {
      res.end(error);
    });
  });

  return router;
}

module.exports = UsageList;
