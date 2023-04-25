//cacher l'input avec autofocus
document.getElementById("mytext").focus();
document.addEventListener('click', () => {
    document.getElementById("mytext").focus();
})

// Globals
let nbrGuesses = 6;
let nextLetter = 0;
let rightGuessString = '';
const board = document.querySelector('#game-board');
const date = new Date()

//generare rules board
document.querySelector('#gameId').textContent = ''
document.querySelector('#newGame').style.display = "none"
board.innerHTML = `
<div class="rules-box">
    <p>Bonjour, je suis un jeu 👋</p>
    <p>Je vous propose chaque jour un mot à deviner que je pioche au hasard dans le dictionnaire. En appuyant sur Entrée, vérifiez si vos lettres sont bonnes, à replacer ou mauvaises.</p>
    <p> </p>
    <div class="letter-row">
        <div class="letter-box won">A</div >
        <div class="letter-box near">B</div >
        <div class="letter-box loose">C</div >
    </div>
    <p> </p>
    <p>Attention, un Ê n'est pas un É ou un Ë et encore moins un E! Bref, vous l’aurez compris chaque caractère compte...</p>
    <p>Bonne partie et à demain j’espère!</p>
    <p> </p>
    <button id="launchGame">Lancer la partie</button>
</div>`

document.querySelector('#launchGame').addEventListener('click', function () { game() })


function game(){
//document.removeEventListener('keydown',{ capture: false })

board.innerHTML = ''

//un mot par jour
document.querySelector('#gameId').textContent = moment(date).format('DD/MM/YYYY')
let seed = moment(date).format('DDMMYYYY')
let x = Math.sin(seed++) * 10000;
let randomindex = Math.floor( ( x - Math.floor(x) ) * dico.length );
rightGuessString = dico[randomindex];
//console.log(rightGuessString)



document.querySelector('#newGame').textContent = 'Nouvelle chance ?'
document.querySelector('#newGame').style.display = "block"


//generate game board
for (let i = 0; i < nbrGuesses; i++) {
    board.innerHTML += `<div class="letter-row"></div>`;
    for (let j = 0; j < rightGuessString.length; j++) {
        document.querySelectorAll('.letter-row')[i].innerHTML += `<div class="letter-box"></div >`;
    }
}


/// nouvelle chance
document.querySelector('#newGame').addEventListener('click', function(){
    board.innerHTML = ''
    for (let i = 0; i < nbrGuesses; i++) {
        board.innerHTML += `<div class="letter-row"></div>`;
        for (let j = 0; j < rightGuessString.length; j++) {
            document.querySelectorAll('.letter-row')[i].innerHTML += `<div class="letter-box"></div >`;
        }
    }
})

///GAME
let string = '';
let eventKey = '';
document.getElementById("mytext").addEventListener('keyup', function (event) {
    if(this.value.length <= rightGuessString.length){
        string = this.value.toLowerCase()
        eventKey = event.key

        /// rentrer les lettres
        let places = document.querySelectorAll('.letter-box:not(.filled-box)')
        for (let i=0; i<rightGuessString.length ;i++){
            places[i].textContent = string[i]
        }

        if(eventKey === 'Enter'){
            if(string.length === rightGuessString.length){
                for (let i=0; i<rightGuessString.length ;i++){
                    places[i].className = "letter-box filled-box"
                }
                this.value = '';
                let previous = document.querySelectorAll(".filled-box:not(.tested)")
                if(dico.some(e => e === string)){
                    ///mot existant
                    if(string === rightGuessString){
                        ///mot gagnant
                        for(let i=0; i< previous.length; i++){
                            previous[i].className += " won"
                        }

                        document.querySelector('#title').textContent = `motus`
                        setTimeout(() => {
                            document.querySelector('#title').textContent = `et`
                        }, 2000);
                        setTimeout(() => {
                            document.querySelector('#title').textContent = `bouche cousue`
                        }, 3000);

                        const sleep = (time) => {
                            return new Promise((resolve) => setTimeout(resolve, time))
                        }
                        const animation = async () => {
                            for (let i = 0; i < rightGuessString.length; i++) {
                                await sleep(200)
                                setTimeout(() => {
                                    previous[i].className = "letter-box filled-box tested near"
                                }, 200);
                                setTimeout(() => {
                                    previous[i].className = "letter-box filled-box tested won"
                                }, 400);
                                setTimeout(() => {
                                    previous[i].className = "letter-box filled-box tested near"
                                }, 600);
                                setTimeout(() => {
                                    previous[i].className = "letter-box filled-box tested won"
                                }, 800);
                                setTimeout(() => {
                                    previous[i].className = "letter-box filled-box tested near"
                                }, 1000);
                                setTimeout(() => {
                                    previous[i].className = "letter-box filled-box tested won"
                                }, 1200);
                            }
                        }
                        animation()
        
                        let audio = new Audio("sound/win.mp3");
                        audio.play();

                    /// test des lettres
                    }else{
                        let testString =rightGuessString;
                        for (let i=0; i<string.length; i++){
                            //bonnes lettres
                            if(string[i] === rightGuessString[i]){
                                previous[i].className += " tested won"
                                //combien de i dans testletter?
                                let j = testString.indexOf(string[i])
                                testString = testString.substring(0,j) + testString.substring(j+1,testString.length)
                            //lettres inclues
                            }else if(testString.includes(string[i])){
                                previous[i].className += " tested near"
                                let j = testString.indexOf(string[i])
                                testString = testString.substring(0,j) + testString.substring(j+1,testString.length)
                            //lettres fausses
                            }else{
                                previous[i].className += " tested loose"
                            }
                        }
                    }
                }else{
                    /// mot inexistant
                    for(let i=0; i< previous.length; i++){
                        previous[i].className += " tested invalid"
                    }
                    document.querySelector('#title').textContent = `c'est quoi ce mot?`
                    setTimeout(() => {
                        document.querySelector('#title').textContent = 'bouche cousue'
                    }, 2000);
                }

            /// pas assez de lettres pour tester
            }else{
                document.querySelector('#title').textContent = `on a dit ${rightGuessString.length} lettres!`
                setTimeout(() => {
                    document.querySelector('#title').textContent = 'bouche cousue'
                }, 2000);
            }
        }
    
    /// empêcher la saise de plus de lettres que le mot du jour
    }else{
        this.value = this.value.slice( 0, rightGuessString.length )
        string = this.value
    }
    //game over
    if(document.querySelectorAll('.tested').length === rightGuessString.length*nbrGuesses){
        document.querySelector('#title').textContent = "c’est perdu"

        let gameOver = document.querySelectorAll('.tested')
        const sleep = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time))
        }
        const animation = async () => {
            for (let i = 0; i < gameOver.length; i++) {
                await sleep(30)
                if(i % 2 === 0) {
                    gameOver[i].className = 'letter-box filled-box tested gameover'
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 100);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 200);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 300);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 400);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 500);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 600);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 700);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 800);
                }else{
                    gameOver[i].className = 'letter-box filled-box tested loose'
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 100);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 200);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 300);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 400);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 500);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested loose'
                    }, 600);
                    setTimeout(() => {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                    }, 700);
                }   
            }
        }
        animation()

        let audio = new Audio("sound/loose.mp3");
        audio.play();
    }
});
}

// TO-DO
// scoring