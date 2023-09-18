<?php

    //path to the connection script
    require_once('connect.php');

    //query to get all commodities
    $query = "SELECT * FROM `commodities`";
    //send the query, and store the result in the variable contents 
    $contents = $connection->query($query);
    //an array to store commodity json items
    $commodities = array();

    //if valid parse then add data to our array
    if($contents != FALSE){
        //add each rows values to the array
        while($row = $contents->fetch()) 
        {
            $commodities[] = $row;
        }
        echo json_encode($commodities);
        
    }
    ?>