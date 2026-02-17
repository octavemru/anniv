document.addEventListener("DOMContentLoaded", () => {

const supabase = window.supabase.createClient(
  "https://ddzebzonhkghfzjkvuan.supabase.co",
  "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
);

let pseudo = "";
let score = 0;

const quizQuestions = [
    {
        question: "Quel est l'enfant préféré de Papa ?",
        options: ["Octave", "Magdalena", "Bartholomé"],
        answer: 0
    },
    {
        question: "Quelle est son expression préférée ?",
        options: ["Diantre", "Zut", "Daube"],
        answer: 2
    },
    {
        question: "Quel est son hobby préféré ?",
        options: ["Football", "Trail", "Cyclisme"],
        answer: 1
    }
];

document.getElementById("validatePseudo").addEventListener("click", () => {

    const input = document.getElementById("pseudo").value;

    if(!input){
        alert("Entre un pseudo !");
        return;
    }

    pseudo = input;
    document.getElementById("quizSection").style.display = "block";
    loadQuiz();
});

function loadQuiz(){

    const container = document.getElementById("quizContainer");
    container.innerHTML = "";
    score = 0;

    quizQuestions.forEach((q) => {

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

        container.appendChild(div);
    });
}

document.getElementById("submitQuiz").addEventListener("click", async () => {

    document.getElementById("finalScore").innerText = score;

    await supabase.from("scores").insert({
        username: pseudo,
        score: score
    });

    alert("Score enregistré !");
    loadLeaderboard();
});

document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

async function loadLeaderboard(){

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

});
