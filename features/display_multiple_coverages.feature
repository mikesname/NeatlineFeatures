
Feature: Display Multiple Coverages
  As a theme developer
  I want to be able to display coverage data from a mixed collection of fields
  So that visitors can see all coverage data.

  @file_fixture
  Scenario: All Non-Feature Coverages
    Given I am logged into the admin console
    And I replace "../../themes/default/items/show.php" with "features/data/show-display-coverage-delim.php"
    And I click "Add a new item to your archive"
    And I enter "Cucumber: Display All Non-Feature Coverages" for the "Elements-50-0-text"      # Title
    And I enter "Display All Non-Feature Coverages" for the "Elements-49-0-text"      # Subject
    And I click the "Raw" tab in "#Elements-38-0-widget"
    And I enter "Charlottesville, VA" into "Elements-38-0-text"
    And I click "add_element_38"
    And I click the "Raw" tab in "#Elements-38-1-widget"
    And I enter "UVa" into "Elements-38-1-text"
    And I click on "Add Item"
    And I click "Display All Non-Feature Coverages"
    When I click "View Public Page"
    Then I should see text "Charlottesville, VA; UVa" in "#dublin-core-coverage"

  @file_fixture
  Scenario: All Feature Coverages
    Given I am logged into the admin console
    And I replace "../../themes/default/items/show.php" with "features/data/show-display-coverage-delim.php"
    And I click "Add a new item to your archive"
    And I enter "Cucumber: Display All Feature Coverages" for the "Elements-50-0-text"      # Title
    And I enter "Display All Feature Coverages" for the "Elements-49-0-text"      # Subject
    And I draw a point on "div#Elements-38-0-map.olMap"
    And I click on "add_element_38"
    And I draw a line on "div#Elements-38-1-map.olMap"
    And I click on "Add Item"
    And I click "Display All Feature Coverages"
    When I click "View Public Page"
    Then the map at "(//div[@id='dublin-core-coverage']//div[@class='nlfeatures'])[1]" should have a point feature
    And the map at "(//div[@id='dublin-core-coverage']//div[@class='nlfeatures'])[2]" should have a line feature

  @file_fixture
  Scenario: Mixed Feature Coverages
    Given I am logged into the admin console
    And I replace "../../themes/default/items/show.php" with "features/data/show-display-coverage-delim.php"
    And I click "Add a new item to your archive"
    And I enter "Cucumber: Display Mixed Feature Coverages" for the "Elements-50-0-text"      # Title
    And I enter "Display Mixed Feature Coverages" for the "Elements-49-0-text"      # Subject
    And I draw a point on "div#Elements-38-0-map.olMap"
    And I click on "add_element_38"
    And I click the "Raw" tab in "#Elements-38-1-widget"
    And I enter "UVa" into "Elements-38-1-text"
    And I click on "Add Item"
    And I click "Display Mixed Feature Coverages"
    When I click "View Public Page"
    Then the map at "//div[@id='dublin-core-coverage']//div[@class='nlfeatures']" should have a point feature
    And I should see text "UVa" in "#dublin-core-coverage"

