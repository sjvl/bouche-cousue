// globals
let nbrGuesses = 6;
let nextLetter = 0;
let rightGuessString = '';
const board = document.querySelector('#game-board');
const date = new Date()


///\\\ THE RULES ///\\\
document.querySelector('#newGame').style.display = "none"
board.innerHTML = `
<div class="rules-box">
    <p>Bonjour, je suis un jeu 👋</p>
    <p>Je vous propose chaque jour un mot à deviner que je pioche au hasard dans le dictionnaire. En appuyant sur Entrée, vérifiez si vos lettres sont bonnes, à replacer ou mauvaises.</p>
    <p> </p>
    <div class="letter-row">
        <div class="letter-box good">A</div >
        <div class="letter-box related">B</div >
        <div class="letter-box absent">C</div >
    </div>
    <p> </p>
    <p>Attention, un Ê n'est pas un É ou un Ë et encore moins un E! Bref, vous l’aurez compris chaque caractère compte...</p>
    <p>Bonne partie et à demain j’espère!</p>
    <p> </p>
    <button id="launchGame">Lancer la partie</button>
</div>`
function closeRules(event) {
    if(event.key === 'Enter' || event.key === 'Escape' ) {
        document.removeEventListener('keyup', closeRules);
        game()
    }
}
document.addEventListener('keyup', closeRules);
document.querySelector('#launchGame').addEventListener('click', function () { game() })


///\\\ THE GAME ///\\\
function game(){

    // trick or truc
    document.querySelector('#trick').innerHTML = '<input id="mytext" spellcheck="false" type="text">'
    document.getElementById("mytext").focus();
    document.addEventListener('click', () => {
        document.getElementById("mytext").focus();
    })

    // init
    board.innerHTML = ''
    document.querySelector('#newGame').style.display = "block"
    document.querySelector('#gameId').textContent = moment(date).format('DD/MM/YYYY')

    // random word
    let seed = moment(date).format('DDMMYYYY')
    let x = Math.sin(seed++) * 10000;
    let randomindex = Math.floor( ( x - Math.floor(x) ) * dico.length );
    rightGuessString = dico[randomindex];

    // generate game board
    for (let i = 0; i < nbrGuesses; i++) {
        board.innerHTML += `<div class="letter-row"></div>`;
        for (let j = 0; j < rightGuessString.length; j++) {
            document.querySelectorAll('.letter-row')[i].innerHTML += `<div class="letter-box"></div >`;
        }
    }

    // retry
    document.querySelector('#newGame').addEventListener('click', function(){
        if(document.getElementById("mytext")) document.getElementById("mytext").remove()
        game()
    })

    /// GAME LOGIC <<<
    let string = '';
    let eventKey = '';
    document.getElementById("mytext").addEventListener('keyup', function (event) {

        // prevent more letters than the right guess
        if(this.value.length > rightGuessString.length){
            this.value = this.value.slice( 0, rightGuessString.length )
            string = this.value
        }else{
            string = this.value.toLowerCase()
            eventKey = event.key

            // display lettrers
            let display = document.querySelectorAll('.letter-box:not(.filled-box)')
            for (let i=0; i<rightGuessString.length ;i++){
                display[i].textContent = string[i]
            }

            // test a word
            if(eventKey === 'Enter'){

                //incomplete word
                if(string.length < rightGuessString.length){
                    document.querySelector('#title').textContent = `on a dit ${rightGuessString.length} lettres!`
                    setTimeout(() => {
                        document.querySelector('#title').textContent = 'bouche cousue'
                    }, 2000);

                // complete word
                }else{
                    this.value = ''; // re-init the trick
                    for (let i=0; i<rightGuessString.length ;i++){
                        display[i].className = "letter-box filled-box"
                    }

                    // invalid word
                    let previous = document.querySelectorAll(".filled-box:not(.tested)")
                    if(!dico.some(e => e === string)){
                        for(let i=0; i< previous.length; i++){
                            previous[i].className += " tested invalid"
                        }
                        document.querySelector('#title').textContent = `c'est quoi ce mot?`
                        setTimeout(() => {
                            document.querySelector('#title').textContent = 'bouche cousue'
                        }, 2000);

                    // valid word
                    }else{ 

                        // winning word
                        if(string === rightGuessString){  
                            document.querySelector('#title').textContent = `motus`
                            setTimeout(() => {
                                document.querySelector('#title').textContent = `et`
                            }, 2000);
                            setTimeout(() => {
                                document.querySelector('#title').textContent = `bouche cousue`
                            }, 3000);
                            
                            for(let i=0; i< previous.length; i++){
                                previous[i].className += " good"
                            }
                            const sleep = (time) => {
                                return new Promise((resolve) => setTimeout(resolve, time))
                            }
                            const winningAnimation = async () => {
                                for (let i = 0; i < rightGuessString.length; i++) {
                                    await sleep(200)
                                    setTimeout(() => {
                                        previous[i].className = "letter-box filled-box tested related"
                                    }, 200);
                                    setTimeout(() => {
                                        previous[i].className = "letter-box filled-box tested good"
                                    }, 400);
                                    setTimeout(() => {
                                        previous[i].className = "letter-box filled-box tested related"
                                    }, 600);
                                    setTimeout(() => {
                                        previous[i].className = "letter-box filled-box tested good"
                                    }, 800);
                                    setTimeout(() => {
                                        previous[i].className = "letter-box filled-box tested related"
                                    }, 1000);
                                    setTimeout(() => {
                                        previous[i].className = "letter-box filled-box tested good"
                                    }, 1200);
                                }
                            }
                            winningAnimation()

                            let audio = new Audio("sound/win.mp3"); 
                            audio.play();
                            

                            document.getElementById("mytext").remove()  // remove the trick

                        /// not winning word
                        }else{
                            let testString =rightGuessString;
                            for (let i=0; i<string.length; i++){
                                // good letters
                                if(string[i] === rightGuessString[i]){
                                    previous[i].className += " tested good"
                                    let j = testString.indexOf(string[i])
                                    testString = testString.substring(0,j) + testString.substring(j+1,testString.length)
                                // related letters
                                }else if(testString.includes(string[i])){
                                    previous[i].className += " tested related"
                                    let j = testString.indexOf(string[i])
                                    testString = testString.substring(0,j) + testString.substring(j+1,testString.length)
                                // absent letters
                                }else{
                                    previous[i].className += " tested absent"
                                }
                            }
                        }
                    }
                }
            }
        }


        // game over
        if(document.querySelectorAll('.tested').length === rightGuessString.length*nbrGuesses){
            document.querySelector('#title').textContent = "c’est perdu"

            let gameOver = document.querySelectorAll('.tested')
            const looseAnimation = async () => {
                for (let i = 0; i < gameOver.length; i++) {
                    await sleep(30)
                    if(i % 2 === 0) {
                        gameOver[i].className = 'letter-box filled-box tested gameover'
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 100);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 200);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 300);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 400);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 500);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 600);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 700);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 800);
                    }else{
                        gameOver[i].className = 'letter-box filled-box tested absent'
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 100);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 200);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 300);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 400);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 500);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested absent'
                        }, 600);
                        setTimeout(() => {
                            gameOver[i].className = 'letter-box filled-box tested gameover'
                        }, 700);
                    }   
                }
            }
            looseAnimation()

            let audio = new Audio("sound/loose.mp3");
            audio.play();

            document.getElementById("mytext").remove() // remove the trick
        }
    })
}




// TO-DO
// scoring