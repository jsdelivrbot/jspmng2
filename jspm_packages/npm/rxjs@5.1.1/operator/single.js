/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
function single(predicate) {
  return this.lift(new SingleOperator(predicate, this));
}
exports.single = single;
var SingleOperator = (function() {
  function SingleOperator(predicate, source) {
    this.predicate = predicate;
    this.source = source;
  }
  SingleOperator.prototype.call = function(subscriber, source) {
    return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
  };
  return SingleOperator;
}());
var SingleSubscriber = (function(_super) {
  __extends(SingleSubscriber, _super);
  function SingleSubscriber(destination, predicate, source) {
    _super.call(this, destination);
    this.predicate = predicate;
    this.source = source;
    this.seenValue = false;
    this.index = 0;
  }
  SingleSubscriber.prototype.applySingleValue = function(value) {
    if (this.seenValue) {
      this.destination.error('Sequence contains more than one element');
    } else {
      this.seenValue = true;
      this.singleValue = value;
    }
  };
  SingleSubscriber.prototype._next = function(value) {
    var predicate = this.predicate;
    this.index++;
    if (predicate) {
      this.tryNext(value);
    } else {
      this.applySingleValue(value);
    }
  };
  SingleSubscriber.prototype.tryNext = function(value) {
    try {
      var result = this.predicate(value, this.index, this.source);
      if (result) {
        this.applySingleValue(value);
      }
    } catch (err) {
      this.destination.error(err);
    }
  };
  SingleSubscriber.prototype._complete = function() {
    var destination = this.destination;
    if (this.index > 0) {
      destination.next(this.seenValue ? this.singleValue : undefined);
      destination.complete();
    } else {
      destination.error(new EmptyError_1.EmptyError);
    }
  };
  return SingleSubscriber;
}(Subscriber_1.Subscriber));
