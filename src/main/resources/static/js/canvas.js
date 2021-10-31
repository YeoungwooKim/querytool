window.addEventListener('resize', reportWindowSize);

function reportWindowSize(e) {
    changeSizeCanvas(document.getElementById("canvas"))
}
function changeSizeCanvas(canvas) {
    canvas.width = document.querySelector('.blog-post').offsetWidth
    canvas.height = 1100
    canvas.style.border = "2px solid gray"
}

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.style.border = "2px solid gray"
    canvas.addEventListener("mousedown", listenEvent)
    canvas.addEventListener("mouseup", listenEvent)
    canvas.addEventListener("mousemove", listenEvent)
    canvas.addEventListener("mouseout", listenEvent)
    canvas.addEventListener("mouseenter", listenEvent)
    canvas.oncontextmenu = function (e) { e.preventDefault(); };
    changeSizeCanvas(canvas)
    addOption()
}

function addOption() {
    var option = document.getElementById("erds");
    for (i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if (key.includes("queryGen_")) {
            key = key.split("_");
            option.innerHTML += "<option>" + key[1] + "</option>"
        }
    }
}

function listenEvent(e) {
    //console.log(e.type);
    if (pos.draw) {
        if (e.type == "mousedown") {
            if (e.which == 1) {
                // left click
            } else {
                //right click
                columnCount = 0
                while (columnCount <= 0) {
                    columnCount = prompt("column size?");
                    if (columnCount == null) {
                        break;
                    }
                }
                if (columnCount != null) {
                    changePos(pos, e);
                    //console.log(box);
                    drawRect(box);
                }

            }
        } else if (e.type == "mouseup") {
            if (mouseFlag) {
                changePos(pos, e);
                div = selectedDiv;
                formArr[div.children[4].id].pos = JSON.parse(JSON.stringify(pos));
                div.style.position = 'absolute';
                div.style.left = pos.x + "px"
                div.style.top = pos.y + "px"
                div.style.border = "2px solid gray"
                mouseFlag = false
            }
        } else if (e.type == "mousemove") {

        } else if (e.type == "mouseout") {
            pos.draw = false
        }
    } else {
        if (e.type == "mouseenter") {
            pos.draw = true
        }
    }
}

function changePos(pos, e) {
    var rect = canvas.getBoundingClientRect();
    pos.x = e.layerX //- rect.left
    pos.y = e.layerY //- rect.top
    box.x = pos.x;
    box.y = pos.y;
    if (canvas.width < box.x + box.width) {
        box.x = canvas.width - box.width
    } else {
        box.x = e.layerX
    }
    if (canvas.height < box.y + box.height) {
        box.y = canvas.height - box.height
    } else {
        box.y = e.layerY
    }
}
function drawRect(box) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    //ctx.fillStyle = "rgb(200,0,0)";
    //ctx.fillRect(box.x, box.y, box.width, box.height);
    var tmp = new Forms("POST", "#", box, columnCount, -1);
    formArr[tmp.id] = tmp;
    console.log(formArr);
}

