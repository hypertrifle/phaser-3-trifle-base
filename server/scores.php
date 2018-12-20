<?php
require("filterlist.php");
header('Access-Control-Allow-Origin: *');  
$host="localhost:3307"; // Host name 
$username="highscores"; // Mysql username 
$password="highscores"; // Mysql password 
$db_name="highscores"; // Database name 
$tbl_name="entries"; // Table name



$insert = "";
$offset = 0;

function clean($text, $filter_list){
    for ($j=0; $j < count($filter_list); ++$j) {
        if (stripos($text, $filter_list[$j]) !== false) {
            $text = str_ireplace($filter_list[$j], substr("*****************************************************************************",0,strlen($filter_list[$j])),$text);
        }
    }

    return $text;
}

function truncate($text, $chars = 25) {
    if (strlen($text) <= $chars) {
        return $text;
    }
    $text = $text." ";
    $text = substr($text,0,$chars);
    return $text;
}

 //attempt to establish connection to the database
 $mysqli = new mysqli($host, $username, $password, $db_name);
  //Error with connection
  if ($mysqli->connect_errno) {

    //  echo "Error: Failed to make a MySQL connection,\n";
    //  echo "Errno: " . $mysqli->connect_errno . "\n";
    //  echo "Error: " . $mysqli->connect_error . "\n";
     exit;
 }

if (isset($_POST['s'])) {
     //we have a set parameter
     $s = (string) $_POST['s'];


     try {
          $entry = json_decode(base64_decode(str_rot13($s)));
        //   print_r($entry);
          //error checking on the object after decoding
          if(!property_exists($entry, "name") || !property_exists($entry, "client_secret") || !property_exists($entry, "score") || !property_exists($entry, "email")){
              exit;
          }

          //uppercase name?
          $entry->name = strtoupper(truncate($entry->name));

          
          //limit name length?
          
          //format ready for DB entry
          $entry->name = $mysqli->real_escape_string($entry->name);
          $entry->client_secret = $mysqli->real_escape_string($entry->client_secret);
          $entry->score = $mysqli->real_escape_string($entry->score);
          $entry->email = $mysqli->real_escape_string($entry->email);

          //generate insert
          $insert = "INSERT INTO `$db_name`.`entries` (`name`,`score`,`email`,`client_secret`) VALUES ('$entry->name','$entry->score','$entry->email','$entry->client_secret');";


     } catch (Exception $e) {
          echo 'invalid entry string, ',  $e->getMessage(), "\n";
          $insert = "";
     }



 } 




 


 $last_id = -1;

 // if we want to do an insert.
 if($insert != ""){
     
     if (!$entry_result = $mysqli->query($insert)) {
            
        $last_id = $mysqli->insert_id;
     
          //The query returned false 
        //   echo 'There was a problem saving your score. Please try again later.';
        //   echo "Error: Our query failed to execute and here is why: \n";
        //   echo "Query: " . $insert . "\n";
        //   echo "Errno: " . $mysqli->errno . "\n";
        //   echo "Error: " . $mysqli->error . "\n";
     
     } else {
        //insert went fine.
        // print($entry->score);
        // print("-");
       $offsetQuery = "SELECT count(*) FROM `entries` WHERE score < ".$entry->score." AND state = 0";
       if ($result = $mysqli->query($offsetQuery)) {
        $offset = $result->fetch_assoc()['count(*)']; //TODO: is this safe / error checking.

        $offset = $offset - 3;
        if($offset < 0){
            $offset = 0;
        }

       }
     }
 }


// print($offset);
 
 // get all the scores objects.
 $sql = "SELECT name, score FROM entries WHERE 'state' = 0 ORDER BY score LIMIT 6 OFFSET ".$offset. "";

 //TODO: here we might want to format all the object ()
 
 if (!$result = $mysqli->query($sql)) {
     // Oh no! The query failed. 
     echo "Sorry, the website is experiencing problems.";
 
     // Again, do not do this on a public site, but we'll show you how
     // to get the error information
    //  echo "Error: Our query failed to execute and here is why: \n";
    //  echo "Query: " . $sql . "\n";
    //  echo "Errno: " . $mysqli->errno . "\n";
    //  echo "Error: " . $mysqli->error . "\n";
     exit;
 }
 
 //check for no errrors
 if ($result->num_rows === 0) {
     echo "No entries Revieved";
     exit;
 }
 
 $entires = array();
 $pos = $offset;
 while ($entry = $result->fetch_assoc()) {
     $pos ++;

     $obj = $entry;
     $obj["position"] = $pos;


     $obj["name"] = clean($obj["name"], $filter_list);

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