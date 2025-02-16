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
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var AsyncSubject_1 = require('../AsyncSubject');
var BoundCallbackObservable = (function(_super) {
  __extends(BoundCallbackObservable, _super);
  function BoundCallbackObservable(callbackFunc, selector, args, context, scheduler) {
    _super.call(this);
    this.callbackFunc = callbackFunc;
    this.selector = selector;
    this.args = args;
    this.context = context;
    this.scheduler = scheduler;
  }
  BoundCallbackObservable.create = function(func, selector, scheduler) {
    if (selector === void 0) {
      selector = undefined;
    }
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
      }
      return new BoundCallbackObservable(func, selector, args, this, scheduler);
    };
  };
  BoundCallbackObservable.prototype._subscribe = function(subscriber) {
    var callbackFunc = this.callbackFunc;
    var args = this.args;
    var scheduler = this.scheduler;
    var subject = this.subject;
    if (!scheduler) {
      if (!subject) {
        subject = this.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function handlerFn() {
          var innerArgs = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            innerArgs[_i - 0] = arguments[_i];
          }
          var source = handlerFn.source;
          var selector = source.selector,
              subject = source.subject;
          if (selector) {
            var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
            if (result_1 === errorObject_1.errorObject) {
              subject.error(errorObject_1.errorObject.e);
            } else {
              subject.next(result_1);
              subject.complete();
            }
          } else {
            subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          }
        };
        handler.source = this;
        var result = tryCatch_1.tryCatch(callbackFunc).apply(this.context, args.concat(handler));
        if (result === errorObject_1.errorObject) {
          subject.error(errorObject_1.errorObject.e);
        }
      }
      return subject.subscribe(subscriber);
    } else {
      return scheduler.schedule(BoundCallbackObservable.dispatch, 0, {
        source: this,
        subscriber: subscriber,
        context: this.context
      });
    }
  };
  BoundCallbackObservable.dispatch = function(state) {
    var self = this;
    var source = state.source,
        subscriber = state.subscriber,
        context = state.context;
    var callbackFunc = source.callbackFunc,
        args = source.args,
        scheduler = source.scheduler;
    var subject = source.subject;
    if (!subject) {
      subject = source.subject = new AsyncSubject_1.AsyncSubject();
      var handler = function handlerFn() {
        var innerArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          innerArgs[_i - 0] = arguments[_i];
        }
        var source = handlerFn.source;
        var selector = source.selector,
            subject = source.subject;
        if (selector) {
          var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
          if (result_2 === errorObject_1.errorObject) {
            self.add(scheduler.schedule(dispatchError, 0, {
              err: errorObject_1.errorObject.e,
              subject: subject
            }));
          } else {
            self.add(scheduler.schedule(dispatchNext, 0, {
              value: result_2,
              subject: subject
            }));
          }
        } else {
          var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
          self.add(scheduler.schedule(dispatchNext, 0, {
            value: value,
            subject: subject
          }));
        }
      };
      handler.source = source;
      var result = tryCatch_1.tryCatch(callbackFunc).apply(context, args.concat(handler));
      if (result === errorObject_1.errorObject) {
        subject.error(errorObject_1.errorObject.e);
      }
    }
    self.add(subject.subscribe(subscriber));
  };
  return BoundCallbackObservable;
}(Observable_1.Observable));
exports.BoundCallbackObservable = BoundCallbackObservable;
function dispatchNext(arg) {
  var value = arg.value,
      subject = arg.subject;
  subject.next(value);
  subject.complete();
}
function dispatchError(arg) {
  var err = arg.err,
      subject = arg.subject;
  subject.error(err);
}
