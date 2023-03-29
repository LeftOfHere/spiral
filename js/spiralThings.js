export class Vector {
  constructor(x = 0.0, y = 0.0) {
    this.x = x;
    this.y = y;
  }

  // Modifies the vector
  add(vector2) {
    this.x += vector2.x;
    this.y += vector2.y;
  }
  truncate(max) {
    if (this.x * this.x + this.y * this.y > max * max) {
      const oldMagnitude = Math.sqrt(this.x * this.x + this.y * this.y);
      const newMagnitude = max / oldMagnitude;
      this.x *= newMagnitude;
      this.y *= newMagnitude;
    }
  }
  normalize() {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    if (magnitude > 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
  }
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
  rotate(radians) {
    this.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    this.y = this.x * Math.sin(radians) + this.y * Math.cos(radians);
  }

  // Returns a new vector
  scaled(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  normalized() {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    return magnitude > 0
      ? new Vector(this.x / magnitude, this.y / magnitude)
      : new Vector();
  }
  added(vector2) {
    return new Vector(this.x + vector2.x, this.y + vector2.y);
  }

  subtracted(vector2) {
    return new Vector(this.x - vector2.x, this.y - vector2.y);
  }

  perpendicularClockwise() {
    return new Vector(this.y, -this.x);
  }
  perpendicularCounterClockwise() {
    return new Vector(-this.y, this.x);
  }

  rotated(radians) {
    const x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    const y = this.x * Math.sin(radians) + this.y * Math.cos(radians);

    return new Vector(x, y);
  }
  inLocalSpace(position, heading) {
    let localPosition = new Vector(this.x - position.x, position.y - this.y);
    let angle = heading.angle();
    localPosition.rotate(-angle);
    return localPosition;
  }
  cloned() {
    return new Vector(this.x, this.y);
  }

  // Returns a scalar
  dot(vector2) {
    return this.x * vector2.x + this.y * vector2.y;
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  angle(mag = 1) {
    if (this.x === 0 && this.y === 0) return 0;
    const angle = Math.acos(this.x);
    if (this.y > 0) return Math.PI * 2 - angle;
    else return angle;
  }
}

export class Viewport {
  constructor(
    width = 800,
    height = 800,
    canvas = "canvas",
    preventInit = false
  ) {
    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.canvasName = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    if (!preventInit) this.init();
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
  setBackground(color) {
    this.canvas.style.background = color;
  }
  init() {
    // this.canvas.style.background = "#FFAA00";
    // this.canvas.style.border = "1px solid #000000";
  }
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  getMouse(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  getTouch(event) {
    // NB! If you have a border, it is added to the position;
    event.preventDefault();
    return {
      x: event.changedTouches[0].pageX,
      y: event.changedTouches[0].pageY,
    };
  }
}

const degreesToRadians = (degrees) => {
  return (degrees / 180) * Math.PI;
};

export class Axis {
  constructor(length = 1, realSize = 1, offset = 0) {
    this.tilt = 0;
    this.origin = new Vector(start.x, start.y);
    this.length = length;
    this.magnitude;
    this.realSize = realSize;
  }
  setOrigin(x, y) {
    this.origin = new Vector(x, y);
  }
  setAll(x, y, length) {
    this.length = length;
  }
  setTilt(degrees) {
    let radians = degreesToRadians(degrees);
    this.magnitude = new Vector(Math.cos(radians), Math.sin(radians));
  }
  render(renderer) {
    renderer.beginPath();
    renderer.moveTo(this.origin.x, this.origin.y);
    const targetX = this.origin.x + this.length * this.magnitude.x;
    const targetY = this.origin.y + this.length * this.magnitude.y;
    renderer.lineTo(targetX, targetY);
    renderer.stroke();
  }
  getPosition(x) {
    return new Vector(
      (x * this.magnitude.x * this.length) / this.realSize,
      (x * this.magnitude.y * this.length) / this.realSize
    );
  }
}

export const calcPosition = (x, y, z) => {
  const vec = xAxis
    .getPosition(x)
    .added(yAxis.getPosition(y).added(zAxis.getPosition(z)));
  return vec;
};

export const start = new Vector(400, 400);
export const xAxis = new Axis(150, 100, 0);
xAxis.setTilt(0);

export const yAxis = new Axis(250, 100, 0);
yAxis.setTilt(-90);

export const zAxis = new Axis(125, 2, 0);
zAxis.setTilt(-90);
