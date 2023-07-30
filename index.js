var wordList=[]  // list of lists [EN,IT,mark]
var nextWord=[]  // list of word index
var saveOnZero=0

function sendCorrection(info) {
    console.log(info)
}

function getLearnt() {
    return wordList.filter(function(item){
        return item[2]>2;
    }).length;

}
function getWordAtPos(x) {
    let wordN=nextWord[x]
    let w=wordList[wordN]
    var word={}
    word['en']=w[0]
    word['it']=w[1]
    word['mark']=w[2]
    word['num']=wordN
    return word
}

function getWordAndPop(data) {   // info is a dict with direction and wordN
    let nToPop=0
    let wordN=data['wordN']
    let direction=data['direction']
    let mark=wordList[wordN][2]
    if (direction=='right') { mark+=1
    } else mark=0

    wordList[wordN][2]=mark
    let nextAppear=Math.round(10*Math.pow(1.6,mark))
    nextAppear+=Math.floor(Math.random() * nextAppear);

    if (nextAppear<nextWord.length) {
        nextWord.splice(nextAppear,0,wordN)
    } else {
        nextWord.push(wordN) //add in the end of the list
    }
    if (nextWord[0]!=wordN) console.log('error- not matching words')

    // sending word # 10 and poping out the zero
    wordN=nextWord[10]
    w=wordList[wordN]
    word={}
    word['en']=w[0]
    word['it']=w[1]
    word['mark']=w[2]
    word['num']=wordN

    nextWord.shift()   // might be not zero if the words got in it mixed order


    if (saveOnZero==0) {
        saveStorage()
        saveOnZero=3
    }
    saveOnZero-=1

    return word
}

function loadStorage() {
    let backup=false
    if(typeof(localStorage.getItem("nextword"))=='undefined'){
        backup=true
        console.log('no nextWord in storage')
    };
    if(typeof(localStorage.getItem("wordlist"))=='undefined'){
        backup=true
        console.log('no wordList in storage')
    };
    if (backup) return loadJSON();

    wordList=JSON.parse(localStorage.getItem('wordlist'));
    nextWord=JSON.parse(localStorage.getItem('nextword'));
}

function saveStorage() {
    localStorage.setItem('wordlist', JSON.stringify(wordList));
    localStorage.setItem('nextword', JSON.stringify(nextWord));
}

function loadJSON() {
   nextWord=nextWordBackup
   wordList=wordListBackup
}

function reset() {
    loadJSON()
    saveStorage()
}

function fix() {
    for(var i=0;i<wordList.length;i++) {
        wordList[i][0]=wordListBackup[i][0]
    }
    saveStorage()
}