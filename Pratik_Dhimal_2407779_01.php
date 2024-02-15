<?php
header("Access-Control-Allow-Origin: *");
/**
 * Establishes a connection to the database.
 *
 * parameter string $host     The database host name.
 * parameter string $username The database username.
 * parameter string $password The database password.
 * parameter string $db       The database name.
 *
 * return mixed MySQLi connection object or error code.
 */
function connect_database($host, $username, $password, $db)
{
    try {
        $connection = new mysqli($host, $username, $password, $db);
        if ($connection->connect_errno) {
            return $connection->connect_errno;
        } else {
            return $connection;
        }
    } catch (Exception $th) {
        return ["error" => $th->getMessage()];
    }
}

/**
 * Fetches weather data from the OpenWeatherMap API.
 *
 * parameter string $city The city for which weather data is requested from the API.
 *
 * return array|null Weather data fetched from the API of OpenWeatherMap.
 */
function fetch_from_api_openweathermaps($city)
{
    $apiId = "f54929d4ba750560197d17505125a8ff";
    $url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $city . '&appid=' . $apiId . '&units=metric';
    $response = @file_get_contents($url);
    if ($response) {
        $data = json_decode($response, true);
        return $data;
    } else {
        return null;
    }
}




/**
 * Adds weather data to the database.
 *
 * parameter mixed     $connection MySQLi connection
 * parameter array $data       Weather data to be added to the database.
 *
 * return mixed Array containing error message if any.
 */
function add_to_database($connection, $data)
{
    try {
        $city = $data["name"];
        $country = $data["sys"]["country"];
        $temp = $data["main"]["temp"];
        $temp_high = $data["main"]["temp_max"];
        $temp_low = $data["main"]["temp_min"];
        $feelslike = $data["main"]["feels_like"];
        $pressure = $data["main"]["pressure"];
        $humidity = $data["main"]["humidity"];
        $windspeed = $data["wind"]["speed"];
        $timestamp = $data["dt"];
        $description = $data["weather"][0]["description"];
        $icon = $data["weather"][0]["icon"];
        $date = date('Y-m-d', $timestamp);
        $time_fetched = time();
        $connection->query("INSERT INTO `weather_data` (`city`, `country`, `temp`, `temp_high`, `temp_low`, `feelslike`, `pressure`, `humidity`, `windspeed`, `timestamp`, `description`, `icon`,`date`,`time_fetched`) VALUES ('$city', '$country', '$temp', '$temp_high', '$temp_low', '$feelslike', '$pressure', '$humidity', '$windspeed', '$timestamp', '$description', '$icon','$date','$time_fetched'); ");

    } catch (Exception $th) {
        return ["error" => $th->getMessage()];
    }
}