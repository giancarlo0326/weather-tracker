const apiKey = "9863bc6e6f7ffc2330517e7d06138d0e";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const locationBtn = document.querySelector("#location-btn");
const cityList = document.querySelector("#city-list");
const weatherIcon = document.querySelector(".weather-icon");
const weatherInfo = document.querySelector(".weather-info");
const errorMsg = document.querySelector(".error");

// 1. Fetch Weather (Works for City Name OR Latitude/Longitude)
async function checkWeather(query) {
    let finalUrl = query.includes("lat=") ? 
        `${apiUrl}&${query}&appid=${apiKey}` : 
        `${apiUrl}&q=${query}&appid=${apiKey}`;

    try {
        const response = await fetch(finalUrl);

        if (response.status == 404) {
            errorMsg.style.display = "block";
            weatherInfo.style.display = "none";
        } else {
            const data = await response.json();
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherInfo.style.display = "block";
            errorMsg.style.display = "none";
        }
    } catch (err) { console.error("Error:", err); }
}

// 2. Simple Search Guide (Injects into Datalist)
searchBox.addEventListener("input", async () => {
    const query = searchBox.value.trim();
    if (query.length < 2) return;

    try {
        const res = await fetch(`https://api.teleport.org/api/cities/?search=${query}`);
        const data = await res.json();
        const cities = data._embedded["city:search-results"];

        cityList.innerHTML = ""; // Clear old options
        cities.slice(0, 5).forEach(item => {
            const option = document.createElement("option");
            // Extract city name before the first comma
            option.value = item.matching_full_name.split(',')[0];
            cityList.appendChild(option);
        });
    } catch (err) { console.log("Suggestion Error:", err); }
});

// 3. Location Button Logic
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            checkWeather(`lat=${lat}&lon=${lon}`);
        }, () => {
            alert("Location access denied by user.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", (e) => { 
    if (e.key === "Enter") checkWeather(searchBox.value); 
});