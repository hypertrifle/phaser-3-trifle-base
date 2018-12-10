<?php
        // Configuration
        $hostname = 'localhot';
        $username = 'yourusername';
        $password = 'yourpassword';
        $database = 'yourdatabase';
 
        $secretKey = "mySecretKey"; // Change this value to match the value stored in the client javascript below 
 
        try {
            $dbh = new PDO('mysql:host='. $hostname .';dbname='. $database, $username, $password);
        } catch(PDOException $e) {
            echo '<h1>An error has ocurred.</h1><pre>', $e->getMessage() ,'</pre>';
        }
 
        $realHash = md5($_GET['name'] . $_GET['score'] . $secretKey); 

        //if a set (we should store and update table)
        if($realHash == $hash) { 
            $sth = $dbh->prepare('INSERT INTO scores VALUES (null, :name, :score)');
            try {
                $sth->execute($_GET);
            } catch(Exception $e) {
                echo '<h1>An error has ocurred.</h1><pre>', $e->getMessage() ,'</pre>';
            }
        } 

        //now we just want to server that value
        
        //if we set previouslty we shoiuld get for that resutl
      
        //if not get as if we where a new entry.
        $query = "SELECT * FROM `scores` ORDER by `score` DESC LIMIT 5";
        $result = mysql_query($query) or die('Query failed: ' . mysql_error());
     
        $num_results = mysql_num_rows($result);  
     
        for($i = 0; $i < $num_results; $i++)
        {
             $row = mysql_fetch_array($result);
             echo $row['name'] . "\t" . $row['score'] . "\n";
        }
?>