import { spiralPoints } from "./spiralPoints.js";
import { cone } from "./cone.js";
import { particleEffects } from "./particle.js";
import { start, yAxis, zAxis, Viewport, calcPosition } from "./spiralThings.js";

const BLACK = "#000";
const WHITE = "#FFF";
const PINK = "rgb(229, 189, 213)";
const RED = "indianred";

const numberOfPoints = 100000;

let stepSize = 20;
let counter = numberOfPoints;

const button = document.getElementById("button");
const glass = document.getElementById("glass");

const container = document.getElementById("container");
const box2 = document.getElementById("box2");
const boxes = document.getElementsByClassName("box");

container.classList.remove("animate");

button.addEventListener("click", () => {
  viewport.clear();
  container.classList.remove("animate");
  box2.classList.remove("start");
  Array.from(boxes).forEach((b) => b.classList.remove("appear"));
  stepSize = 20;
  counter = numberOfPoints;
  button.style.display = "none";

  let main = document.getElementById("main");

  setTimeout(() => {
    main.style.display = "block";
    setTimeout(() => window.requestAnimationFrame(() => loop()), 500);
  }, 100);
});

let stop = false;

// window.addEventListener("click", (e) => {
//   console.log(e);
//   stop = !stop;
//   if (!stop) window.requestAnimationFrame(() => loop());
// });

const viewport = new Viewport();
const renderer = viewport.context;

const { faces } = cone(180, -90, -10);
const { faces: faces2 } = cone(0, 90, 10);

const offsetY = 270;
const offsetX = 400;
const offsetY2 = 540;
let arr = [];
let startLine = false;

const spiral = (renderer, counter, colour) => {
  let x = counter / (numberOfPoints / 100);
  const position = calcPosition(x * Math.cos(x), x, Math.sin(x));

  const otherDFactor =
    normalise(numberOfPoints - counter, numberOfPoints, 0) * 1.1 + 1.05;

  let factor = (counter * otherDFactor) / numberOfPoints;

  if (counter < 0) {
    startLine = true;
  }

  if (startLine) {
    arr.push({
      x: start.x + position.x * factor,
      y: start.y + position.y,
    });
  }

  renderer.strokeStyle = RED;
  renderer.fillStyle = RED;
  renderer.lineWidth = 3;
  drawSpiral(renderer, spiralPoints);

  if (arr.length > 0) {
    drawSpiral(renderer, arr);
  }

  renderer.strokeStyle = colour;
  renderer.fillStyle = colour;
  renderer.beginPath();
  renderer.arc(
    start.x + position.x * factor,
    start.y + position.y,
    normalise(Math.sin(x), -1, 1) * 3 + 3,
    0,
    5 * Math.PI
  );
  renderer.fill();

  //Cone Things
  renderer.strokeStyle = "#00000022";
  renderer.lineWidth = 0.5;
  renderer.lineCap = "round";
  renderer.lineJoin = "round";
  drawCone(renderer, faces, offsetX, offsetY);
  drawCone(renderer, faces2, offsetX, offsetY2);
  coneOutline(renderer);
};

const loop = () => {
  yAxis.setTilt(-90);
  zAxis.setTilt(0);
  if (counter >= 0) {
    viewport.clear();

    spiral(renderer, counter, BLACK);

    if (counter < 1000) {
      container.classList.add("animate");
    }

    Object.keys(decrements)
      .reverse()
      .forEach((key) => {
        if (counter < key) {
          stepSize = decrements[key];
        }
      });

    counter -= stepSize;
  } else {
    setTimeout(() => {
      Array.from(boxes).forEach((b) => b.classList.add("appear"));
      box2.classList.add("start");
    }, 2000);
    window.requestAnimationFrame(() => loop2());
    return;
  }
  if (!stop) window.requestAnimationFrame(() => loop());
};

const loop2 = () => {
  if (counter < numberOfPoints - 1500) {
    yAxis.setTilt(90);
    zAxis.setTilt(180);
    viewport.clear();
    spiral(renderer, counter, WHITE);

    Object.keys(decrements).forEach((key) => {
      if (counter > key) {
        stepSize = decrements[key];
      }
    });

    counter += stepSize;
  } else {
    viewport.clear();
    renderer.strokeStyle = "#00000022";
    renderer.lineWidth = 0.5;
    renderer.lineCap = "round";
    renderer.lineJoin = "round";
    drawCone(renderer, faces, offsetX, offsetY);
    drawCone(renderer, faces2, offsetX, offsetY2);
    coneOutline(renderer);
    particleEffects();
    setTimeout(() => (button.style.display = "block"), 7000);
    box2.classList.add("wilt");
    glass.classList.add("reveal");
    container.classList.add("hide");
    return;
  }
  window.requestAnimationFrame(() => loop2());
};
// particleEffects();
const decrements = {
  100000: 20,
  96000: 23,
  94000: 25,
  92000: 27,
  88000: 30,
  80000: 35,
  76000: 37,
  72000: 40,
  68000: 45,
  64000: 50,
  60000: 60,
  56000: 70,
  52000: 80,
  48000: 90,
  44000: 100,
  40000: 110,
  36000: 120,
  32000: 130,
  28000: 140,
  24000: 150,
  20000: 160,
  16000: 170,
  12000: 180,
  8000: 190,
  4000: 200,
  0: 210,
};

function normalise(val, max, min) {
  return (val - min) / (max - min);
}

function drawCone(renderer, faces, offsetX, offsetY) {
  for (var i = 0; i < faces.length; i++) {
    var v0 = faces[i][0];
    var v1 = faces[i][1];
    var v2 = faces[i][2];

    renderer.beginPath();
    renderer.moveTo(v0[0] + offsetX, v0[1] + offsetY);
    renderer.lineTo(v1[0] + offsetX, v1[1] + offsetY);
    renderer.lineTo(v2[0] + offsetX, v2[1] + offsetY);
    renderer.lineTo(v0[0] + offsetX, v0[1] + offsetY);
    renderer.stroke();
  }
}

function coneOutline(renderer) {
  // *** Draw graphics. ***
  renderer.strokeStyle = BLACK;
  renderer.lineWidth = 1;
  renderer.lineCap = "round";
  renderer.lineJoin = "round";

  renderer.beginPath();
  renderer.moveTo(200, 135);
  renderer.lineTo(395, 405);
  renderer.lineTo(200, 675);
  renderer.moveTo(600, 675);
  renderer.lineTo(405, 405);
  renderer.lineTo(600, 135);

  renderer.stroke();
  renderer.closePath();
}

function drawSpiral(renderer, points) {
  renderer.beginPath();
  renderer.moveTo(points[0].x, points[0].y);
  points.forEach((a) => {
    renderer.lineTo(a.x, a.y);
  });
  renderer.stroke();
}
