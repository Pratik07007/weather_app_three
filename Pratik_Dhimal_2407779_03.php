<?php
header("Access-Control-Allow-Origin: *"); // Gives HTML the access to this PHP script in order to fetch data
header("Content-Type:application/json"); // Set the visuals to JSON format (application/json)
include"Pratik_Dhimal_2407779_01.php"; //includes all_functions.php to this php 

/**
 * Adds weather data to the database.
 *
 * parameter mixed     $connection MySQLi connection
 * parameter array $data       Weather data to be added to the database.
 *
 * return mixed Array containing error message if any.
 */
function fetch_from_database($connection, $city)
{
    try {
        $result = $connection->query("SELECT * FROM `weather_data`
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

function fetch_data($refreshtime)
{
    $connection = connect_database("mysql2.serv00.com", "m2758_pratik", "Admin@123", "m2758_weather");
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
                // var_dump($time_of_response_latest_data);
                if ((time() - $time_of_response_latest_data)>$refreshtime) {
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

fetch_data(14400); // Refresh time = 4 hours

