<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @author      Eric Rochester <erochest@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?><?php

if (!defined('NEATLINE_FEATURES_PLUGIN_DIR')) {
    define('NEATLINE_FEATURES_PLUGIN_DIR', dirname(__FILE__) . '/..');
}
// For some reason, this isn't getting picked up when running tests.
require_once 'application/models/Plugin.php';
require_once 'NeatlineFeaturesPlugin.php';

/**
 * This is a base class for all NeatlineFeatures unit tests.
 **/
class NeatlineFeatures_Test extends Omeka_Test_AppTestCase
{

    // Variables {{{
    /**
     * The NeatlineFeaturesPlugin object.
     *
     * @var NeatlineFeaturesPlugin
     **/
    public $nfPlugin;

    /**
     * The user we're logged in as.
     *
     * @var User
     **/
    public $user;
    // }}}

    // Test Infrastructure {{{
    /**
     * Set ups up for each test.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function setUp()
    {
        parent::setUp();

        $this->user = $this->db->getTable('user')->find(1);
        $this->_authenticateUser($this->user);

        $plugin_broker = get_plugin_broker();
        $this->nfPlugin = $this->_addHooksAndFilters(
            $plugin_broker, 'NeatlineFeatures');
        $helper = new Omeka_Test_Helper_Plugin();
        $helper->setUp('NeatlineFeatures');

        $this->_dbHelper = Omeka_Test_Helper_Db::factory($this->core);
    }

    /**
     * This creates the plugin and sets the current plugin directory.
     *
     * @param PluginBroker $plugin_broker The current plugin broker.
     * @param string       $plugin_name   The name of the plugin to load.
     *
     * @return Instance of the plugin class.
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function _addHooksAndFilters($plugin_broker, $plugin_name)
    {
        $class_name = $plugin_name . 'Plugin';
        $plugin_broker->setCurrentPluginDirName($plugin_name);
        return (new $class_name);
    }

    /**
     * Tears down after each test.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function tearDown()
    {
        parent::tearDown();
        $this->nfPlugin->uninstall();
    }
    // }}}

}
