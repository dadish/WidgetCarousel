// js/Carousel/Button.js

define(function (require, exports, module) {
  
  var
    Backbone                      = require('backbone'),
    Events                        = require('./Events'),
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
      this.listenTo(Events, 'buttons:show', this.show);
      this.listenTo(Events, 'buttons:hide', this.hide);
    },

    triggerSlide : function () {
      if (Events._slideStatus !== status.end) return;
      Events.trigger('slide:' + this._direction);
    },

    show : function () {
      this.$el.stop().fadeIn(200);
    },

    hide : function () {
      this.$el.stop().fadeOut(200);
    }

  });

});