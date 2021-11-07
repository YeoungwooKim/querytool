function Tables(pos, columnCount, loadIdx) {
    initDiv(pos, columnCount, loadIdx);
    this.id = "table_" + String(tableNum - 1);
    this.columnCount = columnCount;
    this.pos = JSON.parse(JSON.stringify(pos));

    btns = document.querySelectorAll("span[id*='_moveBtn']");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("mousedown", moveEvent)
        btns[i].addEventListener("mouseout", moveEvent)
    }
}

function initDiv(pos, columnCount, loadIdx) {
    var div = document.createElement('div');
    div.setAttribute("id", 'table_' + tableNum);
    div.setAttribute("class", 'parentDiv');

    setDiv(columnCount, loadIdx, div);

    div = setDivPos(div, pos);
    tableNum += 1
    document.getElementsByClassName("blog-post")[0].appendChild(div);
}

function setDiv(columnCount, loadIdx, div) {
    div.appendChild(setDivHeader(loadIdx));

    div.appendChild(setDivBody(columnCount, loadIdx))

    div.appendChild(setDivFooter())
}

function setDivPos(div, pos) {
    div.style.left = (pos.x + 35) + "px"
    div.style.top = (pos.y + 50) + "px"
    div.oncontextmenu = function (e) { e.preventDefault(); };
    return div
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
        var table = (((e.target.parentNode).parentNode).parentNode).parentNode
        if (table.className.includes("parentDiv")) {
            selectedTable = table
        }
    }
}

function deleteColumn(e) {
    var table = (e.target.parentNode).parentNode;
    var tableId = table.id.substring(0, table.id.length - 5)
    var modifiedCount = Number(tableArr[tableId].columnCount) - 1
    if (modifiedCount > 0) {
        e.target.parentNode.remove()
        tableArr[tableId].columnCount = modifiedCount;
    } else {
        delete tableArr[tableId];
        ((e.target.parentNode).parentNode).parentNode.remove()
    }
}

function removeDiv(parentNodeId) {
    delete tableArr[parentNodeId];
    var div = document.getElementById(parentNodeId).id.split("_");
    document.getElementById("table_" + div[1]).remove();
}

function setDivFooter() {
    var footerDiv = document.createElement("div");
    footerDiv.setAttribute("id", "table_" + tableNum + "_footer");

    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'table_' + tableNum + "_addBtn");
    btn.addEventListener("click", addColumn)
    btn.setAttribute("value", "add");
    footerDiv.appendChild(btn);

    var tmpSpan = document.createElement('span')
    tmpSpan.setAttribute("class", "dropdown");

    btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "dropdown-toggle")
    btn.setAttribute("data-toggle", "dropdown")
    btn.setAttribute("aria-haspopup", "true")
    btn.setAttribute("aria-expanded", "false")
    btn.setAttribute("id", 'table_' + tableNum + "_refBtn");
    btn.addEventListener("click", drawRef)
    btn.setAttribute("value", "ref");
    tmpSpan.appendChild(btn);

    var tmpDiv = document.createElement("span");
    tmpDiv.setAttribute("class", "dropdown-menu")
    tmpDiv.setAttribute("aria-labelledby", 'table_' + tableNum + "_refBtn");

    var drop = document.createElement("div")
    drop.innerText = "hihihihi" + tableNum;
    tmpDiv.appendChild(drop)
    tmpSpan.appendChild(tmpDiv);

    footerDiv.appendChild(tmpSpan);

    btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'table_' + tableNum + "_genBtn");
    //btn.setAttribute("class", "btn btn-outline-info my-2 mx-1");
    btn.setAttribute("data-toggle", "modal")
    btn.setAttribute("data-target", "#table_" + tableNum + "_modal")
    btn.addEventListener("click", generateQuery)
    btn.setAttribute("value", "generate");
    footerDiv.appendChild(btn);

    footerDiv.appendChild(getHiddenModal("table_" + tableNum + "_modal"));

    return footerDiv
}

function getHiddenModal(modalId) {
    var div = document.createElement("div");
    div.setAttribute("class", "modal fade")
    div.setAttribute("id", modalId);
    div.setAttribute("tabindex", "-1")
    div.setAttribute("role", "dialog")
    div.setAttribute("aria-labelledby", "myModalLabel")

    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "modal-dialog modal-fullsize")
    innerDiv.setAttribute("role", "document")

    var innerContentDiv = document.createElement("div");
    innerContentDiv.setAttribute("class", "modal-content modal-fullsize")

    var modalHeaderDiv = document.createElement("div");
    modalHeaderDiv.setAttribute("class", "modal-header");

    var title = document.createElement("h4");
    title.setAttribute("id", modalId + "_title");
    title.setAttribute("class", "modal-title")
    title.innerText = "dummy title"
    modalHeaderDiv.appendChild(title);

    var modalBodyDiv = document.createElement("div");
    modalBodyDiv.setAttribute("class", "modal-body");

    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", modalId + "_textarea");
    textarea.setAttribute("rows", "20")
    textarea.addEventListener("click", copyToClipboard);
    modalBodyDiv.appendChild(textarea);

    var modalFooter = document.createElement("div");
    modalFooter.setAttribute("class", "modal-footer");

    var infoWord = document.createElement("h5");
    infoWord.setAttribute("class", "text-muted")
    infoWord.innerText = "click the text-area to paste! ";
    modalFooter.appendChild(infoWord)

    var closeBtn = document.createElement("input")
    closeBtn.setAttribute("type", "button")
    closeBtn.setAttribute("class", "modalExitBtn");
    closeBtn.setAttribute("data-dismiss", "modal")
    closeBtn.setAttribute("value", "close");
    modalFooter.appendChild(closeBtn)

    innerContentDiv.appendChild(modalHeaderDiv);
    innerContentDiv.appendChild(modalBodyDiv);
    innerContentDiv.appendChild(modalFooter);

    innerDiv.appendChild(innerContentDiv);
    div.appendChild(innerDiv);

    return div;
}

function copyToClipboard(e) {
    var copyText = e.target;
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    alert("Copied.. ");
}

function generateQuery(e) {
    var tableId = (e.target.parentNode).parentNode.id
    var tableName = getTableName(tableId)
    var tableColumn = getColumn(tableId)

    var modalTitle = document.getElementById(tableId + "_modal_title")
    modalTitle.innerText = tableName;

    var modalTextarea = document.getElementById(tableId + "_modal_textarea")
    var query = "CREATE TABLE " + tableName +"\n(\n"
    for (var i = 0; i < tableColumn.length; i++) {
        for (var key in tableColumn[i]) {
            if (key == "name") {
                query += "     `" + tableColumn[i][key] + "`     "
            } else {
                if (i == tableColumn.length - 1) {
                    query += tableColumn[i][key] + "\n"
                } else {
                    query += tableColumn[i][key] + ",\n"
                }
            }
        }
    }
    query += ");"
    modalTextarea.innerHTML = query;
}


function setDivHeader(loadIdx) {
    var headerDiv = document.createElement("div");
    headerDiv.setAttribute("id", "table_" + tableNum + "_header");

    var span = document.createElement("span");
    span.setAttribute("id", "table_" + tableNum + "_moveBtn");

    var icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-arrows-alt fa-2x");
    span.appendChild(icon);

    headerDiv.appendChild(span);

    var selectedOption = document.getElementById("erds").value
    var item = JSON.parse(localStorage.getItem("queryGen_" + selectedOption));

    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", "table_" + tableNum + "_tblName" + tableNum);
    tmpInput.setAttribute("class", "tableName no-drag");
    if (loadIdx >= 0) {
        tmpInput.setAttribute("value", item[loadIdx].tableName);
    }
    tmpInput.setAttribute("placeholder", " Table Name");
    headerDiv.appendChild(tmpInput);

    exitBtn = document.createElement("input");
    exitBtn.setAttribute("type", "button");
    exitBtn.setAttribute("id", 'table_' + tableNum + "_exitBtn");
    exitBtn.setAttribute("style", "float: right;");
    exitBtn.setAttribute("value", "close");
    exitBtn.setAttribute("onclick", "removeDiv('table_" + tableNum + "')")
    headerDiv.appendChild(exitBtn);
    headerDiv.appendChild(document.createElement("hr"));

    return headerDiv;
}

function isLoadData(loadIdx) {
    if (loadIdx >= 0) {
        return true;
    } else {
        return false;
    }
}

function setElementFromView(tmpDiv, i, e) {
    var tmpInput = document.createElement('input');
    var targetId = null;
    if (e == null) {
        targetId = tableNum;
    } else {
        targetId = (e.target.parentNode).parentNode.id;
    }
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id",
        ((typeof targetId == "number") ? "table_" + targetId : targetId) + "_colName_" + i);
    tmpInput.setAttribute("class", 'colName no-drag');
    tmpInput.setAttribute("placeholder", " Column Name_" + i);
    tmpDiv.appendChild(tmpInput);

    tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id",
        ((typeof targetId == "number") ? "table_" + targetId : targetId) + "_colAttribute_" + i);
    tmpInput.setAttribute("class", 'colAttribute no-drag');
    tmpInput.setAttribute("placeholder", " Column Attr_" + i);

    tmpDiv.appendChild(tmpInput);
}

function setElementFromLocal(tmpDiv, loadIdx, i) {
    var selectedOption = document.getElementById("erds").value;
    var item = JSON.parse(localStorage.getItem("queryGen_" + selectedOption));

    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", 'table_' + tableNum + "_colName_" + i);
    tmpInput.setAttribute("value", item[loadIdx].column[i].name);
    tmpInput.setAttribute("class", 'colAttribute no-drag');
    tmpInput.setAttribute("placeholder", " Column Attr_" + i);
    tmpDiv.appendChild(tmpInput);

    tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", 'table_' + tableNum + "_colAttribute_" + i);
    tmpInput.setAttribute("value", item[loadIdx].column[i].type);
    tmpInput.setAttribute("class", 'colAttribute no-drag');
    tmpInput.setAttribute("placeholder", " Column Attr_" + i);

    tmpDiv.appendChild(tmpInput);
}

function setDivBodyRow(loadIdx, i, e) {
    var tmpDiv = document.createElement("div");
    tmpDiv.setAttribute("name", "inputDiv");

    if (isLoadData(loadIdx)) {
        setElementFromLocal(tmpDiv, loadIdx, i)
    } else {
        setElementFromView(tmpDiv, i, e)
    }

    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'table_' + tableNum + "_delBtn_" + i);
    btn.addEventListener("click", deleteColumn)
    btn.setAttribute("value", "delete");
    tmpDiv.appendChild(btn);

    return tmpDiv;
}

function setDivBody(columnCount, loadIdx) {
    var bodyDiv = document.createElement("div");
    bodyDiv.setAttribute("id", "table_" + tableNum + "_body");

    for (var i = 0; i < columnCount; i++) {
        bodyDiv.appendChild(setDivBodyRow(loadIdx, i));
    }
    return bodyDiv
}

function drawRef(e) {
    console.log(e.target);
}

function addColumn(e) {
    var table = (e.target.parentNode).previousSibling;
    var tableId = table.id.substring(0, table.id.length - 5)
    table.appendChild(setDivBodyRow(-1, table.children.length, e))
    tableArr[tableId].columnCount = Number(tableArr[tableId].columnCount) + 1;

    if ((e.target.parentNode).parentNode.id.includes("table_")) {
        selectedTable = (e.target.parentNode).parentNode
    }
}

function clearDivs() {
    var divs = document.querySelectorAll("div[id^='table_'")
    for (var i = 0; i < divs.length; i++) {
        divs[i].remove()
    }
    tableNum = 0;
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
    var tableArr = {};
    for (var i = 0; i < item.length; i++) {
        var tmp = new Tables(item[i].pos, item[i].columnCount, i);
        tableArr[item[i].name] = {
            columnCount: item[i].columnCount,
            id: item[i].name,
            pos: item[i].pos
        }
    }
    return tableArr;
}

function loadData() {
    var selectedOption = document.getElementById("erds").value
    if (isChanged()) {
        if (confirm("저장되지 않은 사항이 존재합니다.\n저장하지 않고 이동하시겠습니까? ")) {
            clearDivs()
            if (selectedOption != "none") {
                tableArr = getFromLocal(selectedOption);
                document.getElementById("Current_Erd").value = selectedOption
            }
        } else {
            document.getElementById("erds").value = previousErd;
        }
    } else {
        clearDivs()
        if (selectedOption != "none") {
            tableArr = getFromLocal(selectedOption);
            document.getElementById("Current_Erd").value = selectedOption
        } else {
            document.getElementById("Current_Erd").value = ""
        }
    }

}

function makeListCurrentCanvas() {
    var list = []
    for (var key in tableArr) {
        list.push({
            name: key,
            columnCount: tableArr[key].columnCount,
            pos: tableArr[key].pos,
            tableName: getTableName(key),
            column: getColumn(key)
        });
    }
    return list;
}


function getTableName(tableId) {
    var tableName = document.querySelector("input[id*='" + tableId + "'][type=text][class*='tableName']");
    return tableName.value;
}

function getColumn(tableId) {
    var arr = []
    var colName = document.querySelectorAll("input[id^='" + tableId + "_colName_']");
    //var colAttribute = colName.nextElementSibling;
    //document.querySelectorAll("input[id*='" + tableId + "'][type=text][class*='colAttribute']");

    for (var i = 0; i < colName.length; i++) {
        arr.push(
            {
                name: colName[i].value,
                type: colName[i].nextElementSibling.value
            }
        )
    }
    return arr;
}

function saveLocal() {
    var currentErdName = document.getElementById("Current_Erd").value;
    if (currentErdName.replaceAll(" ", "") != "") {
        var list = makeListCurrentCanvas()
        localStorage.setItem("queryGen_" + currentErdName, JSON.stringify(list));
        console.log(JSON.parse(localStorage.getItem("queryGen_" + currentErdName)));
    } else {
        alert("please type Erd name !!")
    }
}
