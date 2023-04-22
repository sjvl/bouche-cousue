// Globals
let nbrGuesses = 6;
let nextLetter = 0;
let rightGuessString = '';

const board = document.querySelector('#game-board');
const date = new Date()
document.querySelector('#gameId').textContent = moment(date).format('DD/MM/YYYY')

//un mot par jour
let seed = moment(date).format('DDMMYYYY')
//let seed = 123
let x = Math.sin(seed++) * 10000;
let randomindex = Math.floor( ( x - Math.floor(x) ) * dico.length );
rightGuessString = dico[randomindex];
//console.log(rightGuessString)

//generate board
for (let i = 0; i < nbrGuesses; i++) {
    board.innerHTML += `<div class="letter-row"></div>`;
    for (let j = 0; j < rightGuessString.length; j++) {
        document.querySelectorAll('.letter-row')[i].innerHTML += `<div class="letter-box"></div >`;
    }
}

/// nouvelle chance
document.querySelector('#newGame').addEventListener('click', function(){
    window.location.reload()
})

///GAME
document.addEventListener('keyup', function(event){
    if(event.key === 'Backspace'){
        const lastLetter = document.querySelectorAll('.filled-box:not(.tested)')
        lastLetter[lastLetter.length-1].textContent = ''
        lastLetter[lastLetter.length-1].className = "letter-box"
        nextLetter -= 1

    }else if(event.key === 'Enter'){
        if(nextLetter === rightGuessString.length){
            //check le mot
            const rightGuessArray = rightGuessString.split('')
            let rightGuessArrayTest = rightGuessArray
            const letters = document.querySelectorAll('.filled-box:not(.tested)')

            let test = [];
            let testword = [];
            for(let i=0; i< rightGuessArray.length; i++){
                test.push(letters[i].textContent)
            }

            if( dico.some(e => e === test.join('') ) ){
                //les gagnants
                for(let i=0; i< rightGuessArray.length; i++){
                    testword.push(letters[i].textContent)
                    if(testword[i] === rightGuessArray[i] ) {
                        letters[i].className = "letter-box filled-box tested won"
                        rightGuessArrayTest = rightGuessArrayTest.filter(e => e !== testword[i])
                        //console.log(rightGuessArrayTest)
                    }
                }

                //les proches
                testword = [];
                for(let i=0; i< rightGuessArray.length; i++){
                    testword.push(letters[i].textContent)
                    console.log(testword)
                    if(rightGuessArrayTest.includes(testword[i])){
                        //console.log(`${testword[i]} n'est pas à la bonne place`)
                        letters[i].className = "letter-box filled-box tested near"
                        rightGuessArrayTest = rightGuessArrayTest.filter(e => e !== testword[i])
                    }
                }

                //les fausses
                const loose = document.querySelectorAll('.filled-box:not(.tested)')
                for (let i=0; i<loose.length; i++){
                    loose[i].className = "letter-box filled-box tested loose"
                }

            }else {
                document.querySelector('#title').textContent = "mot invalide"
                for(let i=0; i< rightGuessArray.length; i++){
                    letters[i].className = "letter-box filled-box tested invalid"
                }
                setTimeout(() => {
                    document.querySelector('#title').textContent = 'bouche cousue...'
                }, 3000);
            }

            //mot gagnant
            if(testword.join('') === rightGuessArray.join('')){
                document.querySelector('#title').textContent = "motus!"

                const sleep = (time) => {
                    return new Promise((resolve) => setTimeout(resolve, time))
                }
                const animation = async () => {
                    for (let i = 0; i < rightGuessArray.length; i++) {
                      await sleep(200)
                      setTimeout(() => {
                          letters[i].className = "letter-box filled-box tested loose"
                      }, 200);
                      setTimeout(() => {
                          letters[i].className = "letter-box filled-box tested won"
                      }, 400);
                      setTimeout(() => {
                          letters[i].className = "letter-box filled-box tested loose"
                      }, 600);
                      setTimeout(() => {
                          letters[i].className = "letter-box filled-box tested won"
                      }, 800);
                      setTimeout(() => {
                          letters[i].className = "letter-box filled-box tested loose"
                      }, 1000);
                      setTimeout(() => {
                          letters[i].className = "letter-box filled-box tested won"
                      }, 1200);
                    }
                }
                animation()

                let audio = new Audio("sound/win.mp3");
                audio.play();
                return
            
            //game over
            }else if(document.querySelectorAll('.tested').length === rightGuessString.length*nbrGuesses){
                document.querySelector('#title').textContent = "game over"
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
                return
            }

            nextLetter = 0

        }else{
            document.querySelector('#title').textContent = "ça manque de lettres.."
        }

    }else if(event.key.match(/^[a-zA-ZÀ-ÿ]$/)){

        if(document.querySelector('#title').textContent === "ça manque de lettres.."){
            document.querySelector('#title').textContent = "bouche cousue..."
        }

        for(let i=0; i<rightGuessString.length; i++){
            if(nextLetter < i+1){
                document.querySelector('.letter-box:not(.filled-box)').textContent = event.key
                document.querySelector('.letter-box:not(.filled-box)').className = "letter-box filled-box"
                nextLetter += 1
                break
            }
        }

    }
    
})