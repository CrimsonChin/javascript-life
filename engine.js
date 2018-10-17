var map = {
    cols: 40,
    rows: 20,
    tSize: 20,
    tiles: [],
    getTile: function (col, row) {
        return this.tiles[row * map.cols + col];
    },
    setTile: function (col, row, v) {
        this.tiles[row * map.cols + col] = v;
    }
};

map.tiles = Array.apply(null, Array(25)).map(() => 0);

function drawTile(ctx, x, y, size, fillStyle) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.rect(x * size, y * size, size, size);
    ctx.fill();
    ctx.stroke();
}

let gameViewport = document.getElementById('game-viewport');
gameViewport.width = map.cols * map.tSize;
gameViewport.height = map.rows * map.tSize;
let ctx = gameViewport.getContext('2d');

let offsetLeft = gameViewport.offsetLeft;
let offsetTop = gameViewport.offsetTop;

gameViewport.addEventListener('click', function () {
    var x = Math.floor((event.pageX - offsetLeft) / map.tSize);
    var y = Math.floor((event.pageY - offsetTop) / map.tSize);

    drawTile(ctx, x, y, map.tSize, 'black');
    map.setTile(x, y, 1);
}, false);



function countLiveNeighbours(startX, startY) {
    let liveNeighbourCount = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const posX = startX + x;
            const posY = startY + y;

            if (x == 0 && y == 0) {
                continue;
            }

            if (posX < map.cols && posY < map.rows && posX >= 0 && posY >= 0 && map.getTile(posX, posY) == 1) {
                liveNeighbourCount++;
            }
        }
    }

    return liveNeighbourCount;
}

function step() {
    let map2 = [];

    for (let r = 0; r < map.rows; r++) {
        for (let c = 0; c < map.cols; c++) {
            let isAlive = map.getTile(c, r) == 1;
            let liveNeighbourCount = countLiveNeighbours(c, r);
            if (isAlive) {
                if (liveNeighbourCount < 2) {
                    map2.push(0); // underpopulation
                } else if (liveNeighbourCount > 3) {
                    map2.push(0); // overpopulatiom
                } else {
                    map2.push(1); // survives
                }
            } else if (!isAlive && liveNeighbourCount == 3) {
                map2.push(1); // reproduction
            } else {
                map2.push(0)
            }
        }
    }
    map.tiles = map2;

    renderMap(map);
}


function renderMap(map) {
    ctx.clearRect(0, 0, map.cols * map.tSize, map.rows * map.tSize);

    for (let r = 0; r < map.rows; r++) {
        for (let c = 0; c < map.cols; c++) {

            if (map.getTile(c, r) == 1) {
                drawTile(ctx, c, r, map.tSize, 'black');
            }
        }
    }
}

var btn = document.getElementById('reset').addEventListener('click', function () {
    map.tiles = Array.apply(null, Array(25)).map(() => 0);
    renderMap(map);
}, false);

let t = null;
var btn = document.getElementById('step');
btn.addEventListener('click', function () {
    if (t != null) {
        clearInterval(t);
        btn.innerText = "Start";
        t = null;
        return;
    }

    btn.innerText = "Stop";
    t = setInterval(step, 500);
}, false);