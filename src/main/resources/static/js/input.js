function Forms(method, action, pos, columnCount, loadIdx) {
    initDiv(method, action, pos, columnCount, loadIdx);
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

function drawRef(e) {
    console.log(e.target);
}

function addColumn(e) {
    var formId = e.target.id.split("_addBtn")[0];
    var form = document.getElementById(formId);

    var tmpDiv = document.createElement("div");
    tmpDiv.setAttribute("name", "inputDiv");
    tmpDiv.setAttribute("class", "row");

    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", formId + "_colName_" + formArr[formId].columnCount);
    tmpInput.setAttribute("class", 'colName no-drag');
    tmpInput.setAttribute("placeholder", " Column Name_" + i);
    tmpDiv.appendChild(tmpInput)
    tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", formId + "_colAttribute_" + formArr[formId].columnCount);
    tmpInput.setAttribute("class", 'colAttribute no-drag');
    tmpInput.setAttribute("placeholder", " Column Attr_" + i);
    tmpDiv.appendChild(tmpInput);

    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", formId + "_delBtn_" + formArr[formId].columnCount);
    btn.addEventListener("click", deleteColumn)
    btn.setAttribute("value", "delete");
    tmpDiv.appendChild(btn);

    form.append(tmpDiv)
    formArr[formId].columnCount = Number(formArr[formId].columnCount) + 1;

    if (e.path[3].id.includes("div_")) {
        selectedDiv = e.path[3]
    }
}

function generateQuery(e) {
    formId = (e.target.previousSibling).previousSibling.id;
    var tableName = getTableName(formId)
    var tableColumn = getColumn(formId)
    console.log(tableName, tableColumn);
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

function clearDivs() {
    var divs = document.querySelectorAll("div[id^='div_'")
    for (var i = 0; i < divs.length; i++) {
        divs[i].remove()
    }
    formNum = 0;
}

function isChanged() {
    var currentErdName = document.getElementById("Current_Erd").value;
    if (currentErdName != "") {
        var list = JSON.stringify(makeListCurrentCanvas())
        var savedList = localStorage.getItem("queryGen_" + currentErdName)
        if (list == savedList) {
            return false;
        } else {
            return true;
        }
    }
    return false;
}

function setPreviousErd() {
    previousErd = document.getElementById("erds").value;
}

function getFromLocal(selectedOption) {
    var item = JSON.parse(localStorage.getItem("queryGen_" + selectedOption));
    var formArr = {};
    for (var i = 0; i < item.length; i++) {
        var tmp = new Forms("POST", "#", item[i].pos, item[i].columnCount, i);
        formArr[item[i].name] = {
            action: "#",
            columnCount: item[i].columnCount,
            id: item[i].name,
            method: "POST",
            pos: item[i].pos
        }
    }
    return formArr;
}

function loadData() {
    var selectedOption = document.getElementById("erds").value
    if (isChanged()) {
        if (confirm("저장되지 않은 사항이 존재합니다.\n저장하지 않고 이동하시겠습니까? ")) {
            clearDivs()
            if (selectedOption != "none") {
                formArr = getFromLocal(selectedOption);
                document.getElementById("Current_Erd").value = selectedOption
            }
        } else {
            document.getElementById("erds").value = previousErd;
        }
    } else {
        clearDivs()
        if (selectedOption != "none") {
            formArr = getFromLocal(selectedOption);
            document.getElementById("Current_Erd").value = selectedOption
        } else {
            document.getElementById("Current_Erd").value = ""
        }
    }

}

function makeListCurrentCanvas() {
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
    return list;
}

function saveLocal() {
    var currentErdName = document.getElementById("Current_Erd").value;
    console.log(currentErdName);
    var list = makeListCurrentCanvas()
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

function initDiv(method, action, pos, columnCount, loadIdx) {
    div = document.createElement('div');
    div.setAttribute("id", 'div_' + formNum);
    div.setAttribute("name", 'parentDiv')
    form = setForm(method, action, columnCount, loadIdx);
    div.appendChild(form);

    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'form_' + formNum + "_addBtn");
    btn.addEventListener("click", addColumn)
    btn.setAttribute("value", "add");
    div.appendChild(btn);

    btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'form_' + formNum + "_refBtn");
    btn.addEventListener("click", drawRef)
    btn.setAttribute("value", "ref");
    div.appendChild(btn);

    btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'form_' + formNum + "_genBtn");
    //btn.setAttribute("class", "btn btn-outline-info my-2 mx-1");
    btn.addEventListener("click", generateQuery)
    btn.setAttribute("value", "generate");
    div.appendChild(btn);


    div = setDivPos(div, pos);
    formNum += 1
    document.getElementsByClassName("blog-post")[0].appendChild(div);
}

function removeDiv(parentNodeId) {
    delete formArr[parentNodeId];
    var div = document.getElementById(parentNodeId).id.split("_");
    document.getElementById("div_" + div[1]).remove();
}

function setForm(method, action, columnCount, loadIdx) {
    var span = document.createElement("span");
    span.setAttribute("id", "form_" + formNum + "_moveBtn");

    var icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-arrows-alt fa-2x");
    span.appendChild(icon);
    div.appendChild(span);

    var selectedOption = document.getElementById("erds").value
    var item = JSON.parse(localStorage.getItem("queryGen_" + selectedOption));

    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", 'form_' + formNum + "_tblName_" + formNum);
    tmpInput.setAttribute("class", "tableName no-drag");
    if (loadIdx >= 0) {
        tmpInput.setAttribute("value", item[loadIdx].tableName);
    }
    tmpInput.setAttribute("placeholder", " Table Name");
    div.appendChild(tmpInput);

    exitBtn = document.createElement("input");
    exitBtn.setAttribute("type", "button");
    exitBtn.setAttribute("id", 'form_' + formNum + "_exitBtn");
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
        if (loadIdx >= 0) {
            tmpInput.setAttribute("value", item[loadIdx].column[i].name)
        }
        tmpInput.setAttribute("class", 'colName no-drag');
        tmpInput.setAttribute("placeholder", " Column Name_" + i);
        tmpDiv.appendChild(tmpInput);

        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        tmpInput.setAttribute("id", 'form_' + formNum + "_colAttribute_" + i);
        if (loadIdx >= 0) {
            tmpInput.setAttribute("value", item[loadIdx].column[i].type)
        }
        tmpInput.setAttribute("class", 'colAttribute no-drag');
        tmpInput.setAttribute("placeholder", " Column Attr_" + i);

        tmpDiv.appendChild(tmpInput);

        var btn = document.createElement('input');
        btn.setAttribute("type", "button");
        btn.setAttribute("id", 'form_' + formNum + "_delBtn_" + i);
        btn.addEventListener("click", deleteColumn)
        btn.setAttribute("value", "delete");
        tmpDiv.appendChild(btn);
        form.appendChild(tmpDiv);
    }
    return form;
}

function setDivPos(div, pos) {
    div.style.left = (pos.x + 35) + "px"
    div.style.top = (pos.y + 50) + "px"
    div.oncontextmenu = function (e) { e.preventDefault(); };
    return div
}