//Task-1 -> Tab switching

//Fetching-info
const userTab= document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");  


//Need of the inital Variables

let currentTab = userTab;
const API_KEY = "2702189647e25feafb542d9b690041b4";
currentTab.classList.add("current-tab");


getfromSessionStorage();

//Click Operations for the tab switching

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){ //if active is  not present searchForm -> we need to got to search form
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            //we were at the search tab now we need to go to the userTab -> active class to the user tab now
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            

            //Now in your weather tab search if coordinates are present in the local storage display weather
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click",() => {
    //Pass clicked Tab as input
    switchTab(userTab);
})

searchTab.addEventListener("click",() => {
    //Pass clicked Tab as input
    switchTab(searchTab);
})

//Checks if the coordinfates are present in the   Session Storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //Show the grant location access window
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //Make Grant Access Container Invisible
    grantAccessContainer.classList.remove("active");
    //Make the loading screen Visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        //Removing the Loading screen
        loadingScreen.classList.remove("active");
        //Show the informattion fetched from thwe api on the container use info container by making it visible
        userInfoContainer.classList.add("active");

        //Now render the information from the api to the ui
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //Hw
    }
}

//Renders the information from the API to the UI of the page
function renderWeatherInfo(weatherInfo){

    //Fetching the data first
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //Fetch values from the weatherInfo object and put in the UI Elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //Show an alert!
    }
}

function showPosition(position){

    const userCoordinates = {    //User Coordinate object
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") return;
    else
    fetchSearchWeatherInfo(cityName);
})


//API CALL FUCNITON
async function fetchSearchWeatherInfo(city){
     loadingScreen.classList.add("active");
     userInfoContainer.classList.remove("active");
     grantAccessContainer.classList.remove("active");

     try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}