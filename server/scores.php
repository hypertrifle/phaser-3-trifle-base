<?php
header('Access-Control-Allow-Origin: *');

$host="localhost:3307"; // Host name 
$username="highscores"; // Mysql username 
$password="highscores"; // Mysql password 
$db_name="highscores"; // Database name 
$tbl_name="entries"; // Table name


// $test_data = "eyJzY29yZSI6NTU3NjUsIm5hbWUiOiJURVNUSU4iLCJjbGllbnRfc2VjcmV0IjoidGVzdF9lbnRyeV9kYXRhIiwiZW1haWwiOiIifQ==";
// $object = json_decode(base64_decode($test_data));
// print_r($object);
// exit;

$insert = "";
$offset = 0;
if (isset($_GET['s'])) {
     //we have a set parameter
     $s = (string) $_GET['s'];


     try {
          $entry = json_decode(base64_decode($s));
          //error checking on the object after decoding
     
          //format ready for DB entry

          //generate insert
          $insert = "INSERT INTO `$db_name`.`entries` (`name`,`score`,`email`,`client_secret`) VALUES ('$entry->name','$entry->score','$entry->email','$entry->client_secret');";


     } catch (Exception $e) {
          echo 'invalid entry string, ',  $e->getMessage(), "\n";
          $insert = "";
     }



 } 



 //attempt to establish connection to the database/
 $mysqli = new mysqli($host, $username, $password, $db_name);
 
 //Error with connection
 if ($mysqli->connect_errno) {

     echo "Error: Failed to make a MySQL connection,\n";
     echo "Errno: " . $mysqli->connect_errno . "\n";
     echo "Error: " . $mysqli->connect_error . "\n";
     exit;
 }

 $last_id = -1;

 // if we want to do an insert.
 if($insert != ""){
     
     if (!$entry_result = $mysqli->query($insert)) {
            
        $last_id = $mysqli->insert_id;
     
          //The query returned false 
          echo 'There was a problem saving your score. Please try again later.';
          echo "Error: Our query failed to execute and here is why: \n";
          echo "Query: " . $insert . "\n";
          echo "Errno: " . $mysqli->errno . "\n";
          echo "Error: " . $mysqli->error . "\n";
     
     } else {
        //insert went fine.
       $offsetQuery = "SELECT count(*) FROM `entries` WHERE score <=".$entry->score." AND state = 0";
       if ($result = $mysqli->query($offsetQuery)) {
        $offset = $result->fetch_assoc()['count(*)']; //TODO: is this safe / error checking.

        $offset = $offset - 3;
        if($offset < 0){
            $offset = 0;
        }

       }
     }
 }



 
 // get all the scores objects.
 $sql = "SELECT name, score, id FROM entries WHERE 'state' = 0 ORDER BY score LIMIT 6 OFFSET ".$offset;

 //TODO: here we might want to format all the object ()
 
 if (!$result = $mysqli->query($sql)) {
     // Oh no! The query failed. 
     echo "Sorry, the website is experiencing problems.";
 
     // Again, do not do this on a public site, but we'll show you how
     // to get the error information
     echo "Error: Our query failed to execute and here is why: \n";
     echo "Query: " . $sql . "\n";
     echo "Errno: " . $mysqli->errno . "\n";
     echo "Error: " . $mysqli->error . "\n";
     exit;
 }
 
 //check for no errrors
 if ($result->num_rows === 0) {
     echo "No entries Revieved";
     exit;
 }
 
 $entires = array();
 $pos = 0;
 while ($entry = $result->fetch_assoc()) {
     $pos ++;

     $obj = $entry;
     $obj["position"] = $pos;

     array_push($entires, $obj);
 }


 echo json_encode($entires);
 

 // close connection.
 if(isset($entry_result) && $entry_result != false && $entry_result != true){
     $entry_result->free();
 }

 $result->free();
 $mysqli->close();
 ?>