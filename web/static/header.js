

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
        // Pick a remaining element
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        // Swap it with the current element.
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

let numpostits = 4;
let ids = shuffleArray([...Array(numpostits * 3).keys()]);

// post it notes
for (let indx = 0; indx <= 1; indx++) {
    let div = document.querySelectorAll("#post-it")[indx];
    let x = shuffleArray([...Array(numpostits).keys()]);
    let y = shuffleArray([...Array(numpostits).keys()]);
    for (let i = 0; i < numpostits; i++) {
        let rot = Math.random() * 45 - 22.5;
        let top = Math.random() * 15 - 2.5;
        div.innerHTML += `<div id="note" style="rotate: ${rot}deg; left: ${x[i] * 5}vw; top: ${y[i] * 5}vw">
        <object type=\"image/svg+xml\" data=\"assets/post-its/${["blue", "green", "purple", "red", "yellow"][(Math.random() * 5) | 0]}.svg\"></object>
        <img src=\"assets/post-it-imgs/${ids[i + indx * numpostits] + 1}.png\" class=\"center\"></img>
        </div>`
    }
}

// type title
let title = document.querySelector("#lcd-matrix h1");
let transitions = `



&lt
&ltI
&ltIS
&ltISO
&ltISOS
&ltISOSO
&ltISOSOP
&ltISOSOPN
&ltISOSOPN
&ltISOSOPN
&ltISOSOPN
&ltISOSOP
&ltISOSO
&ltISOS
&ltISOS
&ltISOSP
&ltISOSPI
&ltISOSPIN
&ltISOSPIN&gt
&ltISOSPIN&gt
&ltISOSPIN&gt
`.split("\n");

let delay = 150;
let variance = 0.3;
function type_title(count) {
    if (count == transitions.length - 1) return;

    title.innerHTML = transitions[count];
    setTimeout(type_title, Math.random() * delay * variance + delay * (1 - variance), count + 1)
}
type_title(0);


// scrolling text
let scrolling = document.querySelectorAll("#lcd-matrix p");

let cnt = 0;
function change_text(element) {
    cnt += 1;
    element.innerHTML =
        [cnt, "Fizz", "Buzz", "FizzBuzz"][(cnt % 3 == 0 ? 1 : 0) + ((cnt % 5 == 0 ? 1 : 0) * 2)]
        ;
}

scrolling.forEach((x) => {
    x.addEventListener("animationstart", () => { change_text(x) });
    x.addEventListener("animationiteration", () => { change_text(x) });
})

