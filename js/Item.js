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
    direction = Config.direction
  ;

  module.exports = Backbone.View.extend({

    initialize : function () {
      this._id = this.$el.attr('data-id');
      
      this._slideStatus = this.$el.is('.slide-li--a') ? status.isIn : status.isOut;

      this.attachEvents();
    },

    attachEvents : function () {
      this.listenTo(Events, 'slide:in', this.slideIn);
      this.listenTo(Events, 'slide:out', this.slideOut);
    },

    slideIn : function (id, from) {
      if (this._id !== id || this._slideStatus !== status.isOut) return;
      if (from === direction.left) return this.slideInFromLeft();
      else return this.slideInFromRight();
    },

    slideOut : function (id, to) {
      if (this._id !== id || this._slideStatus !== status.isIn) return;
      if (to === direction.left) return this.slideOutToLeft();
      else return this.slideOutToRight();
    },

    slideInFromLeft : function () {
      if (this._slideStatus !== status.isOut) return;
      this._slideStatus = status.progress;
      this.place('left');
      

      function then () {
        this.$el.addClass('slide-li--a');
        this._slideStatus = status.isIn;
      }

      this.animate('0%', _.bind(then, this));
    },

    slideOutToRight : function () {
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

    slideInFromRight : function () {
      if (this._slideStatus !== status.isOut) return;
      this._slideStatus = status.progress;
      this.place('right');
      
      function then () {
        this.$el.addClass('slide-li--a');
        this._slideStatus = status.isIn;
      }

      this.animate('0%', _.bind(then, this));
    },

    slideOutToLeft : function () {
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

    animate : function (left, callback) {
      this.$el.animate({
        'left' : left
      }, 1000, 'easeInOutExpo', callback);
    }

  });

});