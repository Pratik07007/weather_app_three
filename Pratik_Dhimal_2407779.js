const updateWeatherData = (good) => {
    document.querySelector(".right span").textContent = `${good.city},${good.country}`;
    document.querySelector(".right-main h2").textContent = good.description;
    document.querySelector(".right-main h1").textContent = `${good.temp}°C`;
    document.querySelector(".thl #two").textContent = `High:${good.temp_high}°C`;
    document.querySelector(".thl #three").textContent = `Low:${good.temp_low}°C`;
    document.querySelector(".right-main img").src = `https://openweathermap.org/img/wn/${good.icon}@2x.png`;
    document.querySelector("#v").textContent = `${good.pressure} hPa`;
    document.querySelector("#vv").textContent = `${good.humidity} %`;
    document.querySelector("#vvvv").textContent = `${good.feelslike} °C`;
    document.querySelector("#vvv").textContent = `${good.windspeed} m/s`;
    document.querySelector(".video-text h2").textContent = good.city;
    document.querySelector("#one").textContent = `${good.date}`;
    document.querySelector("#sevenTxt").textContent = `Past weather data of ${good.city}`;
};

const updateSevenDaysData = (sevendaysData) => {
    const tbody = document.querySelector("#tableBody");
    tbody.innerHTML = "";
    for (let i = 0; i < 7; i++) {
        const currentData = sevendaysData[i].date;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${currentData}</td>
            <td>${sevendaysData[i].temp}°C </td>
            <td>${sevendaysData[i].pressure} hPa</td>
            <td>${sevendaysData[i].humidity} %</td>
            <td>${sevendaysData[i].windspeed} m/s</td>
            <td><img style="height:4.5vw"src="https://openweathermap.org/img/wn/${sevendaysData[i].icon}@2x.png"> ${sevendaysData[i].description}</td>
        `;
        tbody.appendChild(tr);

    }
};

const fetchDataFromLocalStorage = (city) => {
    console.log("FROM LOCAL STORAGE")
    const recentData = JSON.parse(localStorage.getItem(`recent_${city}`));
    const pastData = JSON.parse(localStorage.getItem(`past_${city}`));
    updateWeatherData(recentData);
    updateSevenDaysData(pastData);
};


const fetchData = async (city) => {
    try {
        const url = `./Pratik_Dhimal_2407779_03.php?city=${city}`;
        const raw = await fetch(url);
        const good = await raw.json();
        localStorage.setItem(`recent_${city}`, JSON.stringify(good));
        if (good.error !== "City not found" && good.error !== "No city provided please enter a city") {
            updateWeatherData(good);
        } else {
            alert(good.error);
        }
    } catch (error) {
        return;
    }
};


const fetchSevenDaysData = async (city) => {
    try {
        const url = `./Pratik_Dhimal_2407779_02.php?city=${city}`;
        const response = await fetch(url);
        const sevendaysData = await response.json();
        localStorage.setItem(`past_${city}`, JSON.stringify(sevendaysData));
        updateSevenDaysData(sevendaysData);
    } catch (error) {
        return;
    }
};
var dataRefreshTime = 14400; 
const searchClickOrEnter = () => {
    document.querySelector('button').addEventListener('click', () => {
        const inputText = document.querySelector("input").value;
        const recentOfflineData = JSON.parse(localStorage.getItem(`recent_${inputText}`));
        const pastOfflineData = JSON.parse(localStorage.getItem(`past_${inputText}`));
        try {
            if (recentOfflineData && pastOfflineData) {
                let currentTime=new Date().getTime()/1000 //in sec
                if (currentTime- parseInt(recentOfflineData["time_fetched"])>dataRefreshTime) {
                    console.log("From Database")
                    fetchSevenDaysData(inputText);
                    fetchData(inputText);
                } else {
                    fetchDataFromLocalStorage(inputText)
                }


            }
            else {
                console.log("From Database")
                const inputText = document.querySelector("input").value;
                fetchData(inputText);
                fetchSevenDaysData(inputText);
            }

        } catch (error) {
            return;
        }

    });

    document.querySelector("input").addEventListener('keydown', (val) => {
        if (val.key === 'Enter') {
            const inputText = document.querySelector("input").value;
            const recentOfflineData = JSON.parse(localStorage.getItem(`recent_${inputText}`));
            const pastOfflineData = JSON.parse(localStorage.getItem(`past_${inputText}`));
            try {
                if (recentOfflineData && pastOfflineData) {
                    let currentTime=(new Date().getTime())/1000 //in sec
                    if (currentTime - parseInt(recentOfflineData["timestamp"]) >dataRefreshTime) {
                        fetchSevenDaysData(inputText);
                        fetchData(inputText);
                        console.log("Fetched From database")
                    } else {
                        fetchDataFromLocalStorage(inputText)
                    }
                }
                else {
                    console.log("From Database")
                    const inputText = document.querySelector("input").value;
                    fetchData(inputText);
                    fetchSevenDaysData(inputText);
                }

            } catch (error) {
                return;
            }
        }
    });
};
searchClickOrEnter();

window.onload = () => {
    const inputText = "gandhinagar"
    const pastOfflineData = JSON.parse(localStorage.getItem(`past_${inputText}`));
    const recentOfflineData = JSON.parse(localStorage.getItem(`recent_${inputText}`));
    try {
        if (recentOfflineData && pastOfflineData) {
            let currentTime=new Date().getTime()/1000 //in sec
            if (currentTime - parseInt(recentOfflineData["timestamp"]) >dataRefreshTime) {
                console.log("Fetched From database")
                fetchData(inputText);
                fetchSevenDaysData(inputText);
            } else {
                fetchDataFromLocalStorage(inputText)
            }


        }
        else {
            console.log("From Database")
            fetchData(inputText);
            fetchSevenDaysData(inputText);
        }

    } catch (error) {
        return;
    }
};

const gsapAnimation = () => {
    gsap.from(".navbar a", {
        y: 80,
        opacity: 0,
        delay: 0.3,
        duration: 0.7,
    });

    document.querySelector("#clickme").addEventListener('click', () => {
        gsap.to(".mainbox", {
            x: -1300,
            duration: 1,
        });
        gsap.to(".seven", {
            yPercent: -110,
            delay: 0.2,
            duration: 1
        });
    });

    document.querySelector("#clickmeback").addEventListener('click', () => {
        gsap.to(".mainbox", {
            x: 0,
            delay: 0.5,
            duration: 1,
        });
        gsap.to(".seven", {
            yPercent: 0,
            delay: 0.2,
            duration: 1
        });
    });
};

gsapAnimation();
