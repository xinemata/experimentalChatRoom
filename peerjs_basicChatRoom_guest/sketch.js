// https://p5js.org/reference/#/p5.Element

// Profile
const myID = 'leeeeee'; // give this ID to your guest

// Communication
let peer = null;
let conn = null;
let msgInput;
let sendBtn;
let idInput;
let connectBtn;
let theirMsg = ' ';
let myMsg = ' ';

function setup() {
  createCanvas(400, 400);
  noStroke();

  // Interface
  const inputX = 50;
  const inputY = height - 50;
  const inputW = width - 150;
  const inputH = 20;
  const btnPadding = 10;
  const btnW = inputH * 2;
  const btnH = inputH * 1.3;

  idInput = createInput();
  idInput.position(inputX * 3.5, 35); // x, y
  idInput.size(inputW / 2, inputH); // width, height

  connectBtn = createButton('connect');
  connectBtn.position(inputX + inputW + btnPadding, 35);
  connectBtn.size(btnW + 15, btnH);
  connectBtn.mousePressed(connect);

  msgInput = createInput();
  msgInput.position(inputX, inputY); // x, y
  msgInput.size(inputW, inputH); // width, height

  sendBtn = createButton('send');
  sendBtn.position(inputX + inputW + btnPadding, inputY);
  sendBtn.size(btnW, btnH);
  sendBtn.mousePressed(sendMsg);

  //create peer object
  peer = new Peer(myID, {
    key: 'lwjd5qra8257b9',
    debug: 2
  });

  // pass connection ID into peer object
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

  // executes when connection is established
  peer.on('connection', function(c) {
    conn = c;
  });
}

function draw() {
  bg();
  hostID();
  displayMsg();
}

function bg() {
  fill('yellow');
  rect(0, 0, width, height / 2);

  fill('pink');
  rect(0, height / 2, width, height / 2);
}

function hostID() {
  textSize(12);
  if (peer.id == null) {
    text("generating Host ID...", 50, 50);
  } else if (peer.id != null) { // if peer.id IS NOT empty
    text("My ID: " + peer.id, 50, 50);
  } else if (peer.disconnected) {
    text("Disconnected" + peer.id, 50, 50);
  }
}

function connect() {
  if (conn) { // Close old connection if applicable
    conn.close();
  }
  conn = peer.connect(idInput.value(), { // Creates a new connection using the entered ID
    reliable: true
  });
  conn.on('open', function() {
    console.log("connected to: " + conn.peer);
  });
  conn.on('data', function(data) {
    console.log("received: " + data);
    theirMsg = data;
  });
}

function sendMsg() {
  if (conn && conn.open) {
    myMsg = msgInput.value();
    conn.send(myMsg);
    console.log("msg sent!");
    msgInput.value('');
  } else {
    console.log("not connected");
  }
}

function keyPressed() {
  if (keyCode === 13) { //send msg when ENTER key is pressed
    sendMsg();
  }
}

function displayMsg() {
  fill('black');
  textSize(24);
  // their message
  text(theirMsg, 50, 100, 200, 200);
  // my message
  text(myMsg, 50, height / 2 + 70, 200, 200);
}