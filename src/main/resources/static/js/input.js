function Forms(method, action, pos, columnCount) {
    initDiv(method, action, pos, columnCount);
    this.id = "form_" + String(formNum - 1);
    this.method = method;
    this.action = action;
    this.columnCount = columnCount;
    this.pos = JSON.parse(JSON.stringify(pos));

    btns = document.querySelectorAll("span[id*='_moveBtn']");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("mousedown", moveEvent)
        btns[i].addEventListener("mouseout", moveEvent)
    }
}

function moveEvent(e) {
    if (e.which == 1) {
        try {
            div = e.path[1]
        } catch (e) {
            div = composedPath(e.target)
        }
        prevPos = JSON.parse(JSON.stringify(box));
        mouseFlag = true
        if (e.path[3].id.includes("div_")) {
            selectedDiv = e.path[3]
        }
    }
}

function addColumn(e) {
    idx = e.path[1].children.length - 4
    str = e.path[1].children[idx].id
    str = str.split("_")
    parentNode = e.path[1].id
    div = document.getElementById(parentNode).children
    var columnCount = Number(formArr[div[4].id].columnCount) + 1
    var originPos = formArr[div[4].id].pos;
    removeDiv(div[4].id);
    var tmp = new Forms("POST", "#", originPos, columnCount);
    formArr[tmp.id] = tmp;
    if (e.path[3].id.includes("div_")) {
        selectedDiv = e.path[3]
    }
}
function getTableName(formId) {
    var tableName = document.querySelectorAll("input[id^='" + formId + "'][type=text][class*='tableName']");
    return tableName[0].value;
}

function getColumn(formId) {
    var arr = []
    var colName = document.querySelectorAll("input[id^='" + formId + "'][type=text][class*='colName']");
    var colAttribute = document.querySelectorAll("input[id^='" + formId + "'][type=text][class*='colAttribute']");

    for (var i = 0; i < colName.length; i++) {
        arr.push(
            {
                name: colName[i].value,
                type: colAttribute[i].value
            }
        )
    }
    return arr;
}

function loadData(){
    var selectedOption = document.getElementById("erds").value
    if (selectedOption!="none"){
        var item = JSON.parse(localStorage.getItem("queryGen_"+selectedOption));
        for(var i =0; i<item.length; i++){
            console.log(item[i]);
            //var tmp = new Forms("POST", "#", box, columnCount);
            var tmp = new Forms("POST","#",item[i].pos, item[i].columnCount);
        }
    }
}

function saveLocal() {
    var currentErdName = document.getElementById("Current_Erd").value;
    console.log(currentErdName);
    var list = []
    for (var key in formArr) {
        if (document.getElementById(key) != null) {
            list.push({
                name: key,
                action: formArr[key].action,
                columnCount: formArr[key].columnCount,
                pos: formArr[key].pos,
                tableName: getTableName(key),
                column: getColumn(key)
            });
        }
    }
    localStorage.setItem("queryGen_" + currentErdName, JSON.stringify(list));
    console.log(JSON.parse(localStorage.getItem("queryGen_" + currentErdName)));
}

function deleteColumn(e) {
    formId = div.id.split("_")
    formId = "form_" + formId[1];
    var cCount = Number(formArr[formId].columnCount) - 1
    if (cCount > 0) {
        e.target.parentNode.remove()
        formArr[formId].columnCount = cCount;
    } else {
        delete formArr[formId];
        ((e.target.parentNode).parentNode).parentNode.remove()
    }
}

function generateQuery(e) {
    console.log("hi");
}

function initDiv(method, action, pos, columnCount) {
    div = document.createElement('div');
    div.setAttribute("id", 'div_' + formNum);
    form = setForm(method, action, columnCount);
    div.appendChild(form);

    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'form_' + formNum + "_addBtn");
    btn.setAttribute("class", "btn btn-outline-success my-2 mx-1");
    btn.addEventListener("click", addColumn)
    btn.setAttribute("value", "add");
    div.appendChild(btn);

    btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'form_' + formNum + "_genBtn");
    btn.setAttribute("class", "btn btn-outline-info my-2 mx-1");
    btn.addEventListener("click", generateQuery)
    btn.setAttribute("value", "generate");
    div.appendChild(btn);

    div = setDivPos(div, pos);
    formNum += 1
    document.getElementsByClassName("blog-post")[0].appendChild(div);
    //formArr[div.children[4].id].pos = JSON.parse(JSON.stringify(pos));
}

function removeDiv(parentNodeId) {
    delete formArr[parentNodeId];
    var div = document.getElementById(parentNodeId).id.split("_");
    document.getElementById("div_" + div[1]).remove();
}

function setForm(method, action, columnCount) {
    var span = document.createElement("span");
    span.setAttribute("id", "form_" + formNum + "_moveBtn");

    var icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-arrows-alt fa-2x");
    span.appendChild(icon);
    div.appendChild(span);

    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", 'form_' + formNum + "_tblName_" + formNum);
    tmpInput.setAttribute("class", "tableName no-drag");
    tmpInput.setAttribute("placeholder", " Table Name");
    div.appendChild(tmpInput);

    exitBtn = document.createElement("input");
    exitBtn.setAttribute("type", "button");
    exitBtn.setAttribute("id", 'form_' + formNum + "_exitBtn");
    exitBtn.setAttribute("class", "btn btn-outline-warning");
    exitBtn.setAttribute("style", "float: right;");
    exitBtn.setAttribute("value", "close");
    exitBtn.setAttribute("onclick", "removeDiv('div_" + formNum + "')")
    div.appendChild(exitBtn);
    div.appendChild(document.createElement("hr"));

    form = document.createElement('form');
    form.id = "form_" + formNum;
    form.method = method;
    form.action = action;

    for (i = 0; i < columnCount; i++) {
        var tmpDiv = document.createElement("div");
        tmpDiv.setAttribute("name", "inputDiv");
        tmpDiv.setAttribute("class", "row");
        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        tmpInput.setAttribute("id", 'form_' + formNum + "_colName_" + i);
        tmpInput.setAttribute("class", 'colName no-drag');
        tmpInput.setAttribute("placeholder", " Column Name_" + i);
        tmpDiv.appendChild(tmpInput);

        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        tmpInput.setAttribute("id", 'form_' + formNum + "_colAttribute_" + i);
        tmpInput.setAttribute("class", 'colAttribute no-drag');
        tmpInput.setAttribute("placeholder", " Column Attr_" + i);

        tmpDiv.appendChild(tmpInput);

        var btn = document.createElement('input');
        btn.setAttribute("type", "button");
        btn.setAttribute("id", 'form_' + formNum + "_delBtn_" + i);
        btn.setAttribute("class", "btn btn-outline-danger ml-1");
        btn.addEventListener("click", deleteColumn)
        btn.setAttribute("value", "delete");
        tmpDiv.appendChild(btn);
        form.appendChild(tmpDiv);
    }
    return form;
}

function setDivPos(div, pos) {
    div.style.position = 'absolute';
    div.style.left = pos.x + "px"
    div.style.top = pos.y + "px"
    div.style.border = "2px solid gray"
    div.oncontextmenu = function (e) { e.preventDefault(); };
    return div
}