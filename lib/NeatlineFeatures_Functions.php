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
 * @author      Eric Rochester <erochest@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?><?php

require_once NEATLINE_FEATURES_PLUGIN_DIR . '/lib/NeatlineFeatures/Utils/View.php';

/**
 * This makes a best guess at whether a string contains WKT data.
 *
 * This test is pretty lame. Currently, it just looks for some feature types.
 *
 * @param string $maybe_wkt This is the string to test.
 *
 * @return bool
 * @author Eric Rochester <erochest@virginia.edu>
 **/
function nlfeatures_is_wkt($maybe_wkt)
{
    $is_wkt = false;
    $wkt_features = array(
        'POINT',
        'LINESTRING',
        'POLYGON',
        'MULTIPOINT',
        'MULTILINESTRING',
        'MULTIPOLYGON'
    );

    foreach ($wkt_features as $feature) {
        $is_wkt = $is_wkt || (preg_match("/\\b$feature\\b/", $maybe_wkt) > 0);
        if ($is_wkt) {
            break;
        }
    }

    return $is_wkt;
}

/**
 * This returns the string to display a coverage field, whether a map or not.
 *
 * @param string           $text        The original text for the element.
 * @param Omeka_Record     $record      The record that this text applies to.
 * @param ElementText|null $elementText The ElementText record that stores this 
 * text. (This is optional and defaults to null.)
 *
 * @return string
 * @author Eric Rochester <erochest@virginia.edu>
 **/
function nlfeatures_display_coverage($text, $record, $elementText=null)
{
    $output = $text;

    if ($text != "" && nlfeatures_is_wkt($text)) {
        $util = new NeatlineFeatures_Utils_View();
        $util->setViewOptions($text, $record, $elementText);
        $output = $util->getView();
    }

    return $output;
}
