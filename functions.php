<?php
header("Access-Control-Allow-Origin: *");




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


function fetch_from_api_openweathermaps($city)
{
    $apiId = "653de78f3a1ed50c44ea46115bcde96f";
    $url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $city . '&appid=' . $apiId . '&units=metric';
    $response = @file_get_contents($url);
    if ($response) {
        $data = json_decode($response, true);
        return $data;
    } else {
        return null;
    }
}




function add_to_database($connection, $data)
{
    try {
        $city = $data["name"];
        $country = $data["sys"]["country"];
        $temp = $data["main"]["temp"];
        $pressure = $data["main"]["pressure"];
        $humidity = $data["main"]["humidity"];
        $windspeed = $data["wind"]["speed"];
        $timestamp = $data["dt"];
        $description = $data["weather"][0]["description"];
        $icon = $data["weather"][0]["icon"];
        $date = date('Y-m-d', $timestamp);
        $time_fetched = time();
        $connection->query("INSERT INTO `weatherData` (`city`, `country`, `temp`, `pressure`, `humidity`, `windspeed`, `timestamp`, `description`, `icon`,`date`,`time_fetched`) VALUES ('$city', '$country', '$temp','$pressure', '$humidity', '$windspeed', '$timestamp', '$description', '$icon','$date','$time_fetched'); ");

    } catch (Exception $th) {
        return ["error" => $th->getMessage()];
    }
}