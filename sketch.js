// Una variable global para almacenar el contenido del lienzo
var contenido;

const FRUITS = [
  {
    name: "img/00_cherry",
    diameter: 33,
    pt: 0,
  },
  {
    name: "img/01_strawberry",
    diameter: 48,
    pt: 1,
  },
  {
    name: "img/02_grape",
    diameter: 61,
    pt: 3,
  },
  {
    name: "img/03_gyool",
    diameter: 69,
    pt: 6,
  },
  {
    name: "img/04_orange",
    diameter: 89,
    pt: 10,
  },
  {
    name: "img/05_apple",
    diameter: 114,
    pt: 15,
  },
  {
    name: "img/06_pear",
    diameter: 129,
    pt: 21,
  },
  {
    name: "img/07_peach",
    diameter: 156,
    pt: 28,
  },
  {
    name: "img/08_pineapple",
    diameter: 177,
    pt: 36,
  },
  {
    name: "img/09_melon",
    diameter: 220,
    pt: 45,
  },
  {
    name: "img/10_watermelon",
    diameter: 259,
    pt: 55,
  },
];

let cherry;
let currentBody = null;
let currentFruit = null;
let nextFruit = null;
let interval = null;
let disableAction = false;
let Gfruit;
let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  world.gravity.y = 10;

  leftWall = new Sprite((width/2)-249, height/2, 30, 582, "static");
  leftWall.color = "#f6d581";

  rightWall = new Sprite((width/2)+249, height/2, 30, 582, "static");
  rightWall.color = "#f6d581";

  ground = new Sprite(width/2, (height/2)+276, 468, 30, "static");
  ground.color = "#f6d581";

  topLine = new Sprite(width/2, (height/2)-289, 468, 2, "static");
  topLine.color = "#f6d581";
  topLine.stroke = 'none';
  //topLine.visible = false;

  cloud = new Sprite();
  cloud.img = "img/cloud1.png";
  cloud.w = 10;
  cloud.h = 10;
  cloud.y = topLine.y - 80;
  //cloud.debug = true;
  cloud.ignoreGravity = true;
  cloud.rotationLock =  true;
  //cloud.friction = 0;
  cloud.restitution = 0; 
  //cloud.collider = 'kinematic'

  /*strawberry = new Sprite();
  strawberry.img = "img/01_strawberry.png";
  strawberry.diameter = 48;
  strawberry.debug = true;*/
  Gfruit = new Group();
  addCurrentFruit();
  cloud.w = currentBody.diameter;

  nextF = new Sprite();
  nextF.name = nextFruit.name;
  nextF.img = `/${nextFruit.name}.png`;
  nextF.x = width - 60;
  nextF.y = cloud.y + 55;
  nextF.d = nextFruit.diameter;
  nextF.collider = 'static';

  nextF.update = () => {
    nextF.img = `/${nextFruit.name}.png`;
		nextF.diameter = nextFruit.diameter;
	};

  Gfruit.collides(Gfruit, collisions);

  Gfruit.overlaps(topLine, gameOver);
  // Guardar el contenido del lienzo en la variable global
  //contenido = get();
}

function draw() {
  clear();
  background("#f7f2c8");
  noStroke();

  textAlign('center');
  textSize(32);
	fill('black');
	text(`Score
  ${score}   `, 60, cloud.y);

  text(`Next`, width - 60, cloud.y);

 

  cloud.moveTowards(constrain(mouseX,leftWall.x+16+currentBody.d/2,rightWall.x-16-currentBody.d/2), topLine.y - 80, 1);
  //console.log(mouseX + ' '+ mouseY);
  //currentBody.moveTowards(mouseX, 1);
  //console.log(constrain(mouseX,28+currentBody.d/2,589-currentBody.d/2));
  if (mouse.presses()) {
    if (disableAction) return;
    disableAction = true;
    if (cloud.joints.length > 0) j.remove();
    currentBody.resetMass();
    currentBody.sleeping = false;
    setTimeout(() => {
      addCurrentFruit();
      cloud.w = currentBody.diameter;
      disableAction = false;
    }, 1000);
  }
  
  
}

function addCurrentFruit() {
  let randomFruit = null;
  if (nextFruit) {
    randomFruit = nextFruit;
  }else {
    randomFruit = getRandomFruit();
  }
  //console.log(`/${randomFruit.name}.png`);
  body = new Gfruit.Sprite();
  body.name = randomFruit.name;
  body.img = `/${randomFruit.name}.png`;
  body.x = cloud.x;
  body.y = cloud.y + 40;
  body.diameter = randomFruit.diameter;
  //body.debug = true;
  body.sleeping = true;
  body.restitution = 0.2;
  body.mass = 0;

  j = new GlueJoint(cloud, body);
  
  currentBody = body;
  nextFruit =  getRandomFruit();
  currentFruit = randomFruit;/*

  World.add(world, body);*/
}

function getRandomFruit() {
  const randomIndex = Math.floor(Math.random() * 5);
  const fruit = FRUITS[randomIndex];

  //if (currentFruit && currentFruit.name === fruit.name)
    //return getRandomFruit();
  //console.log(fruit);
  return fruit;
}

function collisions(fruitA, fruitB) {
  console.log(disableAction);
  if(fruitA.name === fruitB.name){
    //console.log((fruitA.x + fruitB.x)/2);
    //console.log((fruitA.y + fruitB.y)/2);
    //console.log(fruitA.sleeping);
    //world.autoStep = false

    const index = FRUITS.findIndex(
      (fruit) => fruit.name === fruitA.name
    );

    // If last fruit, do nothing
    if (index === FRUITS.length - 1) return;

    const newFruit = FRUITS[index + 1];

    body = new Gfruit.Sprite();
    body.name = newFruit.name;
    body.img = `/${newFruit.name}.png`;
    body.x = (fruitA.x + fruitB.x)/2;
    body.y = (fruitA.y + fruitB.y)/2;
    body.diameter = newFruit.diameter;
    //body.debug = true;
    body.restitution = 0.2;
    
    score += newFruit.pt;

    fruitA.remove();
    fruitB.remove();

  }
  
}

function gameOver() {
  /*console.log('hola');
  if(!disableAction){
    alert("Game over");
  }*/
  
}

// esta función se llama cuando la ventana cambia de tamaño
function windowResized() {
  // redimensiona el canvas al nuevo tamaño de la ventana
  resizeCanvas(windowWidth, windowHeight);
  // Dibujar el contenido guardado en el lienzo redimensionado
  //image(contenido, 0, 0, width, height);
}