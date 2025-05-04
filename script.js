const apiKey = '8a3aafa5bcc20123b98baae6d42fc473'; // Replace with your OpenWeatherMap API key

// Store search history in localStorage
function storeHistory(city) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    if (!history.includes(city)) {
        history.push(city);
        if (history.length > 5) history.shift(); // Keep only last 5 searches
        localStorage.setItem('history', JSON.stringify(history));
    }
}

// Display history in the history.html page
function displayHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        historyList.appendChild(li);
    });
}

// Redirect to weatherResults.html page
function redirectToWeatherResultsPage() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Redirect to weatherResults.html with city as a query parameter
    window.location.href = `weatherResults.html?city=${encodeURIComponent(city)}`;
}

// Get weather data from OpenWeatherMap API
async function fetchWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Fetch current weather
    try {
        const response = await fetch(currentWeatherUrl);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }

    // Fetch forecast data
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();
        displayHourlyForecast(data.list);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        alert('Error fetching forecast data. Please try again.');
    }
}

// Display current weather and icons
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Check if the API data is valid
    if (data.cod === 200) {
        const temp = data.main.temp;
        const weather = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        // Update the weather data on the page
        tempDivInfo.textContent = `Temperature: ${temp}°C`;
        weatherInfoDiv.textContent = `Weather: ${weather}`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;  // Use weather icon URL from OpenWeatherMap

        // Log weather data
        const weatherLogs = document.getElementById('weather-logs');
        weatherLogs.innerHTML += `<p>City: ${data.name} | Temp: ${temp}°C | Weather: ${weather}</p>`;

        // Store search in history
        storeHistory(data.name);
    } else {
        alert('City not found!');
    }
}

// Display hourly forecast
function displayHourlyForecast(forecast) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous forecast

    forecast.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString(); // Convert timestamp to readable time
        const temp = item.main.temp;
        const weather = item.weather[0].description;
        const iconCode = item.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>Time: ${time}</p>
            <p>Temp: ${temp}°C</p>
            <p>Weather: ${weather}</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        `;
        hourlyForecastDiv.appendChild(forecastItem);
    });
}

// Call the displayHistory function on the history page
if (window.location.pathname.includes('history.html')) {
    displayHistory();
}

// Get city from query string for weather results page
if (window.location.pathname.includes('weatherResults.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    
    // Call weather data function when the page is loaded
    if (city) {
        fetchWeather(city);
    }
}

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = JSON.parse(localStorage.getItem('user')); // Check if the user exists in localStorage

    if (user && user.email === email && user.password === password) {
        alert('Login successful!');
        localStorage.setItem('loggedIn', true); // Optional: Set a flag for logged-in status
        window.location.href = 'index.html'; // Redirect to the home page
    } else {
        alert('Invalid email or password');
    }
});

// Handle register form submission
document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Store user information in localStorage
    const user = {
        username: username,
        email: email,
        password: password
    };

    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful! You can now log in.');

    window.location.href = 'login.html'; // Redirect to login page after successful registration
});

// Display username on page load
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').textContent = user.username; // Update username display
        document.getElementById('profile-pic').src = user.profilePic || 'https://via.placeholder.com/150'; // Set profile picture
    }
};