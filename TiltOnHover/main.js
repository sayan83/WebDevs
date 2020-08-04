let mouseenter = false;
let card = document.getElementById('one');

const mouseEnter = (e) => {
    mouseenter = true;
}
const mouseLeave = (e) => {
    mouseenter = false;
    card.style.transform = '';
}
const mouseMove = (e) => {
    if(mouseenter) {
        const {clientX, clientY} = e;
        const {offsetHeight, offsetWidth} = card;
        const {offsetTop, offsetLeft} = card.parentElement;
        const xRotate = ((offsetTop + offsetHeight/2) - clientY)/offsetHeight * 50;
        const yRotate = ((offsetLeft + offsetWidth/2) - clientX)/offsetWidth * 50;
        card.style.transform = `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`
    }
}

let wrap = document.getElementById('wrap');
wrap.addEventListener('mouseenter', mouseEnter);
wrap.addEventListener('mouseleave', mouseLeave);
wrap.addEventListener('mousemove', mouseMove);