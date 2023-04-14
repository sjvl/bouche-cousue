// Globals
let nbrGuesses = 6;
let nextLetter = 0;
let rightGuessString = '';


//init GAME board
let board = document.querySelector('#game-board');

fetch("https://trouve-mot.fr/api/daily")
    .then(response => response.json())
    .then(data => {
        if (!data) return;
        const date = new Date()
        document.querySelector('#gameId').textContent = moment(date).format('DD/MM/YYYY')
        rightGuessString = data.name.toLowerCase();

        for (let i = 0; i < nbrGuesses; i++) {
            board.innerHTML += `<div class="letter-row"></div>`;
            for (let j = 0; j < rightGuessString.length; j++) {
                document.querySelectorAll('.letter-row')[i].innerHTML += `<div class="letter-box"></div >`;
            }
        }
        //console.log(rightGuessString)
    });

/// launch new GAME
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
        if(nextLetter === 5){
            //check le mot
            const rightGuessArray = rightGuessString.split('')
            const letters = document.querySelectorAll('.filled-box:not(.tested)')
            let testword = [];
            for(let i=0; i< rightGuessArray.length; i++){
                testword.push(letters[i].textContent)
                if(testword[i] === rightGuessArray[i] ){
                    letters[i].className = "letter-box filled-box tested won"
                }else if(rightGuessArray.includes(testword[i])){
                    console.log(`${testword[i]} n'est pas à la bonne place`)
                    letters[i].className = "letter-box filled-box tested near"
                }else{
                    console.log(`${testword[i]} n'existe pas`)
                    letters[i].className = "letter-box filled-box tested loose"
                }
            }
            if(testword.join('') === rightGuessArray.join('')){
                document.querySelector('#result').textContent = "ET C’EST GAGNÉ!"
                let audio = new Audio("win.mp3");
                audio.play();
                return
            }else if(document.querySelectorAll('.tested').length === rightGuessString.length*nbrGuesses){
                document.querySelector('#result').textContent = "OH NON.."
                let audio = new Audio("loose.mp3");
                audio.play();
                return
            }
            nextLetter = 0
        }else{
            document.querySelector('#result').textContent = "Not enough letters !"
        }
    }else if(event.key.match(/^[a-zA-ZÀ-ÿ]$/)){
        if(document.querySelector('#result').textContent === "Ça mancque de lettres par ici.."){
            document.querySelector('#result').textContent = ""
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