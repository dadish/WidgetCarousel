// js/Carousel/ItemSlide.js

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
    },

    animateInFromLeft : function () {
      if (this._slideStatus !== status.isOut) return;
      this._slideStatus = status.progress;
      this.place('left');
      

      function then () {
        this.$el.addClass('slide-li--a');
        this._slideStatus = status.isIn;
      }

      this.animate('0%', _.bind(then, this));
    },

    animateInFromRight : function () {
      if (this._slideStatus !== status.isOut) return;
      this._slideStatus = status.progress;
      this.place('right');
      
      function then () {
        this.$el.addClass('slide-li--a');
        this._slideStatus = status.isIn;
      }

      this.animate('0%', _.bind(then, this));
    },

    animateOutToRight : function () {
      if (this._slideStatus !== status.isIn) return;
      this._slideStatus = status.progress;
      Events._slideStatus = status.progress;

      function then () {
        this.$el.removeClass('slide-li--a');
        this._slideStatus = status.isOut;
        Events._slideStatus = status.end;
      }

      this.animate('100%', _.bind(then, this));
    },

    animateOutToLeft : function () {
      if (this._slideStatus !== status.isIn) return;
      this._slideStatus = status.progress;
      Events._slideStatus = status.progress;
      
      function then () {
        this.$el.removeClass('slide-li--a');
        this._slideStatus = status.isOut;
        Events._slideStatus = status.end;
      }

      this.animate('-100%', _.bind(then, this));
    },

    place : function (position) {
      position = (position === 'right') ? '100%' : '-100%';
      this.$el.css('left', position);
    },

    animate : function (slide, callback) {
      this.$el.animate({left : slide}, this._speed, 'easeInOutExpo', callback);
    }

  });

});