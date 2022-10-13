const TO_RADIAN = Math.PI / 180;
const SPIN_TIME = 30;
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

let SIZE = document.querySelector(".wrapper").offsetWidth;
let input = document.getElementById("input-sectors");
let SECTOR_COUNT = input.value;
let spinBtn = document.getElementById("daspin");
let winnerText = document.getElementById('winner');

input.addEventListener("change", (event) => {
    SECTOR_COUNT = +event.target.value;
    drawWheel(SIZE, SECTOR_COUNT);
});
window.addEventListener('resize', (event) => {
    let SIZE = document.querySelector(".wrapper").offsetWidth;
    drawWheel(SIZE, SECTOR_COUNT);
});
spinBtn.addEventListener("click", (event) => {
    spinWheel();
});

document.documentElement.style.setProperty('--spin-time', `${SPIN_TIME}s`);
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
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');;
        text.textContent = COLORS[0];
        text.setAttribute('x', `${radius}`);
        text.setAttribute('y', `${radius * 0.3}`);
        text.classList.add('sector-text');
        text.style.transformOrigin = `${radius}px ${radius}px`;
        text.style.transform = `rotateZ(${-90 + 360 / count * 0.5}deg)`;
        text.style.transform += ` rotate(${360 / count}deg)`;
        document.documentElement.style.setProperty('--sector-text-size', `${Math.max(3 * 2 / count, 1)}em`);
        text.style.transform += ` translate(${radius * 0.3}px, ${radius * 0.71}px)`;
        circle.setAttribute('cx', `${radius}`);
        circle.setAttribute('cy', `${radius}`);
        circle.setAttribute('r', `${radius}`);
        circle.setAttribute('fill', `red`);
        container.appendChild(circle);
        container.appendChild(text);
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
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');;
        text.textContent = COLORS[i];
        text.setAttribute('x', `${radius}`);
        text.setAttribute('y', `${radius * 0.3}`);
        text.classList.add('sector-text');
        text.style.transformOrigin = `${radius}px ${radius}px`;
        text.style.transform = `rotateZ(${-90 + 360 / count * 0.5}deg)`;
        text.style.transform += ` rotate(${360 / count * i}deg)`;
        document.documentElement.style.setProperty('--sector-text-size', `${Math.max(3 * 2 / count, 1)}em`);
        text.style.transform += ` translate(${radius * 0.3}px, ${radius * 0.71}px)`;
        sector.setAttribute('d', path);
        sector.setAttribute('fill', `${COLORS[i]}`);
        sector.setAttribute('id', `sector-${i + 1}`);
        sector.style.transformOrigin = `${radius}px ${radius}px`;
        sector.style.transform = `rotate(${360 / count * i}deg)`;
        container.appendChild(sector);
        container.appendChild(text);
    }
}

function spinWheel() {
    // Clean-up and preparation
    winnerText.textContent = "DECIDE THE WINNER";
    winnerText.classList.remove("linear-wipe");
    winnerText.classList.add("deciding");
    spinBtn.classList.add("btn-disappear");
    input.setAttribute('disabled', true);
    let dawheel = document.getElementById("wheel-svg");
    let angle = 360 / SECTOR_COUNT;

    // Determine the winning sector before calculating the resulting angle
    let winningSector = Math.floor(Math.random() * SECTOR_COUNT) + 1;
    // Always do a determined amount of full spins
    let alwaysSpin = 10;
    // Do an additional random amount of full spins from 0 to 10
    let additionalSpins = Math.floor(Math.random() * 11);
    // Do an additional degree of spinning to reach the start of the winning sector
    let additionalDegree = angle * (winningSector - 1);
    // Do a random degree of spinning within the winning sector
    let randomDegree = Math.random() * angle;
    // The resulting amount of degrees to spin
    let fullSpin = (alwaysSpin + additionalSpins) * 360 + additionalDegree + randomDegree;

    document.documentElement.style.setProperty('--random-degree', `${-1 * fullSpin}deg`);
    dawheel.classList.remove("idling");
    dawheel.classList.add("spin");

    // Get the sector the arrow is pointing to at the end of the spin and declare it as winner
    setTimeout(() => {
        const arrow = document.querySelector(".arrow");
        const arrowCoords = arrow.getBoundingClientRect();
        const pointingCoords = [arrowCoords.left + (arrowCoords.right - arrowCoords.left) / 2, 
                                arrowCoords.top + (arrowCoords.bottom - arrowCoords.top) / 2];
        let element = document.elementsFromPoint(...pointingCoords).find(el => el.id.startsWith('sector-'));
        console.log("Winning sector is", winningSector, "found element", element.id);
        console.log("sector angle is", angle, "span additional", winningSector - 1, "*", angle, "=", additionalDegree, "from 0");
        console.log("span", randomDegree, "in winning sector");
        console.log("span total",(360 * 10 + additionalSpins * 360 + additionalDegree), "degrees");
        winnerText.textContent = `WINNER IS ${element.getAttribute("fill").toUpperCase()}`;
        winnerText.classList.remove("deciding");
        winnerText.classList.add("linear-wipe");
    }, SPIN_TIME * 1000 + 100);

    // Prepare and clean up for next spin
    setTimeout(() => {
        spinBtn.classList.remove("btn-disappear");
        input.removeAttribute('disabled');
        dawheel.classList.remove("spin");
        dawheel.classList.add("idling");
    }, (SPIN_TIME + 5) * 1000);
}