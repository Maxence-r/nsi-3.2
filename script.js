/* Bon c'est du javascript, bonne lecture */

let personnage = extraction("Caracteristiques_des_persos.csv", "characters.csv") // Extraction des données

function extraction(file_1, file_2) { // Extraction des données
    let character_table = [] // Tableau qui contiendra les données
    let xhr = new XMLHttpRequest(); // Création de l'objet XMLHttpRequest
    xhr.onreadystatechange = function() { // Fonction qui sera appelée à chaque changement d'état de la requête
        if (this.readyState == 4 && this.status == 200) { // Si la requête est terminée et que la réponse est prête
            let rows = this.responseText.split("\n"); // On récupère le texte de la réponse
            let headers = rows[0].split(";") // On récupère les headers
            for (let i = 1; i < rows.length; i++) { // On parcourt les lignes
                let element = rows[i].split(";") // On récupère les éléments de la ligne
                let obj = {} // On crée un objet
                for (let j = 0; j < headers.length; j++) { // On parcourt les headers
                    obj[headers[j]] = element[j] // On ajoute les éléments à l'objet
                } 
                character_table.push(obj) // On ajoute l'objet au tableau
            }
        }
    };
    xhr.open("GET", file_1, false); // On ouvre la requête
    xhr.send(); // On envoie la requête

    let xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {
            let rows = this.responseText.split("\n"); 
            let headers = rows[0].split(";")
            let characters = []
            for (let i = 1; i < rows.length; i++) {
                let element = rows[i].split(";")
                let obj = {}
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = element[j]
                }
                characters.push(obj)
            }
            for (let key in characters) {
                for (let character in character_table) {
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

function distance(profil, personnage) { // Calcul de la distance entre deux personnages
    return Math.sqrt(Math.pow(parseInt(profil['Courage']) - parseInt(personnage['Courage']), 2) + Math.pow(parseInt(profil['Ambition']) - parseInt(personnage['Ambition']), 2) + Math.pow(parseInt(profil['Intelligence']) - parseInt(personnage['Intelligence']), 2) + Math.pow(parseInt(profil['Good']) - parseInt(personnage['Good']), 2))  
}

function ajout_distance(tab, profile_type) { // Ajout de la distance entre le personnage inconnu et les autres personnages
    for (let i = 0; i < tab.length; i++) {
        tab[i]['Distance'] = distance(profile_type, tab[i]); 
    }
    return tab;
}

function results_creation(tab) { // Création du tableau des résultats
    let results = {};
    for (let i = 0; i < tab.length; i++) {
        results[tab[i]['Name']] = tab[i]['House'];
    }
    return results;
}


function best_house(tab) { // Renvoie la maison la plus représentée parmi les k plus proches voisins
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

function execution(profile_type) { // Fonction qui renvoie la maison la plus représentée parmi les k plus proches voisins
    ajout_distance(personnage, profile_type);
    let k = 5;
    let voisins = personnage.sort(function(a, b) {
        return a['Distance'] - b['Distance'];
    });
    return [best_house(voisins.slice(0, k)), voisins.slice(0, k)];
}


let currentQuestion = 0;
let tosend = [5, 5, 5, 5];
let questions = { // Questions du questionnaire
    "Quelle est ta potion preferer": [{
            "Force": [0, 1, 0, 0]
        },
        {
            "Chance": [0, 0, -1, 1]
        },
        {
            "Invisibilité": [-2, 0, 0, -2]
        },
    ],
    "Quelle passe temps tu aimes ?": [{
        "dormir": [-1, -3, 0, 1]
        },
        {
            "Travailler": [1, 2, 2, 0]
        },
        {
            "Sauver le monde": [3, 2, 0, 3]
        },
    ],
    "Quand tu vois tomber un billet de la poche de quelqu un tu ...": [{
            "interpelle la personne pour lui rendre": [0, 0, -1, 2]
        },
        {
            "prends le billet": [0, 0, 1, -2]
        },
        {
            "le donne a un sdf": [0, 0, 1, 2]
        }, 
    ],
    "Tu considere les molduts comme ?": [{
            "des etre non sorcier": [0, 0, 1, 0]
        },
        {
            "des personnes": [0, 0, 0, 0]
        },
        {
            "des etres inferieurs": [0, 0, 0, -2]
        },
    ],
    "quand quelqu un tappe un eleve tu...": [{
            "viens le sauver": [2, 0, 0, 1]
        },
        {
            "appelle la police": [-1, 0, 1, 1]
        },
        {
            "ignore car c est une victime": [-1, 0, 0, -5]
        },
    ],
    "Quel est la personne dont ne peut pas pronocer le nom ?": [{
            "Voldemort": [2, 0, 0, 0]
        },
        {
            "celui qui a fait la reforme des retraites": [1, 0, -2, 0]
        },
        {
            "je ne peux pas c est interdit": [-2, 0, 1, 0]
        },
    ],
    "quel est le mage le plus puissant ?": [{
            "Voldemort": [0, 0, -1, 0]
        },
        {
            "Dumbeldort": [0, 0, 2, 0]
        },
        {
            "Moi": [0, 2, -1, 0]
        },
    ],
    "tu dis pain au chocolat ou chocolatine ?": [{
            "pain au chocolat": [0, 0, 1, 1]
        },
        {
            "chocolatine": [1, 0, -1, -1]
        },
        {
            "pain au chocolatine": [0, 0, -4, -2]
        },
    ],
    "quel age a dumbeldort ?": [{
            "46": [0, 0, -1, 0]
        },
        {
            "15": [0, 0, -2, 0]
        },
        {
            "116": [0, 0, 2, 0]
        },
    ],
    "Que veux tu devenir plus tard ?": [{
            "etre riche": [0, 2, 1, 0]
        },
        {
            "peut importe tant que je suis heureux": [0, -2, 0, 3]
        },
        {
            "Je sais pas": [0, -4, 0, 0]
        },
    ]
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
            result[1].forEach((element) => {
                console.log(element);
                document.getElementById('voisins').innerHTML += `<p>Voisins : ${JSON.stringify(element)}</p>`;
                document.querySelector('body').classList.add('turn');
            });
        }
    });
});


setTimeout(() => {
    document.querySelector(`.frame-incroyable`).style.display = 'flex';
}, 20000);

document.getElementById(`Loaduponguns,bringyourfriendsIt'sfuntoloseandtopretendShe'soverboredandselfassuredOhno,IknowadirtywordHello,hello,hello,howlowHello,hello,hello,howlowHello,hello,hello,howlowHello,hello,helloWiththelightsout,it'slessdangerousHerewearenow,entertainusIfeelstupidandcontagiousHerewearenow,entertainusAmulatto,analbino,amosquito,mylibidoYeah,heyYayI'mworseatwhatIdobestAndforthisgiftIfeelblessedOurlittlegrouphasalwaysbeenAndalwayswilluntiltheendHello,hello,hello,howlowHello,hello,hello,howlowHello,hello,hello,howlowHello,hello,helloWiththelightsout,it'slessdangerousHerewearenow,entertainusIfeelstupidandcontagiousHerewearenow,entertainusAmulatto,analbino,amosquito,mylibidoYeah,heyYayAndIforgetjustwhyItasteOhyeah,IguessitmakesmesmileIfoundithard,washardtofindOhwell,whatever,nevermindHello,hello,hello,howlowHello,hello,hello,howlowHello,hello,hello,howlowHello,hello,helloWiththelightsout,it'slessdangerousHerewearenow,entertainusIfeelstupidandcontagiousHerewearenow,entertainusAmulatto,analbino,amosquito,mylibidoAdenial,adenial,adenial,adenial,adenialAdenial,adenial,adenial,adenial`).addEventListener('click', () => {
    document.querySelector(`.frame-incroyable`).style.display = 'none';
});
/* Bonne soirée ! */