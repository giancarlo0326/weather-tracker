const apiKey = "9863bc6e6f7ffc2330517e7d06138d0e";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const locationBtn = document.querySelector("#location-btn");
const cityList = document.querySelector("#city-list");
const weatherIcon = document.querySelector(".weather-icon");
const weatherInfo = document.querySelector(".weather-info");
const errorMsg = document.querySelector(".error");

// 1. Core Weather Function
async function checkWeather(query) {
    if (!query) return;

    let finalUrl = query.includes("lat=") ? 
        `${apiUrl}&${query}&appid=${apiKey}` : 
        `${apiUrl}&q=${encodeURIComponent(query)}&appid=${apiKey}`;

    try {
        const response = await fetch(finalUrl);

        if (!response.ok) {
            errorMsg.style.display = "block";
            weatherInfo.style.display = "none";
            document.body.className = "default-bg";
            return;
        }

        const data = await response.json();
        
        // Update Text Data
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        // Update Weather Icon
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Update Mood Gradient
        const condition = data.weather[0].main.toLowerCase();
        document.body.className = condition; // Replaces all classes with the new condition

        weatherInfo.style.display = "block";
        errorMsg.style.display = "none";
        
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

// 2. Simple Search Guide (Datalist)
searchBox.addEventListener("input", async () => {
    const query = searchBox.value.trim();
    if (query.length < 2) return;
    try {
        const res = await fetch(`https://api.teleport.org/api/cities/?search=${query}`);
        const data = await res.json();
        const cities = data._embedded["city:search-results"];
        cityList.innerHTML = "";
        cities.slice(0, 5).forEach(item => {
            const option = document.createElement("option");
            option.value = item.matching_full_name.split(',')[0];
            cityList.appendChild(option);
        });
    } catch (err) { console.log("Suggestion Error:", err); }
});

// 3. Location Button
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                checkWeather(`lat=${lat}&lon=${lon}`);
            },
            (err) => {
                alert("Location access denied. Please check your browser settings.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Search Triggers
searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", (e) => { 
    if (e.key === "Enter") checkWeather(searchBox.value); 
});