/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

function reflect(element, name, meta) {
  return {
    obj: element,
    name: name,
    value: element[name],
    meta: meta && meta[name]
  };
}

function reflectProperty(element, name) {
  var v = element[name];
  if (v !== null
      && v !== undefined
      && typeof v !== 'function'
      && typeof v !== 'object'
      //&& element.propertyIsEnumerable(k)
      && !reflectProperty.blacklist[name]) {
    var prop = reflect(element, name);
  }
  return prop;
}

reflectProperty.blacklist = {isToolkitElement: 1};

function reflectProperties(element) {
  var props = [];
  if (element) {
    var found = {};
    var p = element.__proto__;
    while (p && p !== HTMLElement.prototype/*&& p.isToolkitElement*/) {
      var k = Object.keys(p);
      k.forEach(function(k) {
        if (found[k]) {
          return;
        }
        var prop = reflectProperty(element, k);
        if (prop) {
          props.push(prop);
          found[k] = true;
        }
      });
      p = p.__proto__;
    }
    //
    var more = [];
    if (!element.firstElementChild) {
      more.push('textContent');
    }
    more.push('id');
    //
    var meta = element.meta && element.meta.properties;
    more.forEach(function(k) {
      var v = element[k];
      if (typeof v !== 'function' && typeof v !== 'object') {
        props.push(reflect(element, k, meta));
      }
    });
  }
  return props;
}

function reflectStyles(element, meta) {
  var props = [];
  if (element) {
    var style = element.style;
    Object.keys(meta).forEach(function(name) {
      props.push(reflect(style, name, meta));
    });
  }
  return props;
}

window.Reflection = {
  properties: reflectProperties,
  styles: reflectStyles
};

})();
