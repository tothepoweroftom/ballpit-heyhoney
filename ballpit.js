Matter.use("matter-attractors");

let topline = "Tap to Hey";
let bottom = "Keep tapping to Hey Honey";
let texts = [topline, bottom];

var Engine = Matter.Engine;
var render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Composites = Matter.Composites;

var engine;
var attractor;

var mouseEl, mouseParams;
var canvas;
let font, fontsize = 30;

let boxes = [];

let clickCount = 2;
let honeyCount = 0;

let logo;
let sound;
let heyHoneySound;
let textBlocks = [];
let heyArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

let honeyArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

let $menuDOM = $('.w-nav-overlay');

function preload() {
    logo = loadImage("https://assets.codepen.io/5403278/hey-honey-logo-transparent.png");
    $menuDOM = $('.w-nav-overlay');
    sound = new Howl({
        src: ["https://firebasestorage.googleapis.com/v0/b/heyhoneywebsite.appspot.com/o/heyslong.mp3?alt=media&token=c3a356d0-a1e9-4e29-8ac6-6ddc9513a6f7", ],
        preload: true,

        sprite: {
            1: [0, 800],
            2: [1000, 800],
            3: [2000, 800],
            4: [3000, 800],
            5: [4000, 800],
            6: [5000, 800],
            7: [6000, 800],
            8: [7000, 800],
            9: [8000, 800],
            10: [9000, 800],
            11: [10000, 800],
            12: [11000, 800],
            13: [12000, 800],
        },
    });

    heyHoneySound = new Howl({
        src: ["https://firebasestorage.googleapis.com/v0/b/heyhoneywebsite.appspot.com/o/heyhoneylong.mp3?alt=media&token=7f4e6a7e-dd2d-44a3-95bc-9a8c4e072829", ],
        preload: true,

        sprite: {
            1: [0, 800],
            2: [1000, 800],
            3: [2000, 800],
            4: [3000, 800],
            5: [4000, 800],
            6: [5000, 950],
            7: [6000, 800],
            8: [7000, 1200],
            9: [9000, 900],
            10: [10000, 900],
        },
    });
}

function shuffleArrays(onlyHey=false) {
    var i = heyArray.length, k, temp;
    // k is to generate random index and temp is to swap the values
    while (--i > 0) {
        k = Math.floor(Math.random() * (i + 1));
        temp = heyArray[k];
        heyArray[k] = heyArray[i];
        heyArray[i] = temp;
    }

    if (!onlyHey) {
        var j = honeyArray.length, l, tem;
        // k is to generate random index and temp is to swap the values
        while (--j > 0) {
            l = Math.floor(Math.random() * (j + 1));
            tem = heyArray[l];
            heyArray[l] = heyArray[j];
            heyArray[j] = tem;
        }
    }
}

function setup() {
    let container = document.getElementById("ballpit-container-1");
    shuffleArrays();
    let containerWidth = $('#menu-container') ? $('#menu-width').width() : $(container).width()*0.5
    canvas = createCanvas(containerWidth, $(container).height());
    canvas.parent("ballpit-container-1");

    fontsize = container.clientWidth / 1080 * 40;

    if (fontsize > 30) {
        fontsize = 30;
    }

    textSize(fontsize);
    textFont("Inter");
    textAlign(CENTER, CENTER);
    // create an engine
    engine = Engine.create();

    // no gravity
    engine.world.gravity.scale = 0.000005;

    // add attractor
    attractor = Bodies.circle(400, 400, 50, {
        isStatic: true,
        plugin: {
            attractors: [function(bodyA, bodyB) {
                return {
                    x: (bodyA.position.x - bodyB.position.x) * 2e-6,
                    y: (bodyA.position.y - bodyB.position.y) * 2e-6,
                };
            }
            , ],
        },
    });
    World.add(engine.world, attractor);

    // addTexts();
    addBoundaries();

    // setup mouse
    mouseEl = Mouse.create(canvas.elt);
    mouseParams = {
        mouse: mouseEl,
        constraint: {
            stiffness: 0.05
        },
    };
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);

    // run the engine

    Matter.Runner.run(engine);
}

function draw() {

    background("#fff");

    stroke(128);
    strokeWeight(1);
    noFill();
    drawBodies(boxes);
    drawAttractor(attractor);

}

function addTexts() {
    let txtWidth = canvas.drawingContext.measureText(texts[0]).width * 3;
    let text1 = Bodies.rectangle(width / 2, height / 2 - 40 * 0.5, txtWidth, 40, {
        isStatic: true,
    });
    textBlocks.push(text1);
    World.add(engine.world, text1);

    let txtWidth2 = canvas.drawingContext.measureText(texts[1]).width * 3;
    let text2 = Bodies.rectangle(width / 2, height / 2 + 40 * 0.75, txtWidth2, 40, {
        isStatic: true,
    });
    textBlocks.push(text2);
    World.add(engine.world, text2);
}

function addBoundaries() {
    // walls
    World.add(engine.world, [// walls
    Bodies.rectangle(width / 2, 0, width, 25, {
        isStatic: true
    }), Bodies.rectangle(width / 2, height, width, 25, {
        isStatic: true
    }), Bodies.rectangle(width, height / 2, 25, height, {
        isStatic: true
    }), Bodies.rectangle(0, height / 2, 25, height, {
        isStatic: true
    })]);
}

function drawTexts(tb) {
    for (let i = 0; i < textBlocks.length; i++) {
        push();
        fill(0);

        text(texts[i], tb[i].position.x, tb[i].position.y);
        pop();
    }
}

function drawBall(body) {
    push();
    translate(body.position.x, body.position.y);
    rotate(body.angle);
    noStroke();
    fill(255, 255, 0);
    ellipse(0, 0, body.circleRadius * 2, body.circleRadius * 2);

    image(logo, 0 - body.circleRadius * body.opacity, 0 - body.circleRadius * body.opacity, body.circleRadius * body.opacity * 2, body.circleRadius * body.opacity * 2);
    pop();
}

function drawBodies(bodies) {
    for (var i = 0; i < bodies.length; i++) {
        // drawVertices(bodies[i].vertices);

        drawBall(bodies[i]);
    }
}

function drawAttractor(attractor) {
    // console.log(mouseEl.position)
    Matter.Body.setPosition(attractor, mouseEl.position);

    push();

    pop();
}

function touchEnded() {

    // Check if mouse is over the div 
    
    if ($menuDOM.css("display") == "none") {
    } else {
   
        if (mouseY > 0) {
            if (boxes.length < 80) {
                let radius = 20 + Math.random() * 10;

                let polar = {
                    r: 50 + Math.random() * 30,
                    theta: Math.random() * 360
                }
                let ball = Bodies.circle(mouseEl.position.x + polar.r * Math.sin(polar.theta), mouseEl.position.y + polar.r * Math.cos(polar.theta), radius, {
                    friction: 0.01,
                });
                ball.opacity = 0.001;

                World.add(engine.world, ball);
                if (clickCount == 0) {
                    setTimeout(()=>{
                        sound.play(heyArray[clickCount % heyArray.length]);

                    }
                    , 1000);
                }

                if (clickCount % 5 != 0) {
                    sound.play(heyArray[clickCount % heyArray.length]);
                } else if (clickCount % 5 === 0 && clickCount != 0) {
                    heyHoneySound.play(honeyArray[honeyCount % honeyArray.length]);
                    gsap.to(ball, 1, {
                        opacity: 1.0,
                        onComplete: function() {},
                    });

                    honeyCount += 1;
                    shuffleArrays(true);
                }

                boxes.push(ball);
                clickCount += 1;
            } else if (boxes.length >= 80) {
                heyHoneySound.play(honeyArray[honeyCount % honeyArray.length]);
                honeyCount += 1;

                for (let i = 0; i < boxes.length; i++) {
                    gsap.to(boxes[i], 1, {
                        opacity: 1.0,
                        delay: i * 0.1,
                        onComplete: function() {
                            gsap.to(boxes[i], 1, {
                                opacity: 0.001,
                                delay: i * 0.1,
                                onComplete: function() {},
                            });
                        },
                    });
                }
            }
        }
    }
}
function mouseWheel(event) {
    window.scrollTo(0, window.scrollY + event.delta);

    return true;
}
