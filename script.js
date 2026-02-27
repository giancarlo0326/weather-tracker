const apiKey = "9863bc6e6f7ffc2330517e7d06138d0e";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const weatherInfo = document.querySelector(".weather-info");
const errorMsg = document.querySelector(".error");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (response.status == 404) {
            errorMsg.innerHTML = "Invalid city name";
            errorMsg.style.display = "block";
            weatherInfo.style.display = "none";
        } else if (response.status == 401) {
            // This handles the "activation" period
            errorMsg.innerHTML = "API Key still activating... try again in a bit!";
            errorMsg.style.display = "block";
        } else {
            const data = await response.json();

            // Update UI
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            // Weather Condition Icons
            const condition = data.weather[0].main;
            
            if (condition === "Clouds") {
                weatherIcon.src = "https://openweathermap.org/img/wn/03d@2x.png";
            } else if (condition === "Clear") {
                weatherIcon.src = "https://openweathermap.org/img/wn/01d@2x.png";
            } else if (condition === "Rain") {
                weatherIcon.src = "https://openweathermap.org/img/wn/10d@2x.png";
            } else if (condition === "Drizzle") {
                weatherIcon.src = "https://openweathermap.org/img/wn/09d@2x.png";
            } else if (condition === "Mist" || condition === "Haze" || condition === "Fog") {
                weatherIcon.src = "https://openweathermap.org/img/wn/50d@2x.png";
            } else if (condition === "Snow") {
                weatherIcon.src = "https://openweathermap.org/img/wn/13d@2x.png";
            }

            weatherInfo.style.display = "block";
            errorMsg.style.display = "none";
        }
    } catch (err) {
        console.log("Error fetching data:", err);
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});