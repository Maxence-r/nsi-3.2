let personnage = extraction("Caracteristiques_des_persos.csv", "characters.csv")

function extraction(file_1, file_2) {
    var character_table = []
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var rows = this.responseText.split("\n");
            var headers = rows[0].split(";")
            for (var i = 1; i < rows.length; i++) {
                var element = rows[i].split(";")
                var obj = {}
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = element[j]
                }
                character_table.push(obj)
            }
        }
    };
    xhr.open("GET", file_1, false);
    xhr.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var rows = this.responseText.split("\n");
            var headers = rows[0].split(";")
            var characters = []
            for (var i = 1; i < rows.length; i++) {
                var element = rows[i].split(";")
                var obj = {}
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = element[j]
                }
                characters.push(obj)
            }
            for (var key in characters) {
                for (var character in character_table) {
                    if (character_table[character]['Name'] == characters[key]['Name']) {
                        character_table[character]['House'] = characters[key]['House']
                    }
                }
            }
        }
    };
    xhr2.open("GET", file_2, false);
    xhr2.send();
    return character_table
}

function distance(profil, personnage, methode = 'euclidienne') {
    return Math.sqrt(Math.pow(parseInt(profil['Courage']) - parseInt(personnage['Courage']), 2) + Math.pow(parseInt(profil['Ambition']) - parseInt(personnage['Ambition']), 2) + Math.pow(parseInt(profil['Intelligence']) - parseInt(personnage['Intelligence']), 2) + Math.pow(parseInt(profil['Good']) - parseInt(personnage['Good']), 2))
}

function ajout_distance(tab, unknown_character) {
    for (let i = 0; i < tab.length; i++) {
        tab[i]['Distance'] = distance(unknown_character, tab[i]);
    }
    return tab;
}

function best_house(tab) {
    let included_house = {};
    for (let i = 0; i < tab.length; i++) {
        let neighboor = tab[i];
        if (neighboor['House'] in included_house) {
            included_house[neighboor['House']] += 1;
        } else {
            included_house[neighboor['House']] = 1;
        }
    }
    let maximum = 0;
    let top_house;
    for (let houses in included_house) {
        let nb = included_house[houses];
        if (nb > maximum) {
            maximum = nb;
            top_house = houses;
        }
    }
    return top_house;
}

function profile_creation(base) {
    for (let caracteristics in base) {
        base[caracteristics] = parseInt(prompt(`${caracteristics} : `));
    }
    return base;
}

function execution(profile_type) {
    let characters = ajout_distance(personnage, profile_type);
    let k = 5;
    let voisins = personnage.sort(function(a, b) {
        return a['Distance'] - b['Distance'];
    });
    return [best_house(voisins.slice(0, k)), voisins.slice(0, k)];
}

function results_creation(tab) {
    let results = {};
    for (let i = 0; i < tab.length; i++) {
        results[tab[i]['Name']] = tab[i]['House'];
    }
    return results;
}

let currentQuestion = 0;
let tosend = [0, 0, 0, 0];
let questions = {
    "Avez vous peur du noir ?": [{
            Oui: [0, 0, 0, 0]
        },
        {
            Non: [0, 1, 2, 3]
        },
        {
            "Peut être": [0, 1, 2, 3]
        },
        {
            "Je ne sais pas": [0, 1, 2, 3]
        },
    ],
    "Avez vous peur des araignées ?": [{
            Oui: [0, 0, 0, 0]
        },
        {
            Non: [0, 1, 2, 3]
        },
        {
            "Peut être": [0, 1, 2, 3]
        },
        {
            "Je ne sais pas": [0, 1, 2, 3]
        },
    ],
    "Avez vous peur des chiens ?": [{
            Oui: [0, 0, 0, 1]
        },
        {
            Non: [0, 1, 2, 3]
        },
        {
            "Peut être": [0, 1, 2, 3]
        },
        {
            "Je ne sais pas": [0, 1, 2, 3]
        },
    ],
    "Avez vous peur des serpents ?": [{
            Oui: [0, 1, 0, 0]
        },
        {
            Non: [0, 1, 0, 0]
        },
        {
            "Peut être": [0, 1, 0, 0]
        },
        {
            "Je ne sais pas": [0, 1, 2, 3]
        },
    ],
    "Avez vous peur des souris ?": [{
            Oui: [0, 1, 2, 3]
        },
        {
            Non: [0, 1, 2, 3]
        },
        {
            "Peut être": [0, 1, 2, 3]
        },
        {
            "Je ne sais pas": [0, 1, 2, 3]
        },
    ],
    "Avez vous peur des chats ?": [{
            Oui: [0, 1, 2, 3]
        },
        {
            Non: [0, 1, 2, 3]
        },
        {
            "Peut être": [0, 1, 2, 3]
        },
        {
            "Je ne sais pas": [0, 1, 2, 3]
        },
    ],
};

const questionEl = document.getElementById("question");
const buttons = document.querySelectorAll(".button-container button");

function displayQuestion() {
    const question = Object.keys(questions)[currentQuestion];
    const answers = Object.values(questions)[currentQuestion];

    questionEl.innerText = question;

    buttons.forEach((button, index) => {
        button.innerText = Object.keys(answers[index])[0];
    });
}

window.onload = displayQuestion;

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const answer = Object.values(questions)[currentQuestion][index];
        console.log(answer);

        tosend = tosend.map((value, idx) => value + answer[Object.keys(answer)[0]][idx]);

        currentQuestion++;
        if (currentQuestion < Object.keys(questions).length) {
            displayQuestion();
        } else {
            console.log(tosend);
            let result = execution({
                'Courage': tosend[0],
                'Ambition': tosend[1],
                'Intelligence': tosend[2],
                'Good': tosend[3]
            });
            console.log(result);
            alert(`Vous êtes de le maison ${result[0]} !`);
        }
    });
});