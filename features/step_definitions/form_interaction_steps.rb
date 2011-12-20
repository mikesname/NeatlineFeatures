
Given /^I click(?: on)? "([^"]*)"$/ do |link_text|
  click_on link_text
end

Given /^I click(?: on)? XPath "([^"]*)"$/ do |xpath|
  find(:xpath, xpath).click
end

Given /^I enter "([^"]*)" for the "([^"]*)"(?:\s+\#.*)?$/ do |value, label|
  fill_in(label, :with => value)
end

Given /^I enter "([^"]*)" into the "([^"]*)" field$/ do |value, label|
  fill_in(label, :with => value)
end

Given /^I enter "([^"]*)" into "([^"]*)"$/ do |value, field|
  wait_until do
    fill_in field, :with => value
  end
end

Given /^I click "([^"]*)" checkbox in "([^"]*)"$/ do |checkbox, parent|
  within(parent) do
    check checkbox
  end
end

When /^I press "([^"]*)"$/ do |button|
  click_on button
end

When /^I click "OK" in the alert$/ do
  page.driver.browser.switch_to.alert.accept
end

Then /^"([^"]*)" should be checked$/ do |checkbox|
  page.has_checked_field?(checkbox).should == true
end

Then /^"([^"]*)" should not be checked$/ do |checkbox|
  page.has_checked_field?(checkbox).should == false
end

Then /^I see "([^"]*)" contains "([^"]*)"$/ do |input, content|
  find(input).value.should have_content(content)
end

