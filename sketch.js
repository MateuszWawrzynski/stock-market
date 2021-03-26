const refreshRate = 0.5;
let scale = 200;

let money = 100.0;
let bought = 1;

let history = [];
let stock = 100.0;


function setup(){
  createCanvas(800, 400);
  
  let v = random(50, 150)
  stock = v;
  money = v;
  
  let btnBuy = createButton(`KUP (D)`)
  btnBuy.mousePressed(() => {
    buyStocks(1)
  })
  
  let btnSell = createButton(`SPRZEDAJ (F)`)
  btnSell.mousePressed(() => {
    sellStocks(1)
  })
}

function draw(){
  background(51)
  
  calculateScale();
  drawLines();
  drawInfo();
  drawGraph();
  drawCursor();
  
  if(frameCount % (60 * refreshRate) == 0){ 
    calculatePrice();
  }
}


function calculateScale(){
  scale = Math.max(height/2, ...history) + height * 0.1
}

function drawLines(){
  push()
  fill(255, 100)
  stroke(255, 100)
  
  let x = 50 + 50 * Math.round(Math.max(stock, ...history)/800)
  
  for(let a = 0; a < 5000; a += x){  
    let y = map(a, 0, scale, height, 0);
    line(0, y, width*0.85, y)
    text(`${a}$`, 5, y-5)
  }
  
  let maxY = map(Math.max(...history), 0, scale, height, 0);
  stroke(0, 0, 255, 100)
  line(0, maxY, width*0.85, maxY)
  text(`Rekord: ${Math.max(...history).toFixed(2)}$`, width*0.85-85, maxY-5)
  
  pop()
}

function drawInfo(){
  push()
  fill(255)
  noStroke()
  textAlign(CENTER)
  textSize(14)
  
  let x = width-width*0.07;
  
  //text(`Obecna\ncena akcji\n${stock.toFixed(2)}$`, x, height*0.20)
  
  text(`Ilość akcji\nzakupionych\n${bought}`, x, height*0.33)
  text(`Ilość dostępnych\npieniędzy\n${money.toFixed(2)}$`, x, height*0.55)
  pop()
}

function drawGraph(){
  push();
  for(let a = 1; a < history.length; a++){
    let vp = map(Math.abs(history[a-1]), 0, scale, height, 0)
    let v = map(Math.abs(history[a]), 0, scale, height, 0);
    v <= vp ? stroke(0, 255, 0) : stroke(255, 0, 0)
    line(a-1 + width*0.05, vp, a + width*0.05, v)
    
    if(history[a] < 0) {
      noStroke();
      fill(0, 0, 255);
      ellipse(a + width*0.05, v, 8, 8);
      textAlign(CENTER)
      stroke(0, 0, 255)
      text(`${Math.abs(history[a]).toFixed(2)}$`, a-1 + width*0.05, v + 20)
    }
    
    if(a == history.length-1){
      textAlign(LEFT)
      stroke(255)
      noFill()
      text(`${stock.toFixed(2)}$`, a+50, v)
      
      if(history[history.length-2] >= stock){
        stroke(255, 0, 0)
        text(`v`, a+100, v)
      }
      else{
        stroke(0, 255, 0)
        text(`^`, a+100, v) 
      }
    }
  }
  pop();
}

function drawCursor(){
  push();
  fill(255)
  noStroke();
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    let v = map(mouseY, height, 0, 0, scale)
    ellipse(mouseX, mouseY, 4, 4)
    text(`${v.toFixed(2)}$`, mouseX+10, mouseY-10)
  }
  pop();
}

function calculatePrice(){
  let h = noise(frameCount * 0.01);
  if(Math.random(1) >= 0.5)
    h *= -1;
  
  stock += (stock * (h/10));
  stock = Math.max(1, stock);

  history.push(stock)
  if(history.length > width * 0.7)
    history.splice(0, 1)
}


function keyPressed(){
  if(key == 'd') buyStocks(1)
  else if(key == 'f') sellStocks(1)
}

function buyStocks(){
  if(money >= stock){
    money -= stock;
    bought++;
    history.push(-stock)
    
    let p = createP(`Zakupiono 1 akcję za ${stock.toFixed(2)}$`)
    p.style('color:lime')
    setTimeout(() => { p.remove() }, 3000)
  }
  else{
    let p = createP(`Brak funduszy na zakup akcji`)
    p.style('color:red')
    setTimeout(() => { p.remove() }, 3000)
  }
}

function sellStocks(){
  if(bought > 0){
    money += stock;
    bought--;
    
    let p = createP(`Sprzedano 1 akcję za ${stock.toFixed(2)}$`)
    p.style('color:lime')
    setTimeout(() => { p.remove() }, 3000)
  }
  else{
    let p = createP(`Brak akcji do sprzedania`)
    p.style('color:red')
    setTimeout(() => { p.remove() }, 3000)
  }
}



















