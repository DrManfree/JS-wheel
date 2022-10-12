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
    "turquoise"
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
        sector.style.transformOrigin = `${radius}px ${radius}px`;
        sector.style.transform = `rotate(${360 / count * i}deg)`;
        container.appendChild(sector);
    }
}