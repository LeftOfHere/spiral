var particles = document.getElementsByClassName("particle");

export function particleEffects() {
  //410, 156
  Array.from(particles).forEach((p) => {
    const someNumber = Math.random() * 900 + 20;
    const someNumber2 = Math.random() * 700 + 6;
    const duration = Math.random() * 6 + 2;
    // const delay = Math.random() * 2 - 1;
    p.style.animation = `shoot 3s ease-out`;
    p.style.animationName = `shoot, fade`;
    p.style.transform = `translate(${someNumber}px, ${someNumber2}px)`;
    p.style.animationDuration = `${duration}s`;
    // p.style.animationDelay = `${delay}s`;
  });
}
