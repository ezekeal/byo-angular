/* jshint globalstrict: true */
'use strict';

function Scope() {
    this.$$watchers = [];
}

function initWatchVal() {}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        last: initWatchVal
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function() {
    var dirty;
    do {
        dirty = this.$$digestOnce();
    }
    while (dirty);
};

Scope.prototype.$$digestOnce = function() {
    var self = this;
    var newValue, oldValue, dirty;
    _.forEach(this.$$watchers, function(watcher) {
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if (newValue !== oldValue) {
            watcher.last = newValue;
            watcher.listenerFn(
                newValue, 
                (oldValue === initWatchVal ? newValue : oldValue), 
                self
            );
            dirty = true;
        }
    });
    return dirty;
};