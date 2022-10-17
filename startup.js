const WIDTH = 110;
const HEIGHT = 40;

// // "boot up" the lcd
// const COL_LCDON = "rgba(63,118,212,1)";
// const lcd_svg = document.querySelector("object");
// console.log(lcd_svg);

// control the pixels
const lcd_matrix = document.querySelector("#lcd-matrix canvas").getContext("2d");
lcd_matrix.fillStyle = "rgba(114,163,247,1)";

function draw_pixel(x, y) {
    lcd_matrix.fillRect( x, y, 1, 1 );
}

for (x=0;x<10;x++)
    draw_pixel(x,1);