// AICI puneți cheia voastră API de la OpenWeatherMap
const API_KEY = 'PUNE_AICI_CHEIA_TA'; 

// Selectăm elementele din HTML
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if(city) {
        getWeatherData(city);
    }
});

async function getWeatherData(city) {
    console.log("Se caută vremea pentru:", city);
    // Vom scrie funcția de fetch în pasul următor
}