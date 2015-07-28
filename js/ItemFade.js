// js/Carousel/Item.js

define(function (require, exports, module) {
  
  var
    View                          = require('./Item'),
    Config                        = require('./Config'),
    Events                        = require('./Events'),
    _                             = require('underscore')
  ;

  var
    status = Config.status,
    direction = Config.direction,
    animation = Config.animation
  ;

  module.exports = View.extend({

    initialize : function () {
      View.prototype.initialize.apply(this, arguments);

      this._id = this.$el.attr('data-id');
      
      this._slideStatus = this.$el.is('.slide-li--a') ? status.isIn : status.isOut;

      this.$el.css({
        left : '0%',
        opacity : (this._slideStatus === status.isIn) ? 1 : 0
      });
    },

    animateInFromLeft : function () {
      if (this._slideStatus !== status.isOut) return;
      this._slideStatus = status.progress;

      function then () {
        this._slideStatus = status.isIn;
      }

      this.fadeIn(then);
    },

    animateInFromRight : function () {
      if (this._slideStatus !== status.isOut) return;
      this._slideStatus = status.progress;
      
      function then () {
        this._slideStatus = status.isIn;
      }

      this.fadeIn(then);
    },

    animateOutToRight : function () {
      if (this._slideStatus !== status.isIn) return;
      this._slideStatus = status.progress;
      Events._slideStatus = status.progress;

      function then () {
        this._slideStatus = status.isOut;
        Events._slideStatus = status.end;
      }

      this.fadeOut(then);
    },

    animateOutToLeft : function () {
      if (this._slideStatus !== status.isIn) return;
      this._slideStatus = status.progress;
      Events._slideStatus = status.progress;
      
      function then () {
        this._slideStatus = status.isOut;
        Events._slideStatus = status.end;
      }

      this.fadeOut(then);
    },

    fadeIn : function (callback) {
      function then () {
        this.$el.animate({opacity : 1}, this._speed / 2, 'easeOutExpo', _.bind(callback, this));
      }
      setTimeout(_.bind(then, this), this._speed / 2);
    },

    fadeOut : function (callback) {
      this.$el.animate({opacity : 0}, this._speed / 2, 'easeInExpo', _.bind(callback, this));
    }

  });

});