// initial variables and open saved data in case the page is reloaded
let notes = (sessionStorage.notes != undefined)? JSON.parse(sessionStorage.notes) : [[], [], [], [], [], []];
let updateFrets = undefined
let $ = (id) => {return document.getElementById(id)}
let $$ = (selector) => {return document.querySelectorAll(selector)}
$('songName').innerHTML = (sessionStorage.song != undefined)? sessionStorage.song : "Song's name"

// draw makes the items display on the "tablature Node" and var(position) is the string and the fret where the item will be displayed
let draw = (position) => {
    let lastContainer = `container${Math.floor(notes[5].length/56)}`

    // if var(updateFrets) is undefined, the item will be displayed in the tablature's last position
    if (updateFrets == undefined) {
        notes.forEach((element, index) => {

            // var(position) gets a value like S3-f10 where the second caracter is the string and the last 2 caracters are the fret
            element.push((position != "a" && position != "|"  && index == position.charAt(1)-1)? position.slice(4, 6) : (position == "|")? "|":"a");
            let value = element[element.length-1];

            // var("lastContainer") is the current amount of tabs if it is undefined, it will call update() to create one 
            ($(lastContainer) != undefined)? $$(`#${lastContainer} > .numbers > .notes`)[index].innerHTML += `<li value="${element.length-1}">${(value != "a")? value : "&nbsp"}</li>` : update();
            addClickEvent(false)
        });
    } else {

        // the condition will enter the else if there is an element selected to update
        notes.forEach((element, index) => {
            if (notes[5][updateFrets] == "|" && position != "|") {

                // if the column has a '|' but the var(position) is for example a 'S3-f10' all elements equal to "|" will be replaced by spaces exept the fret 10 in the third string 
                element[updateFrets] = (index == position.charAt(1)-1)? position.slice(4, 6) : "a"

            } else if (index == position.charAt(1)-1) {
                // this will add a new number to the selected column, in case there's a number already on the string it'll be replaced
                element[updateFrets] = position.slice(4, 6)

            } else if (position == "|") {
                // this will create a fret on the selected column
                element[updateFrets] = "|"

            } else if(position == String.fromCharCode(160)) {
                // this will create a space after the selected column
                element.splice(updateFrets + 1, 0, "a")
            }
        })
        updateFrets = undefined
        update()
    }
}

let addClickEvent = (updating) => {
    let lastContainer = `#container${Math.floor(notes[5].length/56)}`

    // add .addEventListener('click') to all the elements inside lastContainer in case it exists
    $$(`${(updating == false)? lastContainer : ''} .notes > li`).forEach(element => {
        element.addEventListener('click', (event)=>{

            //this will remove the hightlight color to make sure only one column it hightlighted at the same time
            $$('.selected').forEach(item => {
                item.classList.remove('selected')
            })

            //this will add the highlight color to the clicked column on the tablature node
            $$(`[value="${event.target.value}"]`).forEach(item => {
                item.classList.add('selected')
            })

            updateFrets = event.target.value // update frets will be equal to the index on the selected column
        })
    })
}

// cleanTab() will erase all the notes and replace the name of the song to default to start over
let cleanTab = () => {
    notes = [[], [], [], [], [], []]
    $('songName').innerHTML = "Song's name"
    update()
}

// addFret will add a new tab to the tablature Node
let addFret = () => {
   tab = "<div class='lines'><span class='tab'>TAB</span><ul>"
   for (let j = 0; j < 6; j++) {
       tab += "<li>|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|</li>"
    }
    $(`container${$$(".container").length-1}`).innerHTML += `${tab}</ul></div></div>`
}

// update will update the last tab or add a new one in case the max amount of numbers per tab is reached
let update = () => {
    $("tablature").innerHTML = ""
    notes.forEach((element, iteration) => {
        element.forEach((item, index) => {
            if (index%56 == 0 && iteration == 0) {
                let tab = `<div id="container${index/56}" class='container'><div class='numbers'>`
                for (let j = 0; j < 6; j++) {
                    tab += `<ul class='line${j} notes'></ul>`
                }
                tab += "</div>"
                $("tablature").innerHTML += tab
                addFret()
            }
            $$(`#container${Math.floor(index/56)} > .numbers > .notes`)[iteration].innerHTML += `<li value="${index}">${(item != "a")? item : "&nbsp"}</li>`
        })
    })
    addClickEvent(true)
}

// this will delete the selected column, if there is no column selected, it'll delete the las column on tab
let deleteColumn = () => {
    notes.forEach(item => { (updateFrets != undefined)? item.splice(updateFrets, 1) : item.pop()})
    updateFrets = undefined
    update()
}

// open a .txt file and update the current notes with the ones in the file
let openFile = (file) => {
    $("songName").innerHTML = file.files[0].name.split('.txt')[0]
    var fr=new FileReader();
    fr.onload = ()=>{
        notes = JSON.parse(fr.result)
        update()
    }
    fr.readAsText(file.files[0])
}

// this will download a .txt file so the person can save the progress and continue editing the same song later
let downloadSong = () => {
    fileContent = JSON.stringify(notes)
    let link = $("downloadLink")
    link.setAttribute('download', `${$("songName").innerHTML}.txt`)
    link.setAttribute('href', 'data:text;charset=UTF-8,' + fileContent);
    link.click();
}

// this will update the session storage and redirect to /practice.html to listen the song's changes until now
let practice = () => {
    sessionStorage.notes = JSON.stringify(notes)
    sessionStorage.song = $('songName').innerHTML
    location.href = "practice.html"
}

// this will change the instrument between piano and guitar
let changeInstrument = () => {
    let state = $('instrument').src.substring($('instrument').src.length - 9)
    $('positions').innerHTML = ""
    $('instrument').src = (state == "piano.png")? "./images/guitar.png" : "./images/piano.png";
    (state == "piano.png")? $('set').style.display = "block" : $('guitar').style.display = "block";
    (state == "piano.png")? $('guitar').style.display = "none" : $('set').style.display = "none";
}

// this will add the buttons at the top of the piano after a key is clicked each button will call the draw() function
$("set").querySelectorAll("li").forEach(element => {
    element.addEventListener("click", () => {
        let buttons = `<span>${element.id.toUpperCase()}</span>`
        element.style.animation = "lightKey 4s"
        element.firstChild.classList.forEach(item => {
            buttons += `<button type='button' class='blue' onclick="draw('${item}')">${item}</button>`
        })
        $('positions').innerHTML = buttons
        new Audio(`./sounds/${element.id}.mp3`).play()
    })
})

// this will make that the element with the 'songName' id is replaced by and input to change the name
$("songName").addEventListener("click", (element) => {
    try {
        element.target.innerHTML = "<input id='insertName' autocomplete='off' type='text'><a id='saveName' type='button' class='blue'>Save</a>"
        let inputName = $("insertName")
        inputName.focus()
        inputName.addEventListener('keyup', (event) => {

            // in case the Enter key is pressed the song name will be replaced with the input content
            (event.code == "Enter")? element.target.innerHTML = (inputName.value != "")? inputName.value : "Song's name" : ""
        });
        $("saveName").addEventListener("click", () => {

            // the element with the "saveName" id will also save the changes, to make it more intuituve 
            element.target.innerHTML = (inputName.value != "")? inputName.value : "Song's name"
        })
    } catch {}
})

// this is for the guitar to get the corrent fret where the string was pressed and add the click event to each string
document.querySelectorAll("#strings > li").forEach((line, index) => {
    line.addEventListener('click', (event) => {
        let cString = `S${index + 1}-F${Math.floor(event.pageX / 112 - 3.06)}`
        let note = document.getElementsByClassName(cString)[0].parentElement.id
        draw(cString)

        //this will play the equivalent piano sound to the string and fret played
        new Audio(`./sounds/${note}.mp3`).play()
    })
}, true)

update()