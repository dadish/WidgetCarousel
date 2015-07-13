// js/Carousel/Events.js

define(function (require, exports, module) {
  
  var
    Backbone                      = require('backbone'),
    Config                        = require('./Config'),
    _                             = require('underscore')
  ;

  var
    status = Config.status
  ;

  module.exports = _.extend(Backbone.Events, {

    _slideStatus : status.end

  });

});