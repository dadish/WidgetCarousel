// js/Carousel/List.js

define(function (require, exports, module) {
  
  var
    Backbone                      = require('backbone'),
    ItemSlide                     = require('./ItemSlide'),
    ItemFade                      = require('./ItemFade'),
    Button                        = require('./Button'),
    Config                        = require('./Config'),
    _                             = require('underscore')
  ;

  var
    direction = Config.direction,
    animation = Config.animation,
    status = Config.status
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

      this._slideStatus = status.end;

      // Get settings from the DOM Element
      this._animationType = this.$el.attr('data-animationType') || 'slide';
      this._speed = parseInt(this.$el.attr('data-speed'), 10) || 1000;
      this._interval = parseInt(this.$el.attr('data-interval'), 10) || 7000;

      Item = {};
      Item[animation.slide] = ItemSlide;
      Item[animation.fade] = ItemFade;

      // The carousel items
      this._items = [];
      _(this.$el.children('.slide-li')).each(function (item) {
        this._items.push(new Item[this._animationType]({
          el : item, 
          speed : this._speed,
          carousel : this
        }));
      }, this);

      this._cycleId = null;

      this._mouseIn = false;

      this.nextButton = new Button({
        direction : 'next', 
        el : this.$('.slide-li--next')[0],
        carousel : this
      });

      this.prevButton = new Button({
        direction : 'prev', 
        el : this.$('.slide-li--prev')[0],
        carousel : this
      });

      this.positionButtons();
      this.attachEvents();

      if (this._items.length > 1) this.startCycle();
    },

    attachEvents : function () {
      this.on('slide:next', this.next);
      this.on('slide:prev', this.prev);
      this.on('slide:to slide:in slide:out', this.restartCycle);
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
      
      this.trigger('slide:in', this._items[this._index]._id, direction.right);
      this.trigger('slide:out', this._items[oldIndex]._id, direction.left);
    },

    prev : function () {
      var oldIndex, lastIndex;
      oldIndex = this._index;
      lastIndex = this._items.length - 1;
      this._index = this._index - 1;
      if (this._index < 0) this._index = lastIndex;

      this.trigger('slide:in', this._items[this._index]._id, direction.left);
      this.trigger('slide:out', this._items[oldIndex]._id, direction.right);
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
      this.trigger('buttons:show');
    },

    onMouseleave : function () {
      this._mouseIn = false;
      this.trigger('buttons:hide');
    }

  });

});