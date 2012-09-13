
Given /^I draw a point on "([^"]*)"$/ do |map|
  find(map).find('div.olMapViewport')
  find(map).find('.olControlDrawFeaturePointItemInactive').click

  browser = page.driver.browser
  map_el = browser.find_element(:css, map).
                   find_element(:css, 'div.olMapViewport').
                   find_element(:tag_name, 'div')
  browser.action.move_to(map_el, 50, 50).
                 click.
                 perform
end

Given /^I draw a line on "([^"]*)"$/ do |map|
  find(map).find('div.olMapViewport')
  find(map).find('.olControlDrawFeaturePathItemInactive').click

  browser = page.driver.browser
  map_el = browser.find_element(:css, map).
                   find_element(:css, 'div.olMapViewport').
                   find_element(:tag_name, 'div')
  browser.action.move_to(map_el, 50, 50).
                 click.
                 move_to(map_el, 100, 150).
                 double_click.
                 perform
end

Given /^I switch to the "([^"]*)" base layer on "([^"]*)"/ do |base_layer, map|
  map_div = find(map)

  map_div.find('div.olMapViewport')
  map_div.find('.maximizeDiv').click
  map_div.find(:xpath, ".//input[@value='#{base_layer}']").should be_visible
  map_div.find('.layersDiv').should be_visible
  map_div.find('.layersDiv').find(:xpath, ".//input[@value='#{base_layer}']").should be_visible
  map_div.find('.layersDiv').
          find(:xpath, ".//input[@value='#{base_layer}']").
          click
end

Given /^I move "([^"]*)" to "(-?\d*\.\d*), (\d*\.\d*)"/ do |map, lon, lat|
  sleep 5
  evaluate_script("jQuery('#{map}').data('nlfeatures').setCenterLonLat(#{lon}, #{lat})")
end

Given /^I zoom "([^"]*)" to "(\d*)"/ do |map, zoom|
  sleep 5
  evaluate_script("jQuery('#{map}').data('nlfeatures').setZoom(#{zoom})")
end

Then /^I should see a map in "([^"]*)"$/ do |parent|
  within(parent) do
    find(".olMap").should be_visible
  end
end

Then /^I should see a map$/ do |arg1|
  find('.olMap').should be_visible
end

Then /^I should not see a map$/ do |arg1|
  find('.olMap').should_not be_visible
end

Then /^I should not see a map in "([^"]*)"$/ do |parent|
  within(parent) do
    find('.olMap').should_not be_visible
  end
end

Then /^I should see an OpenLayers map$/ do
  find('.olMap').should be_visible
end

Then /^I should see an OpenLayers map in the "([^"]*)" field$/ do |parent|
  within(parent) do
    find(".olMap").should be_visible
  end
end

Then /^I should not see an OpenLayers map in the "([^"]*)" field$/ do |parent|
  find(parent).should have_no_css(".olMap")
end

Then /^a point is defined in "([^"]*)"$/ do |textarea|
  find(textarea).value.should match(/<Point>/)
end

Then /^a line is defined in "([^"]*)"$/ do |textarea|
  find(textarea).value.should match(/<LineString>/)
end

Then /^the viewport is defined in "([^"]*)"$/ do |widget|
  find("##{widget}-zoom").value.should match(/\d/)
  find("##{widget}-center_lon").value.should match(/\d/)
  find("##{widget}-center_lat").value.should match(/\d/)
end

Then /^the map in "([^"]*)" should have a point feature$/ do |parent|
  within(parent) do
    find('script').should have_content('<Point>')
  end
end

Then /^the map in "([^"]*)" should have a line feature$/ do |parent|
  within(parent) do
    find('script').should have_content('<LineString>')
  end
end

Then /^the map at "([^"]*)" should have a point feature$/ do |xpath|
  parent = find(:xpath, xpath)
  script = parent.find(:xpath, 'following-sibling::script')
  script.should have_content('<Point>')
end

Then /^the map at "([^"]*)" should have a line feature$/ do |xpath|
  parent = find(:xpath, xpath)
  script = parent.find(:xpath, 'following-sibling::script')
  script.should have_content('<LineString>')
end

Then /^the map at "([^"]*)" should display a point feature$/ do |map|
  sleep 5
  result = evaluate_script("jQuery('#{map}').data('nlfeatures').hasPoint()")
  result.should be_true
end

Then /^the map at "([^"]*)" should display a line feature$/ do |xpath|
  sleep 5
  result = (evaluate_script("jQuery('#{map}').data('nlfeatures').hasLine()") == 'true')
  result.should be_true
end

Then /^"([^"]*)" should center on my location$/ do |map|
  sleep 5
  map_lon = evaluate_script("jQuery('#{map}').data('nlfeatures').getCenterLonLat().lon").to_f
  map_lat = evaluate_script("jQuery('#{map}').data('nlfeatures').getCenterLonLat().lat").to_f
  my_loc = GeoMagic::Remote.my_location
  (map_lon - my_loc.longitude.to_f).should be < 1.0
  (map_lat - my_loc.latitude.to_f ).should be < 1.0
end

Given /^"([^"]*)" should center on "(-?\d*\.\d*), (\d*\.\d*)"/ do |map, lon, lat|
  sleep 5
  map_lon = evaluate_script("jQuery('#{map}').data('nlfeatures').getCenterLonLat().lon").to_f
  map_lat = evaluate_script("jQuery('#{map}').data('nlfeatures').getCenterLonLat().lat").to_f
  (map_lon - lon.to_f).should be < 1.0
  (map_lat - lat.to_f).should be < 1.0
end

Given /^"([^"]*)" should be zoomed to "(\d*)"/ do |map, zoom|
  sleep 5
  map_zoom = evaluate_script("jQuery('#{map}').data('nlfeatures').map.getZoom()").to_i
  map_zoom.should be(zoom.to_i)
end

Then /^"([^"]*)" should have the base layer "([^"]*)"/ do |map, base_layer|
  sleep 5
  map_base_layer = evaluate_script("jQuery('#{map}').data('featurewidget').mode.nlfeatures.getBaseLayerCode()")
  map_base_layer.should == base_layer
end

