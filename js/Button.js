// js/Carousel/Button.js

define(function (require, exports, module) {
  
  var
    Backbone                      = require('backbone'),
    Config                        = require('./Config')
  ;

  var
    status = Config.status
  ;

  module.exports = Backbone.View.extend({

    events : {
      'click' : 'triggerSlide'
    },

    initialize : function (options) {
      this._direction = options.direction;
      this._carousel = options.carousel;
      this.listenTo(this._carousel, 'buttons:show', this.show);
      this.listenTo(this._carousel, 'buttons:hide', this.hide);
    },

    triggerSlide : function () {
      if (this._carousel._slideStatus !== status.end) return;
      this._carousel.trigger('slide:' + this._direction);
    },

    show : function () {
      this.$el.stop().fadeIn(200);
    },

    hide : function () {
      this.$el.stop().fadeOut(200);
    }

  });

});