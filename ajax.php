<?php
/**
 * Prints a JSON based on $_POST values
 *  - input : the data that was filled in the autocomplete field
 *  - limit : limits the number of results
 *
 */

require_once 'firstnames.php';

$input  = isset($_POST['input']) ? $_POST['input'] : '';
$limit  = isset($_POST['limit']) ? $_POST['limit'] : 10;

$values = array();
if ($input != '') {


    foreach ($firstnames as $firstname)
    {
        if (strstr($firstname, $input) && count($values) <= $limit) {
            $values[] = $firstname;
        }

    }
}

echo json_encode($values);

