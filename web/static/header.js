
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


// stolen from stack overflow thank you random guy on stack overflow
function getScrollTop() {
    if (typeof window.pageYOffset !== "undefined") {
        // Most browsers
        return window.pageYOffset;
    }

    var d = document.documentElement;
    if (typeof d.clientHeight !== "undefined") {
        // IE in standards mode
        return d.scrollTop;
    }

    // IE in quirks mode
    return document.body.scrollTop;
}
// also thank you stack overflow
function viewportToPixels(value) {
    var parts = value.match(/([0-9\.]+)(vh|vw)/)
    var q = Number(parts[1])
    var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
    return side * (q / 100)
}
// also thank you stack overflow
var tolerance = 40;
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (0.5 * (elemBottom + elemTop) <= docViewBottom);
};


let popup = false;

let scrolln = 0;
let elem = document.querySelectorAll(".wrapper");

$("#header").css("transform", `translateY(0px)`);
$("#lcd").css("margin-top", `calc(0px)`);
$("#flop").css("transform", `translateY(0px)`);

window.onscroll = function () {
    let scroll = getScrollTop();

    // header stuff, disable if scrolled too far down
    if (scroll < viewportToPixels("80vw")) {
        $("#header").css("transform", `translateY(${scroll * 0.6}px)`);
        $("#lcd").css("margin-top", `calc(-${scroll * 0.1}px)`);
        $("#flop").css("transform", `translateY(-${scroll * 0.4}px)`);
        // randomly scroll each of the post it notes
    }

    // popup window, dont bother if theres no popup window
    if (popup) $("#popup").css("transform", `translateY(-${scroll}px)`);

    // if were still not scrolled past the final element
    if (scrolln < elem.length) {
        if (isScrolledIntoView(elem[scrolln])) {
            elem[scrolln].classList.add("active");
            scrolln++;
        }
    }
};


// document.querySelectorAll("#btn").forEach();