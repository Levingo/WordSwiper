var that = 0
var audioList=[] // each item is dictionary. status + aud

function playCurrent() {
    if (audioList[0].status=="played") audioList[0].aud.load()
    audioList[0].aud.play()
    audioList[0].status="played"
}

//function replayCurrent() {
//    audioList[0].aud.load()
//    audioList[0].aud.play()
//}

function removeCurrentAudio() {
    audioList.shift()
}

function addToAudio(cardId) {
    let txt = cardId.split(":")[1]
    let audiosrc = "mp3files/" + ((txt).split(" ").join("_")) + ".mp3";
    audioList.push({aud: new Audio(audiosrc), status: "new"});
    //audio.play().then(() => {audio.pause()})
}

function playNpause(aud) {
    aud.play().then(() => {aud.pause()})
}
function pauseAll() {
    for(var i=0;i<audioList.length;i++) {
        if (audioList[i].status=="new")
            playNpause(audioList[i].aud)
            audioList[i].status=="paused"
    }
}

class Carousel {
    constructor(element) {
        this.board = element
        // add first two cards programmatically
        this.push10()
        // handle gestures
        this.handle()
    }
    push10() {
        that = this

        function s() {
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.pushBegin();
            that.handle()
        }



        setTimeout(s, 1000);

    }



    play() {
        //let txt = this.topCard.id.split(":")[1]
        //let audiosrc = "mp3files/" + ((txt).split(" ").join("_")) + ".mp3";
        //let audio = new Audio(audiosrc);

        //audio.play();
        playCurrent()
    }

    getWordWithoutArticle() {
        let txt = this.topCard.id.split(":")[1]
        if (txt.startsWith('il ')) {
            txt = txt.substring(3)
        }
        else if (txt.startsWith('la ')) {
            txt = txt.substring(3)
        }
        else if (txt.startsWith("l'")) {
            txt = txt.substring(2)
        }
        return txt
    }
    handle() {
        //var audio = new Audio("static/mp3files/abbiamo_detto.mp3");
        //audio.play();
        // list all cards
        this.cards = this.board.querySelectorAll('.card')
        // get top card
        this.topCard = this.cards[this.cards.length - 1]
        // get next card
        this.nextCard = this.cards[this.cards.length - 2]
        // if at least one card is present
        if (this.cards.length > 0) {
            this.play()
            // set default top card position and scale
            this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
            // destroy previous Hammer instance, if present
            if (this.hammer) this.hammer.destroy()
            // listen for tap and pan gestures on top card
            this.hammer = new Hammer(this.topCard)
            this.hammer.add(new Hammer.Tap())
            this.hammer.add(new Hammer.Pan({
                position: Hammer.position_ALL,
                threshold: 0
            }))
            // pass events data to custom callbacks
            this.hammer.on('tap', (e) => {
                this.onTap(e)
            })
            this.hammer.on('pan', (e) => {
                this.onPan(e)
            })
        }
    }
    onTap(e) {
        // get finger position on top card
        let propX = (e.center.x - e.target.getBoundingClientRect().left) / e.target.clientWidth
        // get rotation degrees around Y axis (+/- 15) based on finger position
        let rotateY = 15 * (propX < 0.05 ? -1 : 1)
        // enable transform transition
        this.topCard.style.transition = 'transform 100ms ease-out'
        // apply rotation around Y axis
        this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(' + rotateY + 'deg) scale(1)'
        // wait for transition end
        setTimeout(() => {
            // reset transform properties
            this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
        }, 100)
    }
    onPan(e) {
        if (!this.isPanning) {
            this.isPanning = true
            // remove transition properties
            this.topCard.style.transition = null
            if (this.nextCard) this.nextCard.style.transition = null
            // get top card coordinates in pixels
            let style = window.getComputedStyle(this.topCard)
            let mx = style.transform.match(/^matrix\((.+)\)$/)
            this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0
            this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0
            // get top card bounds
            let bounds = this.topCard.getBoundingClientRect()
            // get finger position on top card, top (1) or bottom (-1)
            this.isDraggingFrom = (e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1
        }
        // get new coordinates
        let posX = e.deltaX + this.startPosX
        let posY = e.deltaY + this.startPosY
        // get ratio between swiped pixels and the axes
        let propX = e.deltaX / this.board.clientWidth
        let propY = e.deltaY / this.board.clientHeight
        // get swipe direction, left (-1) or right (1)
        let dirX = e.deltaX < 0 ? -1 : 1
        // get degrees of rotation, between 0 and +/- 45
        let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45
        // get scale ratio, between .95 and 1
        let scale = (95 + (5 * Math.abs(propX))) / 100
        // move and rotate top card
        this.topCard.style.transform = 'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) rotateY(0deg) scale(1)'
        // scale up next card
        if (this.nextCard) this.nextCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(' + scale + ')'
        if (e.isFinal) {
            this.isPanning = false
            let successful = false
            // set back transition properties
            this.topCard.style.transition = 'transform 200ms ease-out'
            if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'
            // check threshold and movement direction
            if (propX > 0.2 && e.direction == Hammer.DIRECTION_RIGHT) {
                successful = true
                // get right border position
                posX = this.board.clientWidth
            }
            else if (propX < -0.2 && e.direction == Hammer.DIRECTION_LEFT) {
                successful = true
                // get left border position
                posX = -(this.board.clientWidth + this.topCard.clientWidth)
            } //else if (propY < -0.2 && e.direction == Hammer.DIRECTION_UP) {
            //  successful = true
            // get top border position
            //  posY = -(this.board.clientHeight + this.topCard.clientHeight)
            //}
            if (successful) {
                //alert(this.topCard.id)
                // throw card in the chosen direction
                this.topCard.style.transform = 'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'
                var info = {}
                info.wordN = parseInt(this.topCard.id.split(":")[0]);
                if (e.direction == Hammer.DIRECTION_LEFT) {
                    info.direction = 'left'
                }
                else if (e.direction == Hammer.DIRECTION_RIGHT) {
                    info.direction = 'right'
                }
                // wait transition end
                setTimeout(() => {
                    // remove swiped card
                    this.board.removeChild(this.topCard)
                    removeCurrentAudio()
                    // add new card
                    this.push(info)
                    // handle gestures on new top card
                    //this.handle()
                }, 200)
            }
            else {
                // reset cards position and size
                this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
                if (this.nextCard) this.nextCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(0.95)'
            }
        }
    }
    realPush(data) {

    }
    push(info) {
        that = this
        let card = createCard(callToNextCard(info));
        console.log(card.id)
        addToAudio(card.id)
        that.board.insertBefore(card, that.board.firstChild)
        that.handle()
    }

    realPushBegin(data) {

    }

    pushBegin() {
        that = this
        let card = createCard(callToNextCard({}));
        console.log(card.id)
        addToAudio(card.id)
        that.board.insertBefore(card, that.board.firstChild)
    }

    saveWord(newword) {
        var info = {}
        info.wordN = parseInt(this.topCard.id.split(":")[0]);
        info.newEn = newword
        sendCorrection(info)
    }
}