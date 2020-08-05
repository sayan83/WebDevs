let mouseenter = false;
let card = document.getElementById('one');
let desc = document.getElementsByClassName('desc')[0];

const mouseEnter = (e) => {
    mouseenter = true;
    desc.classList.remove('descAnimateExit')
    desc.classList.add('descAnimate')
    card.style.scale = 1.2
}
const mouseLeave = (e) => {
    mouseenter = false;
    card.style.transform = '';
    desc.classList.remove('descAnimate')
    desc.classList.add('descAnimateExit')
    card.style.scale = 1.0
}
const mouseMove = (e) => {
    if(mouseenter) {
        const {clientX, clientY} = e;
        const {offsetHeight, offsetWidth} = card;
        const {offsetTop, offsetLeft} = card.parentElement;
        const xRotate = -((offsetTop + offsetHeight/2) - clientY)/offsetHeight * 50;
        const yRotate = ((offsetLeft + offsetWidth/2) - clientX)/offsetWidth * 50;
        card.style.transform = `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`
    }
}

let wrap = document.getElementById('wrap');
wrap.addEventListener('mouseenter', mouseEnter);
wrap.addEventListener('mouseleave', mouseLeave);
wrap.addEventListener('mousemove', mouseMove);