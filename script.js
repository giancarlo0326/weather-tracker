const apiKey = "9863bc6e6f7ffc2330517e7d06138d0e";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const weatherInfo = document.querySelector(".weather-info");
const errorMsg = document.querySelector(".error");
const errorText = document.querySelector("#error-text");
const suggestionsBox = document.querySelector("#suggestions-box");

// Fetch Weather Data
async function checkWeather(city) {
    suggestionsBox.style.display = "none";
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (response.status == 404) {
            errorText.innerHTML = "Invalid city name";
            errorMsg.style.display = "block";
            weatherInfo.style.display = "none";
        } else if (response.status == 401) {
            errorText.innerHTML = "API Key activating... wait 2 hours!";
            errorMsg.style.display = "block";
        } else {
            const data = await response.json();
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            const condition = data.weather[0].main;
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherInfo.style.display = "block";
            errorMsg.style.display = "none";
        }
    } catch (err) { console.log(err); }
}

// Live City Suggestions
searchBox.addEventListener("input", async () => {
    const query = searchBox.value.trim();
    if (query.length < 3) {
        suggestionsBox.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`https://api.teleport.org/api/cities/?search=${query}`);
        const data = await res.json();
        const cities = data._embedded["city:search-results"].slice(0, 5);

        if (cities.length > 0) {
            suggestionsBox.innerHTML = "";
            cities.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("suggestion-item");
                const cityName = item.matching_full_name.split(',')[0]; 
                div.innerText = item.matching_full_name;
                div.onclick = () => {
                    searchBox.value = cityName;
                    checkWeather(cityName);
                };
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = "block";
        }
    } catch (err) { console.log(err); }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (e.target !== searchBox) suggestionsBox.style.display = "none";
});

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkWeather(searchBox.value);
});