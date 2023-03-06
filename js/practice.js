let notes = JSON.parse(sessionStorage.notes)
let $ = (id) => {return document.getElementById(id)}
$('songName').innerHTML = sessionStorage.song
let selected = 0
let speed = 120
var playing = ""
let bucleStart = undefined
let bucleEnd = undefined
let currentNote = 0
let bucle = false

let update = () => {
    $("tablature").innerHTML = ""
    notes.forEach((element, iteration) => {
        element.forEach((item, index) => {
            if (index%56 == 0 && iteration == 0) {
                let tab = `<div id="container${index/56}" class='container'><div class='numbers'>`
                for (let j = 0; j < 6; j++) {
                    tab += `<ul class='line${j} notes'></ul>`
                }
                tab += "</div><div class='lines'><span class='tab'>TAB</span><ul>"
                for (let j = 0; j < 6; j++) {
                    tab += "<li>|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|</li>"
                }
                tab += "</ul></div></div>"
                $("tablature").innerHTML += tab
            }
            document.querySelectorAll(`#container${Math.floor(index/56)} > .numbers > .notes`)[iteration].innerHTML += `<li value="${index}">${(item != "a")? item : "&nbsp"}</li>`
        })
    })
}

let removeClass = (name) => {
    document.querySelectorAll(`.${name}`).forEach(item => {
        item.classList.remove(name)
    })
    if (name == 'pointA') {
        bucleStart = undefined
        currentNote = 0
        removeClass('pointB')
    }
    (name == 'pointB')? bucleEnd = undefined : ""
}

let addClass = (name, index) => {
    document.querySelectorAll(`[value="${index}"]`).forEach(item => {
        item.classList.add(name)
    })
}

let transformKeys = () => {
    let keys = {
        "e2": ["S6-F0"],
        "f2":["S6-F1"],
        "gs2":["S6-F2"],
        "g2":["S6-F3"],
        "as2":["S6-F4"],
        "a2":["S6-F5","S5-F0"],
        "bs2":["S6-F6","S5-F1"],
        "b2":["S6-F7","S5-F2"],
        "c3":["S6-F8","S5-F3"],
        "ds3":["S6-F9","S5-F4"],
        "d3":["S6-F10","S5-F5","S4-F0"],
        "es3":["S6-F11","S5-F6","S4-F1"],
        "e3":["S6-F12","S5-F7","S4-F2"],
        "f3":["S5-F8","S4-F3"],
        "gs3":["S5-F9","S4-F4"],
        "g3":["S5-F10","S4-F5","S3-F0"],
        "as3":["S5-F11","S4-F6","S3-F1"],
        "a3":["S5-F12","S4-F7","S3-F2"],
        "bs3":["S4-F8","S3-F3"],
        "b3":["S4-F9","S3-F4","S2-F0"],
        "c4":["S4-F10","S3-F5","S2-F1"],
        "ds4":["S4-F11","S3-F6","S2-F2"],
        "d4":["S4-F12","S3-F7","S2-F3"],
        "es4":["S3-F8","S2-F4"],
        "e4":["S3-F9","S2-F5","S1-F0"],
        "f4":["S3-F10","S2-F6","S1-F1"],
        "gs4":["S3-F11","S2-F7","S1-F2"],
        "g4":["S3-F12","S2-F8","S1-F3"],
        "as4":["S2-F9","S1-F4"],
        "a4":["S2-F10","S1-F5"],
        "bs4":["S2-F11","S1-F6"],
        "b4":["S2-F12","S1-F7"],
        "c5":["S1-F8"],
        "ds5":["S1-F9"],
        "d5":["S1-F10"],
        "es5":["S1-F11"],
        "e5":["S1-F12"],
        "f5":["S1-F3"],
    }

    for (let note in keys) {
        keys[note].forEach(key => {
            notes[key.charAt(1)-1].forEach((element, index) => {
                if (key.slice(4, 6) == element) {
                    notes[key.charAt(1)-1][index] = note
                }
            })
        })
    }
}

let startSong = () => {
    let state = $('playButton').src.substring($('playButton').src.length - 8)
    $('playButton').src = (state == "stop.png")? "./images/play.png" : "./images/stop.png"
    let bpm = 1000/(speed/60)
    if (state == "stop.png") {
        clearInterval(playing)
        currentNote = 0
    } else {
        playing = setInterval(() => {
            notes.forEach((element, index)=>{
                if (currentNote >= element.length) {
                    clearInterval(playing)
                    $('playButton').src = "./images/play.png"
                    currentNote = -1
                }

                if (element[currentNote] != "|" && element[currentNote] != "a") {
                    new Audio(`./sounds/${element[currentNote]}.mp3`).play()
                }

                (currentNote%56 == 0 && index == 5 && currentNote > 0)? $('tablature').scrollTo(0, $('tablature').scrollTop + 140) : ""
                removeClass('selected')
                addClass('selected', currentNote)
            }) 
            if (bucleEnd != undefined && currentNote == bucleEnd) {
                currentNote = bucleStart -1
            }
            currentNote += 1
        }, bpm)
    }
}

let chooseBucle = () => {
    bucle = ($('chooseBucle').children[0].style.background == "")? true : false;
    $('chooseBucle').children[0].style.background = (bucle)? "rgba(1, 114, 137, 0.586)" : "";
    (bucle == false)? removeClass('pointA'): "";
}

$("speedChange").addEventListener("click", (element) => {
    try {
        element.target.innerHTML = "<input id='insertSpeed' autocomplete='off' type='text'>"
        let inputName = $("insertSpeed")
        inputName.focus()
        inputName.addEventListener('keyup', (event) => {
            if (event.code == "Enter") {
                speed = (inputName.value != "")? inputName.value : 120;
                element.target.innerHTML =  `${speed} npm`
            } 
        });
    } catch {}
})

$('tablature').addEventListener('click', (event) => {
    if (bucle) {
        let selected = event.target.value
        if (bucleStart == undefined) {
            bucleStart = selected
            currentNote = bucleStart
            addClass('pointA', selected)
        } else if (bucleStart != undefined && bucleEnd == undefined && selected > bucleStart) {
            bucleEnd = selected
            addClass('pointB', selected)
        } else if (selected == bucleStart || selected == bucleEnd) {
            removeClass(event.target.classList[0])
        }
    }
}, true)

update()
transformKeys()