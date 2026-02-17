document.addEventListener("DOMContentLoaded", () => {

    const supabase = window.supabase.createClient(
        "https://ddzebzonhkghfzjkvuan.supabase.co",
        "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
    );

    let pseudo = "";
    let score = 0;
    let quizDone = false;

    // Quiz enfant uniquement
    const quizEnfant = [
        { question: "Quel est l'enfant préféré de Papa ?", options: ["Octave", "Magdalena", "Bartholomé"], answer: 0 },
        { question: "Quelle est son expression préférée ?", options: ["Diantre", "Zut", "Daube"], answer: 2 },
        { question: "Quel est son hobby préféré ?", options: ["Football", "Trail", "Cyclisme"], answer: 1 }
    ];

    // Validation du pseudo
    document.getElementById("validatePseudo").addEventListener("click", async () => {
        const input = document.getElementById("pseudo").value.trim();
        if(!input){
            alert("Entre un pseudo !");
            return;
        }

        pseudo = input;

        // Vérifie si le pseudo a déjà fait le quiz
        const { data: existing } = await supabase
            .from("scores")
            .select("*")
            .eq("username", pseudo);

        if(existing.length > 0){
            alert("Ce pseudo a déjà fait le quiz !");
            return;
        }

        document.getElementById("quizSection").style.display = "block";
        loadQuiz();
    });

    // Charger le quiz
    function loadQuiz(){
        const container = document.getElementById("quizContainer");
        container.innerHTML = "";
        score = 0;

        quizEnfant.forEach((q, index) => {
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

                    // Désactive tous les boutons de la question
                    Array.from(div.getElementsByTagName("button")).forEach(b => b.disabled = true);
                });

                div.appendChild(btn);
            });

            container.appendChild(div);
        });
    }

    // Soumettre le quiz et enregistrer le score
    document.getElementById("submitQuiz").addEventListener("click", async () => {
        if(quizDone){
            alert("Tu as déjà fait le quiz !");
            return;
        }

        document.getElementById("finalScore").innerText = score;

        await supabase.from("scores").insert({
            username: pseudo,
            score: score
        });

        alert("Score enregistré !");
        quizDone = true;
        loadLeaderboard();
    });

    // Rafraîchir le leaderboard
    document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

    // Charger leaderboard avec mise en évidence des 3 premiers
    async function loadLeaderboard(){
        let { data } = await supabase
            .from("scores")
            .select("*")
            .order("score", { ascending: false });

        const table = document.getElementById("leaderboard");
        table.innerHTML = `<tr><th>Pseudo</th><th>Score</th></tr>`;

        data.forEach((row, index) => {
            let bg = "white"; 
            if(index === 0) bg = "gold";
            else if(index === 1) bg = "silver";
            else if(index === 2) bg = "peru";

            table.innerHTML += `
                <tr style="background-color:${bg}; font-weight:bold;">
                    <td>${row.username}</td>
                    <td>${row.score}</td>
                </tr>
            `;
        });
    }

});
