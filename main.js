/* let image = document.querySelector('.image')
let image2 = document.querySelector('.image2')

window.addEventListener('load', (e) => {
	if (image2.complete) {
		image.remove()
	} else {
		image.style.display = null
	}
})
let cursor = document.querySelector('.cursor')
let wrapper = document.querySelector('.wrapper')

window.addEventListener('mousemove', (e) => {
	let mouseY = e.clientY;
	let mouseX = e.clientX;

	cursor.style.left = `${mouseX}px`
	cursor.style.top = `${mouseY}px`
	if (e.target == wrapper) {
		document.documentElement.style.cursor = 'none';
		cursor.style.display = 'block'
		let wrapperW = wrapper.clientWidth;
		let wrapperH = wrapper.clientHeight;
		if (e.clientX >= wrapperW / 2) {
			cursor.style.transform = 'rotate(90deg)'
		}
		if (e.clientX <= wrapperW / 2) {
			cursor.style.transform = 'rotate(-90deg)'
		}
	} else {
		document.documentElement.style.cursor = null
		cursor.style.display = null;
	}
}) */

const API_KEY = `a510a13e07b7f25d23f16663e71f24fb`;
const form = document.querySelector('#weather')
const input = document.querySelector('#input')
const local = document.querySelector('#local')
// let api = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;


const city = document.querySelector('.city')
const temp = document.querySelector('.temp')
const feels = document.querySelector('.feels')
const ico = document.querySelector('.ico')
const humidity = document.querySelector('.humidity')
const wind = document.querySelector('.wind')


form.addEventListener('submit', submitHandler)

async function submitHandler(e) {

	e.preventDefault()

	if (!input.value.trim()) {

		console.log('Enter city name');

	}

	else {

		console.log(input.value.trim());

		try {
			const cityInfo = await getGeo(input.value.trim())

			const lat = cityInfo[0]['lat']
			const lon = cityInfo[0]['lon']


			const weatherInfo = await getWeather(lat, lon)

			console.log(cityInfo[0]);
			console.log(weatherInfo);


			const icoPic = weatherInfo['weather'][0]['icon']

			city.innerText = cityInfo[0].name;

			temp.innerText = Math.round(weatherInfo['main']['temp']) + " " + '°C';

			humidity.innerText = weatherInfo['main']['humidity'] + " " + '%';

			feels.innerText = Math.round(weatherInfo['main']['feels_like']) + " " + '°C';

			wind.innerText = Math.round(weatherInfo['wind']['speed']) + ' ' + 'm/s'

			ico.src = `https://openweathermap.org/img/wn/${icoPic}@4x.png`;
		}
		catch (err) {
			alert('Enter correct city')
		}
	}

}

async function getGeo(name) {

	let geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;


	const response = await fetch(geoUrl)
	console.log(geoUrl);
	const data = await response.json()

	return data


}

async function getWeather(lat, lon) {

	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`

	const response = await fetch(weatherUrl)

	const data = await response.json()

	return data
}


function getUserLocation() {

	if ("geolocation" in navigator) {

		let watchID = navigator.geolocation.watchPosition(async function (position) {
			let lat = position.coords.latitude;
			let lon = position.coords.longitude;


			let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`

			let response = await fetch(url)
			let data = await response.json()


			const icoPic = data['weather'][0]['icon']

			city.innerText = data.name;

			temp.innerText = Math.round(data['main']['temp']) + " " + '°C';

			humidity.innerText = data['main']['humidity'] + " " + '%';

			feels.innerText = Math.round(data['main']['feels_like']) + " " + '°C';



			ico.src = `https://openweathermap.org/img/wn/${icoPic}@4x.png`;

			navigator.geolocation.clearWatch(watchID)
		})

	} else { console.log("not support"); }
}
local.addEventListener('click', getUserLocation)

getUserLocation()
