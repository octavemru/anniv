const supabase = window.supabase.createClient(
  "https://ddzebzonhkghfzjkvuan.supabase.co",   
  "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
);

document.getElementById("saveBtn").addEventListener("click", saveScore);
document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

async function saveScore() {
    const pseudo = document.getElementById("pseudo").value;
    const score = parseInt(document.getElementById("scoreInput").value);

    if(!pseudo || isNaN(score)){
        alert("Pseudo et score valides requis !");
        return;
    }

    await supabase.from("scores").insert({
        username: pseudo,
        score: score
    });

    alert("Score enregistré !");
    loadLeaderboard();
}

async function loadLeaderboard() {
    let { data } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false });

    const table = document.getElementById("leaderboard");
    table.innerHTML = "";

    data.forEach(row => {
        table.innerHTML += `
            <tr>
                <td>${row.username}</td>
                <td>${row.score}</td>
            </tr>
        `;
    });
}

// QUESTIONS DU QUIZ
const quizQuestions = [
    {
        question: "Quel est le plat préféré de Papa ?",
        options: ["Pizza", "Raclette", "Pâtes"],
        answer: 1 // Raclette
    },
    {
        question: "Quelle est sa couleur préférée ?",
        options: ["Bleu", "Rouge", "Vert"],
        answer: 0 // Bleu
    },
    {
        question: "Quel est son hobby préféré ?",
        options: ["Football", "Lecture", "Cyclisme"],
        answer: 2 // Cyclisme
    }
];

let score = 0;

// AFFICHER LE QUIZ
const quizContainer = document.getElementById("quizContainer");

quizQuestions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionTitle = document.createElement("p");
    questionTitle.innerText = q.question;
    questionDiv.appendChild(questionTitle);

    q.options.forEach((option, i) => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.addEventListener("click", () => {
            if(i === q.answer){
                score++;
                btn.style.backgroundColor = "green";
            } else {
                btn.style.backgroundColor = "red";
            }
            Array.from(questionDiv.getElementsByTagName("button")).forEach(b => b.disabled = true);
        });
        questionDiv.appendChild(btn);
    });

    quizContainer.appendChild(questionDiv);
});

// BOUTON VALIDER QUIZ
document.getElementById("submitQuiz").addEventListener("click", () => {
    const pseudo = document.getElementById("pseudo").value || "Anonyme";
    document.getElementById("finalScore").innerText = `${pseudo} : ${score} / ${quizQuestions.length}`;
});
