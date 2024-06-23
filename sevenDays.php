<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type:application/json"); // Set the visuals to JSON format (application/json)
include "functions.php"; //includes main_functions.php to this php 

function fetch_from_database($connection, $city)
{
    try {
        $result = $connection->query("SELECT * FROM weatherData WHERE city = '$city' GROUP by date ORDER BY time_fetched DESC limit 7");
        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            return ($data);
        } else {
            return null;
        }
    } catch (Exception $th) {
        return ["error" => $th->getMessage()];
    }
}


function fetch_data()
{
    $connection =connect_database("mysql2.serv00.com", "m33384_anket", "m3384_weatherApp", "m3384_weatherApp");
    if (isset($_GET["city"])) {
        if ($_GET["city"] == null) {
            echo '{"error": "No city provided please enter a city"}';
        } else {
            $city = $_GET["city"];
            $response_database = fetch_from_database($connection, $city);
            // var_dump($response_database);
            if (count($response_database) == 0) { 
                $response = fetch_from_api_openweathermaps($city);
                if ($response) {
                    add_to_database($connection, $response);
                    $data = fetch_from_database($connection, $city);
                    echo (json_encode($data));
                } else {
                    echo '{"error":"City not found"}';
                }
            } 
            else { 
                $latest_data = $response_database[0];
                $time_of_response_latest_data = $latest_data["time_fetched"];
                if ((time() - $time_of_response_latest_data) > 86400) {
                    $response = fetch_from_api_openweathermaps($city);
                    add_to_database($connection, $response);
                    $data = fetch_from_database($connection, $city);
                    echo (json_encode($data));
                } else {
                    echo(json_encode($response_database));

                }
            }
        }
    } else {
        echo '{"error": "Invalid API STRING QUERY"}'; 
    }
}

fetch_data();

