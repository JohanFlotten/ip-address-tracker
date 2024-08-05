document.addEventListener('DOMContentLoaded', () => {
    const ipBox = document.getElementById('ip-box');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.querySelector('.search');
    const apiKey = 'at_CQ8A5gQ3GTLiiwrrtloCaiWJiqdN6';

    const titles = ["IP ADDRESS", "LOCATION", "TIMEZONE", "ISP"];
    const responses = ["ip", "location", "timezone", "isp"];


    titles.forEach((title, index) => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.id = `box-${index + 1}`;

        const titleElement = document.createElement('p');
        titleElement.textContent = title;
        titleElement.classList.add('title');

        const responseElement = document.createElement('p');
        responseElement.classList.add('response');
        responseElement.id = `response-${responses[index]}`;

        box.appendChild(titleElement);
        box.appendChild(responseElement);
        ipBox.appendChild(box);
    });

    function search() {
        const ipOrDomain = searchInput.value;
        if (ipOrDomain) {
            fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipOrDomain}`)
                .then(response => response.json())
                .then(data => {

                    document.getElementById('response-ip').textContent = data.ip;
                    document.getElementById('response-location').textContent = `${data.location.region}, ${data.location.country}`;
                    document.getElementById('response-timezone').textContent = `UTC ${data.location.timezone}`;
                    document.getElementById('response-isp').textContent = data.isp;


                    updateMap(data.location.lat, data.location.lng);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    alert('Failed to retrieve data. Please try again.');
                });
        } else {
            alert('Please enter a valid IP address or domain.');
        }
    }

    searchButton.addEventListener('click', search);

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
    });


    const map = L.map('map').setView([51.505, -0.09], 13); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker;
    function updateMap(lat, lng) {
        if (marker) {
            map.removeLayer(marker);
        }
        
      
        const offsetLatLng = [lat + 0.005, lng]; 


        map.setView(offsetLatLng, 13);


        marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    }

    const customIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [24, 30],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
});
