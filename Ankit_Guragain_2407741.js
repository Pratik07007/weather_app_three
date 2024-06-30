function insertWeatherDetails(data) {
  const dateandtime = () => {
    const date = new Date(data.timestamp * 1000);
    const localDateTime = date.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const DT = `${localDateTime}`;
    return DT;
  };

  const weatherElement = document.getElementById("weather");
  //construct URL for weather icon
  const weatherIconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  weatherElement.innerHTML = `
                <div style="display: flex; align-items: center; padding top: 50px">
                    <h1>${data.temp}°C</h1>
                    <img src="${weatherIconUrl}" style="margin-right: 10px; margin-left: 10px">
                    <h1>${data.description}</h1>
                </div>
                <div>
                    <h2> ${data.city}, ${data.country}</h2>
                    <h4>${dateandtime()} </p> 
                    Wind Speed: ${data.windspeed}m/s</p>
                    Atmosperic Pressure: ${data.pressure}hPa </p> Humidity: ${
    data.humidity
  }%</p> </h4>
                </div>
            `;
}

//function to fetch weather data from the OpenWeatherMap API
function fetchWeather(city) {
  const apiUrl = `./oneDay.php?city=${city}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      localStorage.setItem(`oneDay_${city}`, JSON.stringify(data));
      if (data["error"]) {
        alert(data.error);
        return false;
      }
      insertWeatherDetails(data);
      weatherforsevendays(city);
    })
    .catch((error) => alert("Error fetching weather:", error));
}

window.onload = function () {
  const city = "nadiad"; //Default city: Nadiad
  fetchWeather(city); //fetch weather for default city
};

const weatherforsevendays = async (city) => {
  const response = await fetch(`./sevenDays.php?city=${city}`);
  const data = await response.json();
  //   console.log(data);
  localStorage.setItem(`sevenDays_${city}`, JSON.stringify(data));

  sevenDays(data);
};

const sevenDays = (data) => {
  try {
    let tb = document.querySelector("#tb");
    tb.innerHTML = ""; // Clear existing table rows

    for (let m = 0; m <= 6; m++) {
      let tr = document.createElement("tr");
      tr.innerHTML = `
                        <td>${data[m].date}</td>
                        <td>${data[m].country}</td>
                        <td>${data[m].city}</td>
                        <td>${data[m].temp}°C</td>
                        <td>${data[m].pressure}hPa</td>
                        <td>${data[m].humidity}%</td>
                        <td>${data[m].windspeed}m/s</td>
                        <td>${data[m].description}<img src="https://openweathermap.org/img/wn/${data[m].icon}.png" alt="Weather Icon"></td>
                    `;
      tb.appendChild(tr);
    }
  } catch (error) {
    console.log("Error fetching 7 days weather:", error);
  }
};

const search = document.getElementById("form");
search.addEventListener("click", () => {
  const searchedValue = document.getElementById("searchbar").value;
  const oneDayLocalStorage = JSON.parse(
    localStorage.getItem(`oneDay_${searchedValue}`)
  );
  const sevenDaysLocalStorage = JSON.parse(
    localStorage.getItem(`sevenDays_${searchedValue}`)
  );
  console.log(oneDayLocalStorage)
  console.log(sevenDaysLocalStorage)
  try {
    if (oneDayLocalStorage && sevenDaysLocalStorage) {
      let currentTime = new Date().getTime() / 1000; //in sec
      if (currentTime - parseInt(oneDayLocalStorage["timestamp"]) > 10800) {
        const searchedValue = document.getElementById("searchbar").value;
        if (!searchedValue) {
          alert("Enter a city to search");
          return false;
        }
        fetchWeather(searchedValue);
        weatherforsevendays(searchedValue);
      } else {
        insertWeatherDetails(oneDayLocalStorage);
        sevenDays(sevenDaysLocalStorage)
      }
    } else {
      const searchedValue = document.getElementById("searchbar").value;
      fetchWeather(searchedValue);
      weatherforsevendays(searchedValue);
    }
  } catch (error) {
    return;
  }
});

document.getElementById("searchbar").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchedValue = document.getElementById("searchbar").value;
    const oneDayLocalStorage = JSON.parse(
      localStorage.getItem(`oneDay_${searchedValue}`)
    );
    const sevenDaysLocalStorage = JSON.parse(
      localStorage.getItem(`sevenDays_${searchedValue}`)
    );
    console.log(oneDayLocalStorage)
    console.log(sevenDaysLocalStorage)
    try {
      if (oneDayLocalStorage && sevenDaysLocalStorage) {
        let currentTime = new Date().getTime() / 1000; //in sec
        if (currentTime - parseInt(oneDayLocalStorage["timestamp"]) > 10800) {
          const searchedValue = document.getElementById("searchbar").value;
          if (!searchedValue) {
            alert("Enter a city to search");
            return false;
          }
          fetchWeather(searchedValue);
          weatherforsevendays(searchedValue);
        } else {
          insertWeatherDetails(oneDayLocalStorage);
          sevenDays(sevenDaysLocalStorage)
        }
      } else {
        const searchedValue = document.getElementById("searchbar").value;
        fetchWeather(searchedValue);
        weatherforsevendays(searchedValue);
      }
    } catch (error) {
      return;
    }
  }
});
