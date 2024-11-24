// Kotki (zaktualizowane z odpowiednimi obrazkami)
const kotki = [
    { name: "Snuggles", img: "images/snuggles.png", rarity: "legendarny", criteria: { spanko: 4, energia: 1, humor: 1, ziewanko: 4, obowiazki: 1 } },
    { name: "Eepy", img: "images/eepy.png", rarity: "epicki", criteria: { spanko: 3, energia: 2, humor: 2, ziewanko: 3, obowiazki: 1 } },
    { name: "Ciężko Pracujący Eepy", img: "images/ciezkopracujaceepy.png", rarity: "epicki", criteria: { spanko: 3, energia: 1, humor: 1, ziewanko: 4, obowiazki: 4 } },
    { name: "Kosmiczny Eepy", img: "images/kosmiczny.png", rarity: "epicki", criteria: { spanko: 3, energia: 1, humor: 4, ziewanko: 3, obowiazki: 1 } },
    { name: "Eepy Poranny", img: "images/poranny.png", rarity: "rzadki", criteria: { spanko: 3, energia: 1, humor: 2, ziewanko: 3, obowiazki: 1, poraDnia: "rano" } },
    { name: "Eepy Hello", img: "images/hello.png", rarity: "rzadki", criteria: { spanko: 3, energia: 1, humor: 1, ziewanko: 3, obowiazki: 4 } }
];

// Przycisk do rozpoczęcia quizu
document.getElementById("start-btn").addEventListener("click", startQuiz);

let currentQuestion = 0;
let answers = [];

function startQuiz() {
    document.getElementById("start-container").style.display = "none";
    document.getElementById("quiz").classList.remove("hidden");
    showQuestion();
}

// Wyświetlanie pytania
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById("question-text").textContent = question.text;

    const answerButtons = document.querySelectorAll('.emoji');
    answerButtons.forEach((button, index) => {
        button.textContent = question.answers[index].emoji;
        button.onclick = () => handleAnswer(question.id, question.answers[index].score);
    });
}

// Obsługa odpowiedzi
function handleAnswer(questionId, score) {
    answers.push({ [questionId]: score });

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}

// Pokazanie wyniku
function showResult() {
    const kotek = calculateKotek();
    document.getElementById("kotka-name").textContent = kotek.name;
    document.getElementById("kotka-img").src = kotek.img;

    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result-container").classList.remove("hidden");

    saveKotek(kotek);
}

// Funkcja obliczająca wynik
function calculateKotek() {
    let bestMatch = null;
    let bestScore = 0;

    kotki.forEach(kotek => {
        let score = 0;
        for (let key in kotek.criteria) {
            const criteriaValue = kotek.criteria[key];
            const answer = answers.find(a => a[key]);
            if (answer && answer[key] === criteriaValue) {
                score++;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = kotek;
        }
    });

    return bestMatch;
}

// Zapisywanie odkrytego kotka
function saveKotek(kotek) {
    let odkryteKotki = JSON.parse(localStorage.getItem("odkryteKotki")) || [];
    if (!odkryteKotki.includes(kotek.name)) {
        odkryteKotki.push(kotek.name);
        localStorage.setItem("odkryteKotki", JSON.stringify(odkryteKotki));
    }
    updateOdkryteKotki();
}

// Aktualizacja odkrytych kotków
function updateOdkryteKotki() {
    const odkryteKotki = JSON.parse(localStorage.getItem("odkryteKotki")) || [];
    const odkryteKotkiContainer = document.getElementById("odkryte-kotki");
    odkryteKotkiContainer.innerHTML = "";

    odkryteKotki.forEach(kotekName => {
        const kotek = kotki.find(k => k.name === kotekName);
        const kotekBox = document.createElement("div");
        kotekBox.classList.add("kotek-rzadkosci", kotek.rarity);
        const imgElement = document.createElement("img");
        imgElement.src = kotek.img;
        imgElement.alt = kotek.name;
        kotekBox.appendChild(imgElement);
        odkryteKotkiContainer.appendChild(kotekBox);
    });
}

// Inicjalizacja
updateOdkryteKotki();
