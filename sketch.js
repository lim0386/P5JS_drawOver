let model;
let previous_pen = "down";
let x, y;
let strokePath;

//추가
var countText;
var px = [];
var py = [];
var xx = [];
var yy = [];
//추가

function preload() {
  model = ml5.sketchRNN("cat");
}

function setup() {
  createCanvas(640, 480);

  countText = 0; //초기화

  background(255);

  let button = createButton("clear");
  button.mousePressed(startDrawing);

  startDrawing();
}

function modelReady() {
  console.log("model loaded");
  startDrawing();
}

function startDrawing() {
  countText = 0; //그림 초기화를 위한 상황

  background(255);
  x = width / 2;
  y = height / 2;
  model.reset();
  model.generate(gotStroke);
}

function draw() {
  fill(255, 0, 0); //혹시나 해서 색상 설정
  rect(0, 0, width, height); //영상 대신 네모로 덮어 씌우게 한뒤 그 위에 그리게 함
  if (strokePath) {
    if (previous_pen == "down") {
      stroke(0);
      strokeWeight(3.0);
      line(x, y, x + strokePath.dx, y + strokePath.dy);

      //추가
      countText++; //카운트를 어레이로 저장하기 위한 숫자 증가
      //위에 그려지는 그림을 array로 저장할 부분
      px[countText] = x;
      py[countText] = y;
      xx[countText] = x + strokePath.dx;
      yy[countText] = y + strokePath.dy;
      console.log(px, py, xx, yy); // 찍기
    } else {
      for (var i = 0; i < countText; i++) { //for문
        console.log("start"); //시작을 알림
        line(px[i] + mouseX-width/2, py[i] + mouseY-height/2, xx[i] + mouseX-width/2, yy[i] + mouseY-height/2);
        //이것은 array로 그려서 한번에 그림으로 보여주는 방식으로
        //for문이 순식간에 그리므로 사라지지 않음
        //mouseX와 mouseY를 더해주므로서 마우스를 따라 움직이게 됨
        //mouseX-width/2, mouseY-height/2를 해주면 마우스를 중심으로 움직임
      }
      console.log("END");//마침을 알림
    }
    //추가

    x += strokePath.dx;
    y += strokePath.dy;

    previous_pen = strokePath.pen;

    if (strokePath.pen !== "end") { //여기가 마침인줄 알았으나 
      strokePath = null;            //이것은 그냥 스트로크를 뗀 수준
      model.generate(gotStroke);
    }
  }
}

function gotStroke(err, s) {
  strokePath = s;
}
