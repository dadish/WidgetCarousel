// js/Carousel/List.js

define(function (require, exports, module) {
  
  var
    Backbone                      = require('backbone'),
    ItemSlide                     = require('./ItemSlide'),
    ItemFade                      = require('./ItemFade'),
    Button                        = require('./Button'),
    Events                        = require('./Events'),
    Config                        = require('./Config'),
    _                             = require('underscore')
  ;

  var
    direction = Config.direction,
    animation = Config.animation
  ;

  module.exports = Backbone.View.extend({

    events : {
      'mouseenter' : 'onMouseenter',
      'mouseleave' : 'onMouseleave'
    },

    initialize : function (options) {
      var Item;
      // The index of the current active carousel item
      this._index = 0;

      Item = {};
      Item[animation.slide] = ItemSlide;
      Item[animation.fade] = ItemFade;

      // The carousel items
      this._items = [];
      _(this.$el.children('.slide-li')).each(function (item) {
        this._items.push(new Item[Config.animationType]({el : item}));
      }, this);

      this._cycleId = null;

      this._interval = Config.interval;

      this._mouseIn = false;

      this.startCycle();

      this.nextButton = new Button({direction : 'next', el : this.$('.slide-li--next')[0]});
      this.prevButton = new Button({direction : 'prev', el : this.$('.slide-li--prev')[0]});

      this.positionButtons();
      this.attachEvents();
    },

    attachEvents : function () {
      this.listenTo(Events, 'slide:next', this.next);
      this.listenTo(Events, 'slide:prev', this.prev);
      this.listenTo(Events, 'slide:to slide:in slide:out', this.restartCycle);
      $(window).on('resize', _.bind(this.positionButtons, this));
    },

    positionButtons : function () {
      var height, outerHeight, top;
      outerHeight = this.$el.height();
      _([this.nextButton, this.prevButton]).each(function (button) {
        height = button.$el.height();
        top = (outerHeight - height) / 2;
        button.$el.css('top', top + 'px');
      });
    },

    next : function () {
      var oldIndex, lastIndex;
      oldIndex = this._index;
      lastIndex = this._items.length - 1;
      this._index = this._index + 1;
      if (this._index >= this._items.length) this._index = 0;
      
      Events.trigger('slide:in', this._items[this._index]._id, direction.right);
      Events.trigger('slide:out', this._items[oldIndex]._id, direction.left);
    },

    prev : function () {
      var oldIndex, lastIndex;
      oldIndex = this._index;
      lastIndex = this._items.length - 1;
      this._index = this._index - 1;
      if (this._index < 0) this._index = lastIndex;

      Events.trigger('slide:in', this._items[this._index]._id, direction.left);
      Events.trigger('slide:out', this._items[oldIndex]._id, direction.right);
    },

    startCycle : function () {
      if (this._cycleId !== null) return;
      this._cycleId = setInterval(_.bind(this.cycle, this), this._interval);
    },

    stopCycle : function () {
      clearInterval(this._cycleId);
      this._cycleId = null;
    },

    restartCycle : function () {
      this.stopCycle();
      this.startCycle();
    },

    cycle : function () {
      if (this._mouseIn) return;
      this.next();
    },

    onMouseenter : function () {
      this._mouseIn = true;
      Events.trigger('buttons:show');
    },

    onMouseleave : function () {
      this._mouseIn = false;
      Events.trigger('buttons:hide');
    }

  });

});