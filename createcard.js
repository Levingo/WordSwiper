var ii=0;

function linkDictDE() {
    let txt=that.getWordWithoutArticle()
    s="https://it-de.dict.cc/?s="+txt.split(" ").join("+")
    window.open(s, "_blank1");
}

function linkDictEN() {
    let txt=that.getWordWithoutArticle()
    s="https://it-en.dict.cc/?s="+txt.split(" ").join("+")
    window.open(s, "_blank2");
}

function callToNextCard(info) {
    if (ii<10) {
        ii+=1
        return getWordAtPos(ii-1)
    }
    else {
        return getWordAndPop(info)
    }
}

function createCard(data) {

    let ll=document.getElementById('learnt')
    ll.innerHTML=getLearnt()
    // create card

    let card = document.createElement('div')

    card.setAttribute("id", data['num'].toString()+":"+data['it']);
    card.classList.add('card')

    //console.log(data['num'].toString()+":"+data['it'])
    //card.style.backgroundImage ="url('https://picsum.photos/320/320/?random=" + Math.round(Math.random() * 1000000) + "')"

    let ital = document.createElement("div");
    let numdiv= document.createElement("div");
    numdiv.append(data['num'])
    numdiv.classList.add('numdiv')
    ital.appendChild(numdiv)

    ital.classList.add('ital')
    ital.classList.add('label')
    let ital2 = document.createElement("div");
    ital2.classList.add('vertical-center')
    ital2.append(data['it'])
    ital.appendChild(ital2)

    let eng = document.createElement("div");
    eng.classList.add('eng')
    eng.classList.add('label')
    let eng2 = document.createElement("div");

    eng2.append(data['en'])
    eng2.classList.add('vertical-center2')


    // EDIT *********************************************
    let editGroup= document.createElement("div");
    editGroup.classList.add('input-group')
    editGroup.classList.add('mb-3')
    //editGroup.classList.add('vertical-center2')

    //editGroup.classList.add('vertical-center2')
    let engEdit = document.createElement("input");
    engEdit.classList.add('form-control') // textbox

    engEdit.placeholder=data['en']
    editGroup.appendChild(engEdit)

    let divappend=document.createElement("div");
    divappend.classList.add('input-group-append')
    let b1=document.createElement("button")

    b1.classList.add('btn')
    b1.classList.add('btn-light')
    b1.append('Save');
    b1.onclick=save

    divappend.appendChild(b1)


    editGroup.appendChild(divappend)

    eng.appendChild(eng2)
    eng.appendChild(editGroup)
    eng.style.display = "none";
    editGroup.style.display = "none";

    card.appendChild(ital)
    card.appendChild(eng)

    function save() {
        that.saveWord(engEdit.value)
    }
    function show() {
        eng.style.display = "";
        eng2.style.display = ""

    }

    function show2() {
        eng.style.display = "";
        editGroup.style.display = "none";
        eng2.style.display = ""

    }

    function edit() {
        editGroup.style.display = "";
        engEdit.focus()
    }

    function playagain() {
        that.play()
    }

    card.onclick=show;
    eng2.ondblclick =edit;
    ital.onclick=show2;
    ital2.onclick=playagain;
    return card;
}