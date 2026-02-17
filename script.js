const supabase = window.supabase.createClient(
  "https://TON_PROJET.supabase.co",
  "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
);

document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);
document.getElementById("submitQuiz").addEventListener("click", saveQuizScore);

const quizQuestions = [
    {
        question: "Quel est le plat préféré de Papa ?",
        options: ["Pizza", "Raclette", "Pâtes"],
        answer: 1
    },
    {
        question: "Quelle est sa couleur préférée ?",
        options: ["Bleu", "Rouge", "Vert"],
        answer: 0
    },
    {
        question: "Quel est son hobby préféré ?",
        options: ["Football", "Lecture", "Cyclisme"],
        answer: 2
    }
];

let score = 0;

const quizContainer = document.getElementById("quizContainer");

quizQuestions.forEach((q, index) => {
    const div = document.createElement("div");

    div.innerHTML += `<p>${q.question}</p>`;

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
            Array.from(div.getElementsByTagName("button"))
                 .forEach(b => b.disabled = true);
        });

        div.appendChild(btn);
    });

    quizContainer.appendChild(div);
});

async function saveQuizScore() {

    const pseudo = document.getElementById("pseudo").value;

    if(!pseudo){
        alert("Entre ton pseudo !");
        return;
    }

    document.getElementById("finalScore").innerText = score;

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
