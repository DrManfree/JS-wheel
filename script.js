let SIZE = document.querySelector(".wrapper").offsetWidth;
let SECTOR_COUNT = 4;
let input = document.getElementById("input-sectors");
input.addEventListener("change", (event) => {
    SECTOR_COUNT = +event.target.value;
    drawWheel(SIZE, SECTOR_COUNT);
});
window.addEventListener('resize', (event) => {
    let SIZE = document.querySelector(".wrapper").offsetWidth;
    drawWheel(SIZE, SECTOR_COUNT);
});
let spinBtn = document.getElementById("daspin");
let winnerText = document.getElementById('winner');
spinBtn.addEventListener("click", (event) => {
    winnerText.textContent = "DECIDE THE WINNER";
    winnerText.classList.remove("linear-wipe");
    winnerText.classList.add("deciding");
    spinBtn.classList.add("btn-disappear");
    input.setAttribute('disabled', true);
    let dawheel = document.getElementById("wheel-svg");
    document.documentElement.style.setProperty('--random-degree', 
    `${360 * 10 + Math.floor(Math.random() * 10) * 360 + Math.floor(Math.random() * 361)}deg`);
    dawheel.classList.remove("idling");
    dawheel.classList.add("spin");
    setTimeout(() => {
        const arrow = document.querySelector(".arrow");
        const arrowCoords = arrow.getBoundingClientRect();
        const pointingCoords = [arrowCoords.left + (arrowCoords.right - arrowCoords.left) / 2, 
                                arrowCoords.top + (arrowCoords.bottom - arrowCoords.top) / 2];
        console.log("pointing at ", pointingCoords);
        let element = document.elementsFromPoint(...pointingCoords).find(el => el.id.startsWith('sector-'));
        console.log("found element: ", element);
        winnerText.textContent = `WINNER IS ${element.getAttribute("fill").toUpperCase()}`;
        winnerText.classList.remove("deciding");
        winnerText.classList.add("linear-wipe");
    }, 30 * 1000 + 100);
    setTimeout(() => {
        spinBtn.classList.remove("btn-disappear");
        input.removeAttribute('disabled');
        dawheel.classList.remove("spin");
        dawheel.classList.add("idling");
    }, 35 * 1000);
});
const TO_RADIAN = Math.PI / 180;
const COLORS = [
    "red",
    "blue",
    "green",
    "yellow",
    "cyan",
    "purple",
    "orange",
    "beige",
    "brown",
    "crimson",
    "pink",
    "gold",
    "indigo",
    "limegreen",
    "navy",
    "plum",
    "tan",
    "whitesmoke",
    "turquoise",
    "gray"
];

drawWheel(SIZE, SECTOR_COUNT);

function drawWheel(size, count = 1) {
    // If a wheel already exists, delete it
    let wheel = document.getElementById('wheel-svg');
    if (wheel)
        wheel.remove();
    // Create the svg element and a default gray circle
    let container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    container.setAttribute('id','wheel-svg');
    container.classList.add("idling");
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    const radius = size / 2;

    circle.setAttribute('cx', `${radius}`);
    circle.setAttribute('cy', `${radius}`);
    circle.setAttribute('r', `${radius}`);
    circle.setAttribute('fill', `#C9C9C9`);
    container.appendChild(circle);
    document.querySelector(".wrapper").appendChild(container);

    // If there is only one sector just create a red circle
    if (count === 1) {
        let sector = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        const radius = size / 2;
        circle.setAttribute('cx', `${radius}`);
        circle.setAttribute('cy', `${radius}`);
        circle.setAttribute('r', `${radius}`);
        circle.setAttribute('fill', `red`);
        container.appendChild(circle);
        return;
    }

    // Calculate the arc angle of a single sector to determine needed arc coordinates
    const sectorDegrees = 360 / count * TO_RADIAN;
    let sectorX, sectorY;

    // If the arc angle of a sector is more than 90 degrees, change the formula
    // to accomodate that
    if (360 / count > 90) {
        sectorX = radius + radius * Math.sin(sectorDegrees);
        sectorY = radius + Math.abs(radius * Math.cos(sectorDegrees));
    }
    else {
        sectorX = radius + radius * Math.sin(sectorDegrees);
        sectorY = radius - radius * Math.cos(sectorDegrees);
    }
    
    // "Draw" the sector - set a starting point, draw a line upwards and draw the arc
    let startPoint = `M${radius},${radius}`;
    let lineUp = `L${radius},0`;
    let arc = `A${radius},${radius} 1 0,1 ${sectorX},${sectorY} z`;
    let path = [startPoint, lineUp, arc].join(" ");
    
    // Create each sector, set its color, rotate it, and append it to the wheel
    for (let i = 0; i < count; i++) {
        let sector = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sector.setAttribute('d', path);
        sector.setAttribute('fill', `${COLORS[i]}`);
        sector.setAttribute('id', `sector-${i}`);
        sector.style.transformOrigin = `${radius}px ${radius}px`;
        sector.style.transform = `rotate(${360 / count * i}deg)`;
        container.appendChild(sector);
    }
}