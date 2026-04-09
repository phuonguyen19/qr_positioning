const reader = new Html5Qrcode("camera");
let scannerOn = false;

const mapContainer = document.getElementById("mapContainer");
const marker = document.getElementById("marker");
const btn = document.getElementById("btn");

function toggleScanner() {
    scannerOn = !scannerOn;

    if (scannerOn) {
        startScanner();
        mapContainer.style.display = "none";
        btn.innerText = "CANCEL";
    } else {
        stopScanner();
        mapContainer.style.display = "block";
        btn.innerText = "SCAN";
    }
}

function startScanner() {
    reader.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        function (text) {
            console.log("QR:", text);

            try {
                const place = JSON.parse(text);

                const pos = convertToMapPosition(place.latitude, place.longitude);

                showMarkerAt(pos.top, pos.left);

                document.getElementById("inventory").innerHTML = `
                    <strong>${place.name}</strong><br>
                    Latitude: ${place.latitude}<br>
                    Longitude: ${place.longitude}
                `;

                toggleScanner();

            } catch (err) {
                alert("Invalid QR JSON");
                console.error(err);
            }
        }
    ).catch(function (err) {
        console.error(err);
    });
}

function stopScanner() {
    reader.stop().catch(err => console.log(err));
}


function showMarkerAt(top, left) {
    marker.style.top = top;
    marker.style.left = left;
}

function convertToMapPosition(lat, lng) {
   
    const minLat = 62.59;
    const maxLat = 62.61;
    const minLng = 29.75;
    const maxLng = 29.80;

    const mapWidth = 800;
    const mapHeight = 600;

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;

    return {
        top: y + "px",
        left: x + "px"
    };
}