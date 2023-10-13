
export function addStars(toggle: Element) {
    const star = document.createElement('i');
    star.className = 'fa fa-solid fa-star';
    star.onclick = function () {
        console.log('star clicked');
        star.className = 'fa fa-regular fa-star';
    }
    toggle.append(star);
}

function markStars(rating: number, star: Element) {
    console.log('markStars: ', rating);
    star.className = 'fa fa-regular fa-star';

}
