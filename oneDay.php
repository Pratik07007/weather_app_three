<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type:application/json"); // Set the visuals to JSON format (application/json)
include"functions.php"; //includes all_functions.php to this php 

function fetch_from_database($connection, $city)
{
    try {
        $result = $connection->query("SELECT * FROM `weatherData`
        WHERE city='$city' ORDER BY `id` DESC LIMIT 1");
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
    $connection =connect_database("localhost", "root", "", "weatherApp");
    if (isset($_GET["city"])) {
        if ($_GET["city"] == null) {
            echo '{"error": "No city provided please enter a city"}';
        } else {
            $city = $_GET["city"];
            $response_database = fetch_from_database($connection, $city); //gives an associate array
            // var_dump($response_database);
            // echo(json_encode($response_database));
            if ($response_database==[]) { // If not available in database
                $response = fetch_from_api_openweathermaps($city);
                // var_dump($response);
                if ($response) {
                    add_to_database($connection, $response);
                    $data = fetch_from_database($connection, $city);
                    echo (json_encode($data[0]));
                } else {
                    echo '{"error":"City not found"}';
                }
            } else { // If available in database
                $latest_data = $response_database[0];
                $time_of_response_latest_data = intval($latest_data["time_fetched"]);
                if ((time() - $time_of_response_latest_data)>1000) {
                    $response = fetch_from_api_openweathermaps($city);
                    add_to_database($connection, $response);
                    $data = fetch_from_database($connection, $city);
                    echo (json_encode($data[0]));
                } else {
                    echo (json_encode($latest_data));
    
                }
            }
        }
    } else {
        echo '{"error": "Invalid API QUERY STRING"}';
    }
}

fetch_data();
