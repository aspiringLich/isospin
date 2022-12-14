

// * UTILITY FUNCTIONS


// stolen from stack overflow thank you random guy on stack overflow
function getScrollTop() {
    // Most browsers
    if (typeof window.pageYOffset !== "undefined") return window.pageYOffset;
    var d = document.documentElement;
    // IE in standards mode
    if (typeof d.clientHeight !== "undefined") return d.scrollTop;
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
// and thank you stack overflow
var tolerance = 40;
function isScrolledIntoView(elem) {
    var docViewTop = window.document.documentElement.scrollTop;
    var docViewBottom = docViewTop + window.innerHeight;
    var elemTop = elem.getBoundingClientRect().top;
    var elemBottom = elem.getBoundingClientRect().bottom;
    return (0.5 * (elemBottom + elemTop) <= docViewBottom);
};
// shorthand for setting style properties
function setAttr(selector, attribute) {
    document.querySelectorAll(selector).forEach((x) => x.setAttribute("style", attribute));
}
let scrolln = 0;
let url = window.location.href;
let main_subpage = url.split("//", 2)[1].split("/", 2)[1];


// * LCD HEADER STUFFS


// type title
let title = document.querySelector("#lcd-matrix h1");
let transitions = `&lt &ltI &ltIS &ltISO &ltISOS &ltISOSO &ltISOSOP &ltISOSOPN &ltISOSOPN &ltISOSOPN &ltISOSOPN &ltISOSOP &ltISOSO &ltISOS &ltISOS &ltISOSP &ltISOSPI &ltISOSPIN &ltISOSPIN&gt &ltISOSPIN&gt &ltISOSPIN&gt
`.split(" ");
let delay = 150;
let variance = 0.3;
function type_title(count) {
    if (count == transitions.length - 1) return;
    title.innerHTML = transitions[count];
    setTimeout(type_title, Math.random() * delay * variance + delay * (1 - variance), count + 1)
}

type_title(0);
// // scrolling text
// let scrolling = document.querySelectorAll("#lcd-matrix p");
// let cnt = 0;
// function change_text(element) {
//     element.innerHTML = [cnt += 1, "Fizz", "Buzz", "FizzBuzz"][(cnt % 3 == 0 ? 1 : 0) + ((cnt % 5 == 0 ? 1 : 0) * 2)];
// }
// scrolling.forEach((x) => {
//     x.addEventListener("animationstart", () => { change_text(x) });
//     x.addEventListener("animationiteration", () => { change_text(x) });
// })
let big_header = main_subpage == "home" || main_subpage == "blog";


// * SCROLL BASED EFFECTS


// header scroll stuffs
setAttr("#header", "transform: translateY(0px)");
setAttr("#lcd", "margin-top: calc(0px)");
setAttr("#flop", "transform: translateY(0px)");

function do_onscroll() {
    let scroll = getScrollTop();
    // header stuff, disable if scrolled too far down or we dont have the big header
    if (big_header && scroll < viewportToPixels("80vw")) {
        setAttr("#header", `transform: translateY(${scroll * 0.6}px)`);
        setAttr("#lcd", `margin-top: calc(-${scroll * 0.1}px)`);
        setAttr("#flop", `transform: translateY(-${scroll * 0.4}px)`);
        setAttr("#grid", `background-position-y: -${scroll * 0.1}px`);
        // TODO: randomly scroll each of the post it notes ?
    }
    // subpage specific stuff
    switch (main_subpage) {
        case "home":
            // if were still not scrolled past the final element
            let elem = document.querySelectorAll(".proj-wrapper");
            if (scrolln < elem.length) {
                // open it up if scrolled into view
                if (isScrolledIntoView(elem[scrolln])) {
                    elem[scrolln].classList.add("active");
                    scrolln++;
                }
            }
            break;
        case "blog":
            break;
    }
}
// run it once so these effects activate before the user has to scroll (if applicable)

do_onscroll();
window.onscroll = do_onscroll;


// * SIZE BASED EFFECTS


function calc_vpadding() {
    let elem = document.querySelector("#preview");
    let preview_s = window.getComputedStyle(elem);
    let b = preview_s.paddingBottom;
    let t = preview_s.paddingTop;
    b = b.substring(0, b.length - 2);
    t = t.substring(0, t.length - 2);
    return parseInt(b, 10) + parseInt(t, 10);
}
let preview_vpadding;
if (main_subpage == "blog") preview_vpadding = calc_vpadding();

function do_onresize() {
    switch (main_subpage) {
        case "blog":
            document.querySelectorAll("#preview-wrapper").forEach((x) => {
                if (x.children.length < 2) return;
                let children = [x.children.item(0), x.children.item(1)];

                children.forEach((x) => {
                    x.setAttribute("style", `height: auto`);
                });
                let height = Math.max(children[0].clientHeight, children[1].clientHeight) - preview_vpadding;
                children.forEach((x) => {
                    x.setAttribute("style", `height: ${height}px`);
                });
            });
            break;
    }
}
do_onresize();
window.onresize = do_onresize;