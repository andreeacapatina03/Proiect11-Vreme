/**
 * Proiect Tehnologii Web - Weather App
 * Membrii echipei: [Numele voastre aici]
 */

const API_KEY = '870bad977cfd3c3fa6a9a954388cecb'; // Cheia ta salvata

// Selectam elementele UI
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const unitSelect = document.getElementById('unit-select');
const geoBtn = document.getElementById('geo-btn');
const historyList = document.getElementById('history-list');

// --- PROVOCARE: Conversie grade vânt în cuvinte ---
function degToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["Nord", "Nord-Nord-Est", "Nord-Est", "Est-Nord-Est", "Est", "Est-Sud-Est", "Sud-Est", "Sud-Sud-Est", "Sud", "Sud-Sud-Vest", "Sud-Vest", "Vest-Sud-Vest", "Vest", "Vest-Nord-Vest", "Nord-Vest", "Nord-Nord-Vest"];
    return arr[(val % 16)];
}

// --- CERINTA 6: LocalStorage Istoric ---
function saveCityToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherCities')) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 5) history.pop(); // Maxim 5 cautari
        localStorage.setItem('weatherCities', JSON.stringify(history));
    }
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weatherCities')) || [];
    historyList.innerHTML = '';
    history.forEach(city => {
        const span = document.createElement('span');
        span.className = 'history-item';
        span.innerText = city;
        span.onclick = () => fetchWeather(city); // Cautare rapida la click
        historyList.appendChild(span);
    });
}

// --- CERINTA 8 & 11: Preluare date si Afisare ---
async function fetchWeather(city) {
    const units = unitSelect.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=ro`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Orașul nu a fost găsit!");
        const data = await response.json();
        
        displayData(data);
        saveCityToHistory(data.name);
    } catch (err) {
        alert(err.message);
    }
}

function displayData(data) {
    const resultDiv = document.getElementById('weather-result');
    resultDiv.classList.remove('hidden');

    const temp = Math.round(data.main.temp);
    const unit = unitSelect.value === 'metric' ? '°C' : (unitSelect.value === 'imperial' ? '°F' : 'K');
    
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temp-display').innerText = `${temp}${unit}`;
    document.getElementById('desc-display').innerText = data.weather[0].description;
    document.getElementById('hum-display').innerText = `Umiditate: ${data.main.humidity}%`;
    
    // Provocare: Vânt
    const windDir = degToCompass(data.wind.deg);
    document.getElementById('wind-display').innerText = `Vânt: ${data.wind.speed} m/s (${windDir})`;

    // Logica Fundal Dinamic & Recomandare
    const condition = data.weather[0].main;
    const rec = document.getElementById('recommendation');
    document.body.className = ''; // Reset teme

    if (condition === 'Clear') {
        document.body.classList.add('theme-clear');
        rec.innerText = temp > 20 ? "Zi superbă! Nu ai nevoie de haină." : "Senin, dar ia o geacă.";
    } else if (condition === 'Rain' || condition === 'Drizzle') {
        document.body.classList.add('theme-rain');
        rec.innerText = "Plouă! Ia-ți umbrela!";
    } else {
        document.body.classList.add('theme-clouds');
        rec.innerText = "Este înnorat, verifică cerul.";
    }
}

// --- CERINTA 7: Geolocație ---
geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}&units=${unitSelect.value}&lang=ro`;
            fetch(url).then(r => r.json()).then(data => displayData(data));
        });
    }
});

searchBtn.addEventListener('click', () => {
    if (cityInput.value) fetchWeather(cityInput.value);
});

// Incărcăm istoricul la pornirea paginii
window.onload = renderHistory;