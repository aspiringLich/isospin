// post it notes


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

