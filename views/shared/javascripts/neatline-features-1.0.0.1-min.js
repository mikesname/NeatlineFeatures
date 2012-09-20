(function(a,b){a.widget("nlfeatures.nlfeatures",{options:{markup:{toolbar_class:"olControlEditingToolbar",id_prefix:"nlf-"},animation:{fade_duration:500},styles:{default_opacity:.4,default_color:"#ffb80e",select_point_radius:10,select_stroke_color:"#ea3a3a",point_graphic:{normal:b,selected:b}},map:{boundingBox:"90,0,-90,360",center:b,zoom:b,epsg:b,wmsAddress:b,raw_update:b},mode:null,json:null,zoom:null,center:null},_create:function(){var a=this;this._instantiateOpenLayers(),this._currentVectorLayers=[],this._currentEditItem=null,this._currentEditLayer=null,this.clickedFeature=null,this.idToLayer={},this.requestData=null,typeof this.options.json!="undefined"&&this.options.json!==null?(this.loadLocalData([this.options.json]),this.setViewport(),this.options.mode==="edit"&&this.editJson(this.options.json,!0)):this.loadData()},_instantiateOpenLayers:function(){OpenLayers.IMAGE_RELOAD_ATTEMTPS=3,OpenLayers.Util.onImageLoadErrorColor="transparent",OpenLayers.ImgPath="http://js.mapbox.com/theme/dark/";var a,c,d,e=!0;OpenLayers.IMAGE_RELOAD_ATTEMPTS=5,OpenLayers.DOTS_PER_INCH=25.4/.28,format=e?"image/png8":"image/png",this.options.map.boundingBox===b?c=new OpenLayers.Bounds:(d=this.options.map.boundingBox.split(","),c=new OpenLayers.Bounds(parseFloat(d[0]),parseFloat(d[1]),parseFloat(d[2]),parseFloat(d[3])));var f=this.options.map.epsg!==b?this.options.map.epsg[0]:"EPSG:4326",g=[new OpenLayers.Control.Attribution,new OpenLayers.Control.Navigation,new OpenLayers.Control.PanZoomBar];this.options.mode==="edit"&&(g=g.concat([new OpenLayers.Control.MousePosition,new OpenLayers.Control.LayerSwitcher]));var h={controls:g,maxExtent:c,maxResolution:"auto",projection:f,units:"m"};this.map=new OpenLayers.Map(this.element.attr("id"),h),this.options.map.wmsAddress!==b?this.baseLayer=new OpenLayers.Layer.WMS(this.options.name,this.options.map.wmsAddress,{LAYERS:this.options.map.layers,STYLES:"",format:"image/jpeg",tiled:!e,tilesOrigin:this.map.maxExtent.left+","+this.map.maxExtent.bottom},{buffer:0,displayOutsideMaxExtent:!0,isBaseLayer:!0}):(this.baseLayers=this._getBaseLayers(),this.baseLayers[this.options.base_layer]!==b?this.baseLayer=this.baseLayers[this.options.base_layer]:this.baseLayer=this.baseLayers.osm),this.map.addLayers([this.baseLayers.osm,this.baseLayers.gphy,this.baseLayers.gmap,this.baseLayers.ghyb,this.baseLayers.gsat]),this.baseLayers.swc!==b&&this.map.addLayers([this.baseLayers.stn,this.baseLayers.str,this.baseLayers.swc]),this.map.setBaseLayer(this.baseLayer),this.exists(this.options.default_map_bounds)&&(d=this.options.default_map_bounds.split(","),c=new OpenLayers.Bounds(parseFloat(d[0]),parseFloat(d[1]),parseFloat(d[2]),parseFloat(d[3])));if(this.options.map.center!==b){var i=this.options.map.zoom===b?3:this.options.map.zoom,j=new OpenLayers.LonLat(this.options.map.center[0],this.options.map.center[1]);this.map.setCenter(j,i)}else this.map.zoomToExtent(c)},_getBaseLayers:function(){var a={};a.gphy=new OpenLayers.Layer.Google("Google Physical",{type:google.maps.MapTypeId.TERRAIN}),a.gmap=new OpenLayers.Layer.Google("Google Streets",{numZoomLevels:20}),a.ghyb=new OpenLayers.Layer.Google("Google Hybrid",{type:google.maps.MapTypeId.HYBRID,numZoomLevels:20}),a.gsat=new OpenLayers.Layer.Google("Google Satellite",{type:google.maps.MapTypeId.SATELLITE,numZoomLevels:22}),a.osm=new OpenLayers.Layer.OSM;if(OpenLayers.Layer.Stamen!==b){var c='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';a.swc=new OpenLayers.Layer.Stamen("Stamen Watercolor",{provider:"watercolor",attribution:c,tileOptions:{crossOriginKeyword:null}}),a.stn=new OpenLayers.Layer.Stamen("Stamen Toner",{provider:"toner",attribution:c,tileOptions:{crossOriginKeyword:null}}),a.str=new OpenLayers.Layer.Stamen("Stamen Terrain",{provider:"terrain",attribution:c,tileOptions:{crossOriginKeyword:null}})}return a},loadData:function(){var c=this;this._resetData(),this.exists(this.requestData)&&this.requestData.abort(),this.options.dataSources!==b&&this.options.dataSources.maps!==b&&(this.requestData=a.ajax({url:this.options.dataSources.map,dataType:"json",success:function(a){c._buildVectorLayers(a),c._addClickControls(),c.exists(c._currentEditItem)&&c.editJson(c._currentEditItem,!0)}}))},loadLocalData:function(a){var b=this;this._resetData(),this._buildVectorLayers(a),this.options.mode==="edit"&&this._addClickControls()},_resetData:function(){var b=this;this._removeControls(),a.each(this._currentVectorLayers,function(a,c){b.map.removeLayer(c),c.destroy()}),this._currentVectorLayers=[],this.idToLayer={}},_buildVectorLayers:function(c){var d=this,e=!1;this.idToLayer={},this.layerToId={},a.each(c,function(c,f){var g=f.id,h=f.color!==""?f.color:d.options.styles.default_color,i=d._getStyleMap(h),j=new OpenLayers.Layer.Vector(f.title,{styleMap:i});if(f.geo!==null){var k=new OpenLayers.Format.KML,l=k.read(f.geo);if(l.length===0){var m=new OpenLayers.Format.WKT;a.each(f.geo.split("|"),function(a,c){if(m.read(c)!==b){var d=new OpenLayers.Geometry.fromWKT(c),e=new OpenLayers.Feature.Vector(d);l.push(e)}}),e=l.length>0}l.length>0&&j.addFeatures(l)}j.setMap(d.map),d.idToLayer[g]=j,d.layerToId[j.id]=g,d._currentVectorLayers.push(j),d.map.addLayer(j)}),e&&setTimeout(function(){d.element.trigger("refresh.nlfeatures")},250)},selectFeature:function(a){if(this.isFocusLocked())return;this.modifyFeatures.selectFeature(a),this.clickControl.highlight(a),this.listenToFeature(a),this.clickedFeature=a,this.element.trigger("select.nlfeatures",a)},getFeatureElement:function(b){var c;return c=("#"+b.geometry.id).replace(/\./g,"\\."),a(c)},listenToFeature:function(a){var b,c,d;b=a.id,c=this,d=this.getFeatureElement(a),d.on({mousedown:function(){c.lockFocus(a)},mouseup:function(){c.unlockFocus(a)}})},unlistenToFeature:function(a,b){var c;c=this,b==null&&(b=this.getFeatureElement(a)),b.off("mouseup").off("mousedown")},deselectFeature:function(a,b){a==null&&(a=this.clickedFeature);if(this.isFocusLocked(a)&&!b)return;this.clickControl.unhighlight(a),this.modifyFeatures.unselectFeature(a),this.unlistenToFeature(a),this.resetModifyFeatures(),a.nlfeatures&&(a.nlfeatures.focusLocked=!1),a===this.clickedFeature&&(this.clickedFeature=null),this.element.trigger("deselect.nlfeatures",a)},lockFocus:function(a){a==null&&(a=this.clickedFeature),a!=null&&(a.nlfeatures==null?a.nlfeatures={focusLocked:!0}:a.nlfeatures.focusLocked=!0)},unlockFocus:function(a){a==null&&(a=this.clickedFeature),a!=null&&a.nlfeatures!=null&&(a.nlfeatures.focusLocked=!1)},isFocusLocked:function(a){return a==null&&(a=this.clickedFeature),a!=null&&a.nlfeatures!=null&&a.nlfeatures.focusLocked},_addClickControls:function(){var a=this;this._removeControls(),this.clickControl=new OpenLayers.Control.SelectFeature(this._currentVectorLayers,{hover:!0,highlightOnly:!0,overFeature:function(c){if(c.geometry.parent!=null)return;a.modifyFeatures!==b&&a.clickedFeature!=null&&c.id!==a.clickedFeature.id&&a.deselectFeature(),a.modifyFeatures!==b&&(a.clickedFeature==null||c.id!==a.clickedFeature.id)&&a.selectFeature(c)},outFeature:function(a){return!1}}),this.map.addControl(this.clickControl),this.clickControl.activate(),this.map.events.register("click",this.map,function(b){a.clickedFeature!=null&&a.deselectFeature(a.clickedFeature,!0)})},_removeControls:function(){this.modifyFeatures!==b&&(this.map.removeControl(this.modifyFeatures),this.modifyFeatures.destroy(),delete this.modifyFeatures),this.editToolbar!==b&&(this.map.removeControl(this.editToolbar),this.editToolbar.destroy(),delete this.editToolbar),this.clickControl!==b&&(this.map.removeControl(this.clickControl),this.clickControl.destroy(),delete this.clickControl),this.highlightControl!==b&&(this.map.removeControl(this.highlightControl),this.highlightControl.destroy(),delete this.highlightControl)},edit:function(a,b){var c={id:a.attr("recordid"),name:a.find("span.item-title-text").text()};this.editJson(c,b)},editJson:function(c,d){var e=this;this.highlightControl!==b&&this.highlightControl.deactivate();var f=c.id;this._currentEditLayer=this.idToLayer[f],this._currentEditId=f,this._currentEditItem=c;if(!this._currentEditLayer){var g=c.name;this._currentEditLayer=new OpenLayers.Layer.Vector(g),this.map.addLayer(this._currentEditLayer),this._currentEditLayer.setMap(this.map),this._currentVectorLayers.push(this._currentEditLayer),this.idToLayer[f]=this._currentEditLayer,this.layerToId[this._currentEditLayer.id]=f}var h=[new OpenLayers.Control.Navigation,new OpenLayers.Control.DrawFeature(this._currentEditLayer,OpenLayers.Handler.Path,{displayClass:"olControlDrawFeaturePath",featureAdded:function(){e.element.trigger("featureadded.nlfeatures")}}),new OpenLayers.Control.DrawFeature(this._currentEditLayer,OpenLayers.Handler.Point,{displayClass:"olControlDrawFeaturePoint",featureAdded:function(){e.element.trigger("featureadded.nlfeatures")}}),new OpenLayers.Control.DrawFeature(this._currentEditLayer,OpenLayers.Handler.Polygon,{displayClass:"olControlDrawFeaturePolygon",featureAdded:function(){e.element.trigger("featureadded.nlfeatures")}})];this.modifyFeatures=new OpenLayers.Control.ModifyFeature(this._currentEditLayer,{onModification:function(){e.element.trigger("featureadded.nlfeatures")},standalone:!0}),this.editToolbar=new OpenLayers.Control.Panel({defaultControl:h[0],displayClass:this.options.markup.toolbar_class}),this.editToolbar.addControls(h),this.map.addControl(this.editToolbar),this.map.addControl(this.modifyFeatures),this.modifyFeatures.activate(),this.element.editfeatures({markup:{id_prefix:this.options.markup.id_prefix}}),this.element.bind({"update.nlfeatures":function(a,b){e.modifyFeatures.mode=OpenLayers.Control.ModifyFeature.RESHAPE,b.rotate&&(e.modifyFeatures.mode|=OpenLayers.Control.ModifyFeature.ROTATE),b.scale&&(e.modifyFeatures.mode|=OpenLayers.Control.ModifyFeature.RESIZE),b.drag&&(e.modifyFeatures.mode|=OpenLayers.Control.ModifyFeature.DRAG);if(b.drag||b.rotate)e.modifyFeatures.mode&=-OpenLayers.Control.ModifyFeature.RESHAPE;var c=e.modifyFeatures.feature;e.exists(c)&&(e.modifyFeatures.unselectFeature(c),e.modifyFeatures.selectFeature(c))},"lockfocus.nlfeatures":function(){e.lockFocus()},"unlockfocus.nlfeatures":function(){e.unlockFocus()},"delete.nlfeatures":function(){if(e.modifyFeatures.feature){var a=e.modifyFeatures.feature;e.clickedFeature=null,e.modifyFeatures.unselectFeature(a),e._currentEditLayer.destroyFeatures([a])}}}),d?a("."+this.options.markup.toolbar_class).css("opacity",1):(this.element.editfeatures("showButtons",d),a("."+this.options.markup.toolbar_class).animate({opacity:1},this.options.animation.fade_duration));if(this.options.map.raw_update!==b){var i=this.options.map.raw_update;this.element.bind({"featureadded.nlfeatures":function(){e.updateRaw()},"update.nlfeatures":function(){e.updateRaw()},"delete.nlfeatures":function(){e.updateRaw()}})}var j=!1;a.each(this._currentEditLayer.features,function(a,b){b==e.clickedFeature&&(j=!0)}),j&&this.modifyFeatures.selectFeature(this.clickedFeature)},resetModifyFeatures:function(){this.modifyFeatures.mode=OpenLayers.Control.ModifyFeature.RESHAPE},editJsonItem:function(a){this.loadLocalData([a]),this.setViewport(),this.editJson(a,!0)},setViewport:function(){this.viewportOptionsValid()?this._setViewportFromOptions():this._setViewportFromData()},viewportOptionsValid:function(){var a=!0;return a=a&&this.options.zoom!=null,a=a&&this.options.zoom>0,a=a&&this.options.center!=null,a=a&&this.options.center.lon!=null,a=a&&this.options.center.lat!=null,a=a&&!isNaN(parseFloat(this.options.center.lon)),a=a&&!isNaN(parseFloat(this.options.center.lat)),a},_setViewportFromOptions:function(){var a=this.options.zoom,b=this.options.center,c=new OpenLayers.LonLat(b.lon,b.lat),d,e;b.srs!=null&&(e=new OpenLayers.Projection(b.srs),d=this.map.getProjectionObject(),c=c.transform(e,d)),this.map.setCenter(c,a,!1,!1)},_setViewportFromData:function(){var a,b,c,d,e,f,g,h,i,j;a=this,i=new OpenLayers.Bounds,b=0,d=this._currentVectorLayers.length;for(c=0;c<d;c++){e=this._currentVectorLayers[c],g=e.features.length;for(f=0;f<g;f++)b++,h=e.features[f].geometry,i.extend(h.getBounds())}b===0?(j=new OpenLayers.Control.Geolocate({bind:!0,watch:!1}),j.events.on({locationfailed:function(){a.map.setCenter(new OpenLayers.LonLat(-8738850.21367,4584105.47978),3,!1,!1)}}),this.map.addControl(j),this.map.zoomTo(3),j.activate()):this.map.zoomToExtent(i,!1)},updateRaw:function(){var a=this.options.map.raw_update;if(this.exists(a)){var b=this.getWktForSave();b=b.replace(/\|/g,"|\n"),a.val(b)}},endEditWithoutSave:function(b,c){var d=a("."+this.options.markup.toolbar_class).clone();this.modifyFeatures.unselectFeature(this.clickedFeature),this.map.removeControl(this.modifyFeatures),this.map.removeControl(this.editToolbar),c||(this.element.editfeatures("hideButtons"),this.element.append(d),d.animate({opacity:0},this.options.animation.fade_duration,function(){d.remove()})),this._addClickControls(),this._currentEditLayer.features.length===0&&(this.map.removeLayer(this._currentEditLayer),this._currentVectorLayers.remove(this._currentEditLayer),delete this.idToLayer[b],delete this.layerToId[this._currentEditLayer.id],this._currentEditLayer=null),this._currentEditItem=null},getBaseLayerCode:function(){var a,b,c,d,e,f;f=this.map.baseLayer.name,c=null,d=["osm","gphy","gmap","ghyb","gsat","swc","stn","str"];for(e=0,b=d.length;e<b;e++){a=d[e];if(f===this.baseLayers[a].name){c=a;break}}return c},getWktForSave:function(){var a=[];return this._getFeatures(function(b,c){a.push(c.geometry.toString())}),a.join("|")},getKml:function(){var a=new OpenLayers.Format.KML,b=[];return this._getFeatures(function(a,c){b.push(c)}),a.write(b)},_getFeatures:function(b){var c=this.exists(this.clickedFeature);c&&this.modifyFeatures.unselectFeature(this.clickedFeature),a.each(this._currentEditLayer.features,b),c&&this.modifyFeatures.selectFeature(this.clickedFeature)},getExtentForSave:function(){return this.map.getExtent().toString()},getZoomForSave:function(){return this.map.getZoom()},zoomToItemVectors:function(a){var b=this.idToLayer[a];this.exists(b)&&b.features.length>0&&this.map.zoomToExtent(b.getDataExtent())},_getStyleMap:function(a){return new OpenLayers.StyleMap({"default":new OpenLayers.Style({fillColor:a,fillOpacity:this.options.styles.default_opacity,strokeColor:a,strokeWidth:1,pointRadius:10}),select:new OpenLayers.Style({fillColor:a,fillOpacity:this.options.styles.default_opacity,strokeColor:this.options.styles.select_stroke_color,strokeWidth:2,pointRadius:10})})},setItemColor:function(a){this._currentEditLayer.styleMap=this._getStyleMap(a),this._currentEditLayer.redraw()},getCenterLonLat:function(){var a=new OpenLayers.Projection("EPSG:4326"),b=this.map.getProjectionObject();return this.map.getCenter().transform(b,a)},setCenterLonLat:function(a,b){var c=new OpenLayers.LonLat(a,b),d=new OpenLayers.Projection("EPSG:4326"),e=this.map.getProjectionObject();return this.map.panTo(c.transform(d,e))},setZoom:function(a){return this.map.zoomTo(a)},hasPoint:function(){return this.hasFeature("OpenLayers.Geometry.Point")},hasLine:function(){return this.hasFeature("OpenLayers.Geometry.LineString")},hasPolygon:function(){return this.hasFeature("OpenLayers.Geometry.Polygon")},hasFeature:function(b){return result=!1,a.each(this._currentVectorLayers,function(c,d){a.each(d.features,function(a,c){result=result||c.geometry.CLASS_NAME==b})}),result},exists:function(a){return typeof a!="undefined"&&a!==null},getSavedZoom:function(){return this.options.zoom},getSavedCenter:function(){return this.options.center},saveViewport:function(){var a=this.map.getCenter(),b=this.map.getZoom();this.options.zoom=b,this.options.center={lon:a.lon,lat:a.lat}}})})(jQuery),function(a,b){a.widget("nlfeatures.editfeatures",{options:{markup:{geo_edit_class:"geo-edit",id_prefix:"nlf-"},animation:{fade_duration:500}},_createEditButton:function(b,c,d){var e=c.split(" ",1)[0];return a('<button id="'+b+e+'" '+'type="button" class="btn edit-geometry-small geo-edit '+c+'">'+d+"</button>")},_create:function(){var a=this,b=this.options.markup.id_prefix;b.charAt(0)=="#"&&(b=b.substr(1)),this.scaleButton=this._createEditButton(b,"scale-button radio-button sel-button","Scale"),this.rotateButton=this._createEditButton(b,"rotate-button radio-button sel-button","Rotate"),this.dragButton=this._createEditButton(b,"drag-button radio-button sel-button","Drag"),this.deleteButton=this._createEditButton(b,"delete-button sel-button","Delete"),this.viewportButton=this._createEditButton(b,"viewport-button","Save View"),this.element.append(this.dragButton),this.element.append(this.rotateButton),this.element.append(this.scaleButton),this.element.append(this.deleteButton),this.element.append(this.viewportButton),this.radioButtons=this.element.children("button.radio-button"),this.selectionButtons=this.element.children("button.sel-button"),this.radioButtons.data("activated",!1),this.disableAll(),this.element.bind({"select.nlfeatures":function(){a.enableAll()},"deselect.nlfeatures":function(){a.disableAll()}}),this.dragButton.bind({mousedown:function(){a.toggleButton(a.dragButton),a.triggerUpdateEvent()},click:function(a){a.preventDefault()}}),this.scaleButton.bind({mousedown:function(){a.toggleButton(a.scaleButton),a.triggerUpdateEvent()},click:function(a){a.preventDefault()}}),this.rotateButton.bind({mousedown:function(){a.toggleButton(a.rotateButton),a.triggerUpdateEvent()},click:function(a){a.preventDefault()}}),this.deleteButton.bind({mousedown:function(){a.element.trigger("delete.nlfeatures")},click:function(a){a.preventDefault()}}),this.viewportButton.bind({mousedown:function(){a.element.trigger("saveview.nlfeatures")},click:function(a){a.preventDefault()}})},showButtons:function(){this.element.children("button").css({display:"block !important",opacity:0}).stop().animate({opacity:1},this.options.animation.fade_duration),this.deactivateAllButtons()},hideButtons:function(){var a=this.element.children("button");a.stop().animate({opacity:0},this.options.markup.fade_duration,function(){a.css("display","none !important")})},deactivateAllButtons:function(){this.radioButtons.removeClass("primary").data("activated",!1)},disableAll:function(){this.selectionButtons.removeClass("primary").addClass("disabled"),this.selectionButtons.each(function(){this.disabled=!0})},enableAll:function(){this.selectionButtons.removeClass("disabled"),this.selectionButtons.each(function(){this.disabled=!1})},activateButton:function(a){this.deactivateAllButtons(),a.addClass("primary").data("activated",!0),this.element.trigger("lockfocus.nlfeatures")},deactivateButton:function(a){a.removeClass("primary").data("activated",!1),this.element.trigger("unlockfocus.nlfeatures")},toggleButton:function(a){a.data("activated")?this.deactivateButton(a):this.activateButton(a)},triggerUpdateEvent:function(){this.element.trigger("update.nlfeatures",[{drag:this.dragButton.data("activated"),rotate:this.rotateButton.data("activated"),scale:this.scaleButton.data("activated")}])}})}(jQuery),function(){var a={}.hasOwnProperty,b=function(b,c){function e(){this.constructor=b}for(var d in c)a.call(c,d)&&(b[d]=c[d]);return e.prototype=c.prototype,b.prototype=new e,b.__super__=c.prototype,b};(function(a){var c,d,e,f,g,h,i;return f=function(a){return a[0]==="#"?a.slice(1,a.length):a},i=function(a){return a!=null?a.toString():""},g=function(a,b,c,d){var e,f,g;return c==null&&(c=null),d==null&&(d=100),e=0,f=c!=null&&c!==0?function(){return a()||e>=c}:a,g=function(){return f()?b():(e++,setTimeout(g,d))},setTimeout(g,d)},h=function(a){return a!=null?a.substr(a.indexOf("\n")+1):""},c=function(){function b(a){this.widget=a}return b.prototype.initMap=function(){var b,c,d,e,f;return f=this.fields.map,c=this.widget.options.values,d={title:"Coverage",name:"Coverage",id:this.widget.element.attr("id"),geo:c.geo},e={mode:this.widget.options.mode,json:d,markup:{id_prefix:this.widget.options.id_prefix}},c.zoom!=null&&(e.zoom=c.zoom),c.center!=null&&(e.center=c.center),c.base_layer!=null&&(e.base_layer=c.base_layer),b=a.extend(!0,{},this.widget.options.map_options,e),this.nlfeatures=f.nlfeatures(b).data("nlfeatures"),this.nlfeatures},b}(),e=function(c){function d(){return d.__super__.constructor.apply(this,arguments)}return b(d,c),d.prototype.init=function(){return this.build(),this.initMap(),this.populate()},d.prototype.build=function(){var b,c,d,e;return b=a(this.widget.element),d=f(this.widget.options.id_prefix),e=a("<div id='"+d+"map' class='map map-container'></div>"),c=a("<div id='"+d+"free' class='freetext'></div>"),b.addClass("nlfeatures").append(e).append(c),this.fields={map:a("#"+d+"map"),free:a("#"+d+"free")},b},d.prototype.populate=function(){var a,b;return a=this.widget.options.values.text,b=h(a),b===""?(this.fields.free.detach(),delete this.fields.free):this.fields.free.html(b)},d}(c),d=function(c){function d(){return d.__super__.constructor.apply(this,arguments)}return b(d,c),d.prototype.init=function(){return this.build(),this.initMap(),this.captureEditor(),this.populate(),this.wire()},d.prototype.build=function(){var b,c,d,e,g,h,i;return b=a(this.widget.element),c=f(this.widget.options.id_prefix),e=this.widget.options.name_prefix,h=this.widget.options.labels.html,i=this.widget.options.labels.map,d=a('<div class="nlfeatures map-container">\n  <div id="'+c+"map\"></div>\n  <div class='nlfeatures-map-tools'>\n    <div class='nlflash'></div>\n  </div>\n</div>"),g=a('<div class="nlfeatures text-container">\n  <input type="hidden" id="'+c+'geo" name="'+e+'[geo]" value="" />\n  <input type="hidden" id="'+c+'zoom" name="'+e+'[zoom]" value="" />\n  <input type="hidden" id="'+c+'center_lon" name="'+e+'[center_lon]" value="" />\n  <input type="hidden" id="'+c+'center_lat" name="'+e+'[center_lat]" value="" />\n  <input type="hidden" id="'+c+'base_layer" name="'+e+'[base_layer]" value="" />\n  <input type="hidden" id="'+c+'text" name="'+e+'[text]" value="" />\n  <textarea id="'+c+'free" name="'+e+'[free]" class="textinput" rows="5" cols="50"></textarea>\n  <div>\n    <label class="use-html">'+h+'\n      <input type="hidden" name="'+e+'[html]" value="0" />\n      <input type="checkbox" name="'+e+'[html]" id="'+c+'html" value="1" />\n    </label>\n    <label class="use-mapon">'+i+'\n      <input type="hidden" name="'+e+'[mapon]" value="0" />\n      <input type="checkbox" name="'+e+'[mapon]" id="'+c+'mapon" value="1" />\n    </label>\n  </div>\n</div>'),b.addClass("nlfeatures").addClass("nlfeatures-edit").append(d).append(g),this.fields={map_container:b.find(".map-container"),text_container:b.find(".text-container"),map:a("#"+c+"map"),map_tools:b.find(".nlfeatures-map-tools"),mapon:a("#"+c+"mapon"),text:a("#"+c+"text"),free:a("#"+c+"free"),html:a("#"+c+"html"),geo:a("#"+c+"geo"),zoom:a("#"+c+"zoom"),center_lon:a("#"+c+"center_lon"),center_lat:a("#"+c+"center_lat"),base_layer:a("#"+c+"base_layer"),flash:b.find(".nlflash")},b},d.prototype.captureEditor=function(){var a=this;return this.fields.mapon.change(function(){return a._onUseMap()}),this.fields.html.change(function(){return a._updateTinyEvents()})},d.prototype.populate=function(a){var b,c;return a==null&&(a=this.widget.options.values),this.fields.html.attr("checked",a.is_html),this.fields.mapon.attr("checked",a.is_map),this.fields.geo.val(i(a.geo)),this.fields.zoom.val(i(a.zoom)),this.fields.center_lon.val(i((b=a.center)!=null?b.lon:void 0)),this.fields.center_lat.val(i((c=a.center)!=null?c.lat:void 0)),this.fields.base_layer.val(i(a.base_layer)),this.fields.text.val(i(a.text)),this.fields.free.val(h(a.text))},d.prototype.wire=function(){var a,b=this;return a=function(){return b.updateFields()},this.fields.free.change(a),this.nlfeatures.element.bind("featureadded.nlfeatures",a).bind("update.nlfeatures",a).bind("delete.nlfeatures",a).bind("refresh.nlfeatures",a).bind("saveview.nlfeatures",function(){return b.nlfeatures.saveViewport(),b.updateFields(),b.flash("View Saved...")}),this.nlfeatures.map.events.on({changebaselayer:a})},d.prototype.usesHtml=function(){return this.fields.html.is(":checked")},d.prototype.usesMap=function(){return this.fields.mapon.is(":checked")},d.prototype.showMap=function(){var a,b=this;return a=this.fields.map.children("button"),a.hide("normal",function(){return b.fields.map_container.slideDown("normal",function(){return a.fadeIn()})})},d.prototype.hideMap=function(){var a,b=this;return a=this.fields.map.children("button"),a.fadeOut("normal",function(){return b.fields.map_container.slideUp()})},d.prototype._onUseMap=function(){return this.usesMap()?this.showMap():this.hideMap(),this.updateFields()},d.prototype._updateTinyEvents=function(){var a,b=this;return this.usesHtml()?(a=this.fields.free.attr("id"),g(function(){return tinymce.get(a)!=null},function(){var c;return b.fields.free.unbind("change"),c=tinymce.get(a),c.onChange.add(function(){return b.updateFields(c.getContent())})})):this.fields.free.change(function(){return b.updateFields(b.fields.free.val())})},d.prototype.updateFields=function(a){var b,c,d,e;return d=this.nlfeatures.getKml(),this.fields.geo.val(d),e=this.nlfeatures.getSavedZoom(),e!=null&&this.fields.zoom.val(e),c=this.nlfeatures.getSavedCenter(),c!=null&&(this.fields.center_lon.val(c.lon),this.fields.center_lat.val(c.lat)),b=this.nlfeatures.getBaseLayerCode(),b!=null&&this.fields.base_layer.val(b),this.fields.text.val(""+d+"|"+e+"|"+(c!=null?c.lon:void 0)+"|"+(c!=null?c.lat:void 0)+"|"+b+"\n"+a)},d.prototype.flash=function(a,b){var c=this;return b==null&&(b=5e3),this.fields.flash.html(a).fadeIn("slow",function(){return setTimeout(function(){return c.fields.flash.fadeOut("slow")},b)})},d}(c),a.widget("nlfeatures.featurewidget",{options:{mode:"view",id_prefix:null,name_prefix:null,labels:{html:"Use HTML",map:"Use Map"},map_options:{},values:{geo:null,zoom:null,center:null,text:null,is_html:null,is_map:null}},_create:function(){var a,b,c,f,g;a=this.element.attr("id"),(f=(b=this.options).id_prefix)==null&&(b.id_prefix="#"+a.substring(0,a.length-"widget".length)),(g=(c=this.options).name_prefix)==null&&(c.name_prefix=this._idPrefixToNamePrefix()),this.mode=this.options.mode==="edit"?new d(this):new e(this),this.mode.init();if(!this.options.values.is_map)return this.mode.hideMap()},_idPrefixToNamePrefix:function(a){var b,c,d,e;return a==null&&(a=this.options.id_prefix),a=f(a),e=function(){var b,c,e,f;e=a.split("-"),f=[];for(b=0,c=e.length;b<c;b++)d=e[b],d.length>0&&f.push(d);return f}(),b=e.shift(),c=function(){var a,b,c;c=[];for(a=0,b=e.length;a<b;a++)d=e[a],c.push("["+d+"]");return c}(),""+b+c.join("")},destroy:function(){return a.Widget.prototype.destroy.call(this)},_setOptions:function(b,c){return a.Widget.prototype._setOption.apply(this,arguments)}})})(jQuery)}.call(this)