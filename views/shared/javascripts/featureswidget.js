(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var BaseWidget, EditWidget, ViewWidget, WidgetCollection, derefid, poll, stripFirstLine, to_s;
    derefid = function(id) {
      if (id[0] === '#') {
        return id.slice(1, id.length);
      } else {
        return id;
      }
    };
    to_s = function(value) {
      if (value != null) {
        return value.toString();
      } else {
        return '';
      }
    };
    poll = function(predicate, callback, maxPoll, timeout) {
      var n, pred, _poll;
      if (maxPoll == null) {
        maxPoll = null;
      }
      if (timeout == null) {
        timeout = 100;
      }
      n = 0;
      pred = (maxPoll != null) && maxPoll !== 0 ? function() {
        return predicate() || n >= maxPoll;
      } : predicate;
      _poll = function() {
        if (pred()) {
          return callback();
        } else {
          n++;
          return setTimeout(_poll, timeout);
        }
      };
      return setTimeout(_poll, timeout);
    };
    stripFirstLine = function(text) {
      if (text != null) {
        return text.substr(text.indexOf("\n") + 1);
      } else {
        return '';
      }
    };
    BaseWidget = (function() {

      function BaseWidget(widget, n, parent) {
        this.widget = widget;
        this.n = n;
        this.parent = parent;
      }

      BaseWidget.prototype.value = function() {
        return this.widget.options.values[this.n];
      };

      BaseWidget.prototype.initMap = function() {
        var all_options, input, item, local_options, map, _ref, _ref1, _ref2, _ref3;
        map = this.fields.map;
        input = this.value();
        item = {
          title: 'Coverage',
          name: 'Coverage',
          id: this.widget.element.attr('id'),
          geo: (_ref = (input != null ? input.geo : void 0)) != null ? _ref : ""
        };
        local_options = {
          mode: this.widget.options.mode,
          json: item,
          markup: {
            id_prefix: this.widget.options.id_prefix
          }
        };
        local_options.zoom = (_ref1 = (input != null ? input.zoom : void 0)) != null ? _ref1 : null;
        local_options.center = (_ref2 = (input != null ? input.center : void 0)) != null ? _ref2 : null;
        local_options.base_layer = (_ref3 = (input != null ? input.base_layer : void 0)) != null ? _ref3 : null;
        all_options = $.extend(true, {}, this.widget.options.map_options, local_options);
        this.nlfeatures = map.nlfeatures(all_options).data('nlfeatures');
        return this.nlfeatures;
      };

      return BaseWidget;

    })();
    ViewWidget = (function(_super) {

      __extends(ViewWidget, _super);

      function ViewWidget() {
        return ViewWidget.__super__.constructor.apply(this, arguments);
      }

      ViewWidget.prototype.init = function() {
        this.build();
        this.initMap();
        return this.populate();
      };

      ViewWidget.prototype.build = function() {
        var el, free, id_prefix, map;
        el = $(this.widget.element);
        id_prefix = derefid(this.widget.options.id_prefix);
        map = $("<div id='" + id_prefix + "map' class='map map-container'></div>");
        free = $("<div id='" + id_prefix + "free' class='freetext'></div>");
        el.addClass('nlfeatures').append(map).append(free);
        this.fields = {
          map: $("#" + id_prefix + "map"),
          free: $("#" + id_prefix + "free")
        };
        return el;
      };

      ViewWidget.prototype.populate = function() {
        var free, stripped;
        free = this.widget.options.values.text;
        stripped = stripFirstLine(free);
        if (stripped === '') {
          this.fields.free.detach();
          return delete this.fields.free;
        } else {
          return this.fields.free.html(stripped);
        }
      };

      return ViewWidget;

    })(BaseWidget);
    EditWidget = (function(_super) {

      __extends(EditWidget, _super);

      function EditWidget() {
        return EditWidget.__super__.constructor.apply(this, arguments);
      }

      EditWidget.prototype.init = function() {
        this.build();
        this.initMap();
        this.captureEditor();
        this.populate();
        return this.wire();
      };

      EditWidget.prototype._buildMap = function(parent, id_prefix) {
        console.log('_buildMap', this.n);
        return $('.input', parent).addClass('nlfeatures').addClass('nlfeatures-edit').before("<div class=\"nlfeatures map-container\">\n  <div id=\"" + id_prefix + "map\"></div>\n  <div class='nlfeatures-map-tools'>\n    <div class='nlflash'></div>\n  </div>\n</div>");
      };

      EditWidget.prototype._buildInputs = function(parent, id_prefix, name_prefix) {
        return $('.input textarea', parent).attr('id', "" + id_prefix + "free").attr('name', "" + name_prefix + "[free]").after("<input type=\"hidden\" id=\"" + id_prefix + "geo\" name=\"" + name_prefix + "[geo]\" value=\"\" />\n<input type=\"hidden\" id=\"" + id_prefix + "zoom\" name=\"" + name_prefix + "[zoom]\" value=\"\" />\n<input type=\"hidden\" id=\"" + id_prefix + "center_lon\" name=\"" + name_prefix + "[center_lon]\" value=\"\" />\n<input type=\"hidden\" id=\"" + id_prefix + "center_lat\" name=\"" + name_prefix + "[center_lat]\" value=\"\" />\n<input type=\"hidden\" id=\"" + id_prefix + "base_layer\" name=\"" + name_prefix + "[base_layer]\" value=\"\" />\n<input type=\"hidden\" id=\"" + id_prefix + "text\" name=\"" + name_prefix + "[text]\" value=\"\" />");
      };

      EditWidget.prototype._buildUseMap = function(parent, id_prefix, name_prefix, use_map) {
        return $('.use-html', parent).after("<label class=\"use-mapon\">" + use_map + "<input type=\"hidden\" name=\"" + name_prefix + "[mapon]\" value=\"0\" />\n  <input type=\"checkbox\" name=\"" + name_prefix + "[mapon]\" id=\"" + id_prefix + "mapon\" value=\"1\" />\n</label>");
      };

      EditWidget.prototype._populateFields = function(parent, id_prefix) {
        return this.fields = {
          map_container: parent.find(".map-container"),
          map: $("#" + id_prefix + "map"),
          map_tools: parent.find(".nlfeatures-map-tools"),
          mapon: $("#" + id_prefix + "mapon"),
          text: $("#" + id_prefix + "text"),
          free: $("#" + id_prefix + "free"),
          html: $("#" + id_prefix + "html"),
          geo: $("#" + id_prefix + "geo"),
          zoom: $("#" + id_prefix + "zoom"),
          center_lon: $("#" + id_prefix + "center_lon"),
          center_lat: $("#" + id_prefix + "center_lat"),
          base_layer: $("#" + id_prefix + "base_layer"),
          flash: parent.find(".nlflash")
        };
      };

      EditWidget.prototype.build = function() {
        var el, id_prefix, name_prefix, parent, use_html, use_map;
        el = $(this.widget.element);
        parent = $(this.parent);
        id_prefix = "" + (derefid(this.widget.options.id_prefix)) + this.n + "-";
        name_prefix = "" + this.widget.options.name_prefix + "[" + this.n + "]";
        use_html = this.widget.options.labels.html;
        use_map = this.widget.options.labels.map;
        this._buildMap(parent, id_prefix);
        this._buildInputs(parent, id_prefix, name_prefix);
        this._buildUseMap(parent, id_prefix, name_prefix, use_map);
        this._populateFields(parent, id_prefix);
        return parent;
      };

      EditWidget.prototype.captureEditor = function() {
        var _this = this;
        this.fields.mapon.change(function() {
          return _this._onUseMap();
        });
        return this.fields.html.change(function() {
          return _this._updateTinyEvents();
        });
      };

      EditWidget.prototype.populate = function(values) {
        var _ref, _ref1;
        if (values == null) {
          values = this.widget.options.values[this.n];
        }
        if (values != null) {
          this.fields.html.attr('checked', values.is_html);
          this.fields.mapon.attr('checked', values.is_map);
          this.fields.geo.val(to_s(values.geo));
          this.fields.zoom.val(to_s(values.zoom));
          this.fields.center_lon.val(to_s((_ref = values.center) != null ? _ref.lon : void 0));
          this.fields.center_lat.val(to_s((_ref1 = values.center) != null ? _ref1.lat : void 0));
          this.fields.base_layer.val(to_s(values.base_layer));
          this.fields.text.val(to_s(values.text));
          return this.fields.free.val(stripFirstLine(values.text));
        }
      };

      EditWidget.prototype.wire = function() {
        var updateFields,
          _this = this;
        updateFields = function() {
          return _this.updateFields(_this.fields.free.val());
        };
        this.fields.free.change(updateFields);
        this.nlfeatures.element.bind('featureadded.nlfeatures', updateFields).bind('update.nlfeatures', updateFields).bind('delete.nlfeatures', updateFields).bind('refresh.nlfeatures', updateFields).bind('saveview.nlfeatures', function() {
          _this.nlfeatures.saveViewport();
          _this.updateFields();
          return _this.flash('View Saved...');
        });
        return this.nlfeatures.map.events.on({
          changebaselayer: updateFields
        });
      };

      EditWidget.prototype.usesHtml = function() {
        return this.fields.html.is(':checked');
      };

      EditWidget.prototype.usesMap = function() {
        return this.fields.mapon.is(':checked');
      };

      EditWidget.prototype.showMap = function() {
        var tools,
          _this = this;
        tools = this.fields.map.children('button');
        return tools.hide('normal', function() {
          return _this.fields.map_container.slideDown('normal', function() {
            return tools.fadeIn();
          });
        });
      };

      EditWidget.prototype.hideMap = function() {
        var tools,
          _this = this;
        tools = this.fields.map.children('button');
        return tools.fadeOut('normal', function() {
          return _this.fields.map_container.slideUp();
        });
      };

      EditWidget.prototype._onUseMap = function() {
        if (this.usesMap()) {
          this.showMap();
        } else {
          this.hideMap();
        }
        return this.updateFields();
      };

      EditWidget.prototype._updateTinyEvents = function() {
        var freeId,
          _this = this;
        if (this.usesHtml()) {
          freeId = this.fields.free.attr('id');
          return poll(function() {
            return tinymce.get(freeId) != null;
          }, function() {
            _this.fields.free.unbind('change');
            return tinymce.get(freeId).onChange.add(function() {
              return _this.updateFields();
            });
          });
        } else {
          return this.fields.free.change(function() {
            return _this.updateFields();
          });
        }
      };

      EditWidget.prototype.updateFields = function() {
        var base_layer, center, geo, text, zoom;
        geo = this.nlfeatures.getKml();
        this.fields.geo.val(geo);
        zoom = this.nlfeatures.getSavedZoom();
        if (zoom != null) {
          this.fields.zoom.val(zoom);
        }
        center = this.nlfeatures.getSavedCenter();
        if (center != null) {
          this.fields.center_lon.val(center.lon);
          this.fields.center_lat.val(center.lat);
        }
        base_layer = this.nlfeatures.getBaseLayerCode();
        if (base_layer != null) {
          this.fields.base_layer.val(base_layer);
        }
        if (this.usesHtml()) {
          text = tinymce.get(this.fields.free.attr('id')).getContent();
        } else {
          text = this.fields.free.val();
        }
        return this.fields.text.val("" + geo + "|" + zoom + "|" + (center != null ? center.lon : void 0) + "|" + (center != null ? center.lat : void 0) + "|" + base_layer + "\n" + text);
      };

      EditWidget.prototype.flash = function(msg, delay) {
        var _this = this;
        if (delay == null) {
          delay = 5000;
        }
        return this.fields.flash.html(msg).fadeIn('slow', function() {
          return setTimeout(function() {
            return _this.fields.flash.fadeOut('slow');
          }, delay);
        });
      };

      return EditWidget;

    })(BaseWidget);
    WidgetCollection = (function() {

      function WidgetCollection(widget, parent, selector, widgetize) {
        var i, n;
        this.widget = widget;
        this.parent = parent;
        this.selector = selector;
        this.nodes = $(this.selector, this.parent);
        this.widgets = (function() {
          var _i, _len, _ref, _results;
          _ref = this.nodes;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            n = _ref[i];
            _results.push(widgetize(n, i));
          }
          return _results;
        }).call(this);
      }

      WidgetCollection.prototype.init = function() {
        var w, _i, _len, _ref, _results;
        _ref = this.widgets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          w = _ref[_i];
          _results.push(w.init());
        }
        return _results;
      };

      WidgetCollection.prototype.showMap = function() {
        var w, _i, _len, _ref, _results;
        _ref = this.widgets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          w = _ref[_i];
          _results.push(w.showMap());
        }
        return _results;
      };

      WidgetCollection.prototype.hideMap = function() {
        var w, _i, _len, _ref, _results;
        _ref = this.widgets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          w = _ref[_i];
          _results.push(w.hideMap());
        }
        return _results;
      };

      return WidgetCollection;

    })();
    return $.widget('nlfeatures.featurewidget', {
      options: {
        mode: 'view',
        id_prefix: null,
        name_prefix: null,
        labels: {
          html: 'Use HTML',
          map: 'Use Map'
        },
        map_options: {},
        values: {
          geo: null,
          zoom: null,
          center: null,
          text: null,
          is_html: null,
          is_map: null
        }
      },
      _create: function() {
        var id, _base, _base1, _ref, _ref1,
          _this = this;
        id = this.element.attr('id');
        if ((_ref = (_base = this.options).id_prefix) == null) {
          _base.id_prefix = "#Elements-" + (id.split('-')[1]) + "-";
        }
        if ((_ref1 = (_base1 = this.options).name_prefix) == null) {
          _base1.name_prefix = this._idPrefixToNamePrefix();
        }
        this.mode = this.options.mode === 'edit' ? new WidgetCollection(this, this.element, '.input-block', function(n, i) {
          return new EditWidget(_this, i, n);
        }) : new WidgetCollection(this, this.element, '.element-text', function(n, i) {
          return new ViewWidget(_this, i, n);
        });
        this.mode.init();
        if (!this.options.values.is_map) {
          return this.mode.hideMap();
        }
      },
      _idPrefixToNamePrefix: function(id_prefix) {
        var base, indices, p, parts;
        if (id_prefix == null) {
          id_prefix = this.options.id_prefix;
        }
        id_prefix = derefid(id_prefix);
        parts = (function() {
          var _i, _len, _ref, _results;
          _ref = id_prefix.split('-');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (p.length > 0) {
              _results.push(p);
            }
          }
          return _results;
        })();
        base = parts.shift();
        indices = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            p = parts[_i];
            _results.push("[" + p + "]");
          }
          return _results;
        })();
        return "" + base + (indices.join(''));
      },
      destroy: function() {
        return $.Widget.prototype.destroy.call(this);
      },
      _setOptions: function(key, value) {
        return $.Widget.prototype._setOption.apply(this, arguments);
      }
    });
  })(jQuery);

}).call(this);
