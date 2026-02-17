document.addEventListener("DOMContentLoaded", () => {

    const supabase = window.supabase.createClient(
        "https://ddzebzonhkghfzjkvuan.supabase.co",
        "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
    );

    let pseudo = "";
    let score = 0;

    // Tous les quiz disponibles
    const quizzes = {
        papa: [
            { question: "Quel est le plat préféré de Papa ?", options: ["Pizza", "Raclette", "Pâtes"], answer: 1 },
            { question: "Quelle est sa couleur préférée ?", options: ["Bleu", "Rouge", "Vert"], answer: 0 },
            { question: "Quel est son hobby préféré ?", options: ["Football", "Lecture", "Cyclisme"], answer: 2 }
        ],
        enfant: [
            { question: "Quel est l'enfant préféré de Papa ?", options: ["Octave", "Magdalena", "Bartholomé"], answer: 0 },
            { question: "Quelle est son expression préférée ?", options: ["Diantre", "Zut", "Daube"], answer: 2 },
            { question: "Quel est son hobby préféré ?", options: ["Football", "Trail", "Cyclisme"], answer: 1 }
        ]
    };

    // Choix du quiz
    let currentQuiz = quizzes.enfant; // ou "papa"

    // Validation du pseudo
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

    // Fonction pour charger le quiz
    function loadQuiz(){
        const container = document.getElementById("quizContainer");
        container.innerHTML = "";
        score = 0;

        currentQuiz.forEach((q, index) => {
            const div = document.createElement("div");
            div.classList.add("questionBlock");
            div.innerHTML = `<p>${index + 1}. ${q.question}</p>`;

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
                    // Désactive tous les boutons de la question après un clic
                    Array.from(div.getElementsByTagName("button")).forEach(b => b.disabled = true);
                });

                div.appendChild(btn);
            });

            container.appendChild(div);
        });
    }

    // Soumettre le quiz et enregistrer le score
    document.getElementById("submitQuiz").addEventListener("click", async () => {
        document.getElementById("finalScore").innerText = score;

        await supabase.from("scores").insert({
            username: pseudo,
            score: score
        });

        alert("Score enregistré !");
        loadLeaderboard();
    });

    // Rafraîchir le leaderboard
    document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

    async function loadLeaderboard(){
        let { data } = await supabase
            .from("scores")
            .select("*")
            .order("score", { ascending: false });

        const table = document.getElementById("leaderboard");
        table.innerHTML = "";

        data.forEach((row, index) => {
            table.innerHTML += `
                <tr style="background-color:${index===0?'gold':index===1?'silver':index===2?'peru':'white'}">
                    <td>${row.username}</td>
                    <td>${row.score}</td>
                </tr>
            `;
        });
    }

});
