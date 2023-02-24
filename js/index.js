let notes = [[], [], [], [], [], []]; 
let updateFrets = undefined
var $ = (id) => {return document.getElementById(id)}

function draw(position) {
    if (updateFrets == undefined) {
        notes.forEach((element, index) => {
            element.push((position != "&nbsp;" && position != "|"  && index == position.charAt(1)-1)? position.slice(4, 6) : (position == "|")? "|":"&nbsp")
        });
    } else {
        notes.forEach((element, index) => {
            if (notes[5][updateFrets] == "|" && position != "|") {
                element[updateFrets] = (index == position.charAt(1)-1)? position.slice(4, 6) : "&nbsp"
            } else if (index == position.charAt(1)-1) {
                element[updateFrets] = position.slice(4, 6)
            } else if (position == "|") {
                element[updateFrets] = "|"
            } else if (position == String.fromCharCode(160)) {
                element[updateFrets] = "&nbsp;"
            }
        })
        $("delete").style.visibility = "hidden"
        updateFrets = undefined
    }
    update()
}

function update() {
    notes.forEach((line, index) => {
        let text = ""
        line.forEach((element, index) => {
            text += `<li value='${index}'>${element}</li>`
        })
        $(`line${index}`).innerHTML = text
    });
    let lineLenght = notes[0].length
    for (let i = 0; i < (lineLenght/56); i++) {
        if (document.querySelectorAll(".container").length < lineLenght/56) {
            let tab = "<div class='container'><span class='tab'>TAB</span><ul>"
            for (let j = 0; j < 6; j++) {
                tab += "<li>|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|</li>"
            }
            tab += "</ul></div>"
            $("tablature").innerHTML += tab
        }
    }
    $("line2").addEventListener('click', (event) => {
        element = document.getElementsByClassName('selected')[0]
        (element != undefined)? element.classList.remove('selected'):""
        event.target.classList.add("selected")
        $("delete").style.visibility = "visible"
        updateFrets = event.target.value
    })
}

function deleteColumn() {
    notes.forEach(item => {
        item.splice(updateFrets, 1)
    })
    $("delete").style.visibility = "hidden"
    updateFrets = undefined
    update()
}

$("set").querySelectorAll("li").forEach(element => {
    element.addEventListener("click", () => {
        let buttons = ""
        element.firstChild.classList.forEach(item => {
            buttons += `<button type='button' class='blue' onclick="draw('${item}')">${item}</button>`
        })
        $('positions').innerHTML = buttons
        Audio(`./sounds/${element.id}.mp3`).play()
    })
})

$("songName").addEventListener("click", (element) => {
    try {
        element.target.innerHTML = "<input id='insertName' autocomplete='off' type='text'><a id='saveName' type='button' class='blue'>Save</a>"
        let inputName = $("insertName")
        inputName.focus()
        inputName.addEventListener('keyup', (event) => {
            (event.code == "Enter")? element.target.innerHTML = (inputName.value != "")? inputName.value : "Song's name" : ""
        });
        $("saveName").addEventListener("click", () => {
            element.target.innerHTML = (inputName.value != "")? inputName.value : "Song's name"
        })
    } catch {}
})

update()