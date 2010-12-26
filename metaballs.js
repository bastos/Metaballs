// http://www.student.cs.uwaterloo.ca/~swhitmor/article_metaballs.html
var isofield_width;
var isofield_height;
var isofield_max;

var num_metaballs;
var min_threshold;
var max_threshold;
var isofield = [];// [][]
var metaballs = [];
var _canvas;
var ctx;

var Metaball = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    return this;
};

function equation(m, x, y) {
    var _x = m.x;
    var _y = m.y;
    var _radius = m.radius;

    return (_radius / Math.sqrt((x - _x) * (x - _x) + (y - _y) * (y - _y)));
}

function calculateIsofield() {
    isofield_max = 0;
    // Calcula a contribuição de cada metaball para a grade
    for (var x = 0; x < isofield_width; x++) {
        for (var y = 0; y < isofield_height; y++) {
            var sum = 0;
            for (var i = 0; i < num_metaballs; i++) {
                sum += equation(metaballs[i], x, y);
            }
            if (typeof isofield[x] === 'undefined') {
                isofield[x] = [];
            }
            isofield[x][y] = sum;
            if (sum > isofield_max) {
                isofield_max = sum;
            }
        }
    }
}

function setup() {
    min_threshold = 0.85;
    max_threshold = 1.05;
    
    metaballs = [];
    metaballs[0] = new Metaball(10.0, 20.0, 4.0);
    metaballs[1] = new Metaball(1.0, 50.0, 3.0);
    metaballs[2] = new Metaball(10.0, 3.0, 2.0);
    
    num_metaballs = 3;
    isofield_width = 40;
    isofield_height = 40;
    // isofield = new float[isofield_width][isofield_height];
    calculateIsofield();
    
    _canvas = document.getElementById('meatballsspace');  
    $(_canvas).attr({width: (isofield_width * 8), height: (isofield_height * 8)});
    
    _canvas.addEventListener("click", mousePressed, false);
    
    ctx = _canvas.getContext('2d');
    //ctx.fill(125)
    //ctx.fillRect(0, 0, (isofield_width * 8), (isofield_height * 8));
    loop();
}

function loop() {
    draw();
}

function draw() {
    animateMetaballs();
    calculateIsofield();
    drawMetaballs();   //Coloque isso e loop infinito
    setTimeout(redraw, 100)
}

function redraw() {
    console.log("redraw")
    draw();
}

function mousePressed(e) {
    console.log("mouse pressed")
    var xy = getCursorPosition(e);
    var mouseX = xy [0];
    var mouseY = xy[1];
    console.log(xy)
    var cx;
    var cy;
    if (mouseX == 0) {
        cx = 0;
    } else {
        cx = mouseX / 8;
    }
    if (mouseY == 0) {
        cy = 0;
    } else {
        cy = mouseY / 8;
    }

    metaballs[1].x = cx;
    metaballs[1].y = cy;
    redraw();
}

function animateMetaballs() {
    x = metaballs[1].x;
    if (x > isofield_width + metaballs[1].radius) {
        x = 0;
    }
    else {
        x += 1;
    }

    metaballs[1].x = x;
}

function drawMetaballs() {   
    var intensity;
    var value;
    for (var x = 0, ix = 0; x < isofield_width; ix += 8, x++) {
        for (var y = 0, iy = 0; y < isofield_height; iy += 8, y++) {            
            // Calcula influencia de cada metaball no pixel
            intensity = isofield[x][y];
            //value = Math.min(intensity*255,255);
            if (intensity >= min_threshold && intensity <= max_threshold) {
                value = Math.min(intensity * 255.0, 255.0);
            } else {
                value = 0;
            }
            // Desenha o pixel
            ctx.beginPath();   
            if (value < 1) {
                ctx.fillStyle = "#000"
                ctx.strokeStyle = "#000"
            } else {
                ctx.fillStyle = "#fff"                
                ctx.strokeStyle = "#fff"                
            }         
            ctx.rect(ix, iy, 8, 8);              
            ctx.fill();
            ctx.stroke();            
            ctx.closePath();            
        }
    }
}


function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= _canvas.offsetLeft;
    y -= _canvas.offsetTop;
    return [x, y]
}
