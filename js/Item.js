// js/Carousel/Item.js

define(function (require, exports, module) {
  
  var
    Backbone                      = require('backbone'),
    Config                        = require('./Config'),
    Events                        = require('./Events'),
    _                             = require('underscore')
  ;

  var
    status = Config.status,
    direction = Config.direction,
    animation = Config.animation
  ;

  module.exports = Backbone.View.extend({

    attachEvents : function () {
      this.listenTo(Events, 'slide:in', this.slideIn);
      this.listenTo(Events, 'slide:out', this.slideOut);
    },

    slideIn : function (id, from) {
      if (this._id !== id || this._slideStatus !== status.isOut) return;
      if (from === direction.left) return this.animateInFromLeft();
      else return this.animateInFromRight();
    },

    slideOut : function (id, to) {
      if (this._id !== id || this._slideStatus !== status.isIn) return;
      if (to === direction.left) return this.animateOutToLeft();
      else return this.animateOutToRight();
    }
  });

});