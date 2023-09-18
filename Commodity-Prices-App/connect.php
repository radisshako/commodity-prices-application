<?php
    //Connection script to the databse for the commodities data
    //try to connect to the databse
    try{
        //construct a pdo obejct called connection
        $connection = new PDO('mysql:host=x0;dbname=x1','x2', 'x3');
    }

    catch(PDOException $ex){
        //display an error message
        echo "Failed to connect to the databse " .$ex->getMessage();
        exit();
    }
    ?>
