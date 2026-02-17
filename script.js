document.addEventListener("DOMContentLoaded", () => {

    // --- Initialisation Supabase ---
    const supabase = window.supabase.createClient(
        "https://ddzebzonhkghfzjkvuan.supabase.co",
        "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
    );

    let pseudo = "";
    let score = 0;

    // --- Quiz ---
    const quizQuestions = [
        { question: "Quel est l'enfant préféré de Papa ?", options: ["Octave", "Magdalena", "Bartholomé"], answer: 0 },
        { question: "Quelle est son expression préférée ?", options: ["Diantre", "Daube", "Zut"], answer: 1 },
        { question: "Quel est son hobby préféré ?", options: ["Football", "Cyclisme", "Trail"], answer: 2 }
    ];

    // --- Fonction pour charger les messages ---
    async function loadMessages() {
        try {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            const container = document.getElementById("messagesList");
            container.innerHTML = "";

            if (data && data.length > 0) {
                data.forEach(row => {
                    container.innerHTML += `
                        <div style="
                            background:white;
                            color:black;
                            padding:10px;
                            margin:10px auto;
                            width:60%;
                            border-radius:8px;">
                            ${row.content}
                        </div>
                    `;
                });
            } else {
                container.innerHTML = `<p>Aucun message pour le moment.</p>`;
            }

        } catch (err) {
            console.error("Erreur Supabase:", err);
        }
    }

    // Charger les messages au démarrage
    loadMessages();

    // --- Fonction pour charger le quiz ---
    function loadQuiz() {
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
                    if (i === q.answer) {
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

    // --- Gestion du pseudo ---
    document.getElementById("validatePseudo").addEventListener("click", () => {
        const input = document.getElementById("pseudo").value.trim();
        if (!input) {
            alert("Entre un pseudo !");
            return;
        }

        pseudo = input;
        document.getElementById("quizSection").style.display = "block";
        loadQuiz();
    });

    // --- Soumettre le quiz ---
    document.getElementById("submitQuiz").addEventListener("click", async () => {
        document.getElementById("finalScore").innerText = score;

        try {
            const { error } = await supabase.from("scores").insert({
                username: pseudo,
                score: score
            });
            if (error) throw error;
            alert("Score enregistré !");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du score :", err);
            alert("Erreur lors de l'enregistrement du score.");
        }

        loadLeaderboard();
    });

    // --- Actualiser le leaderboard ---
    document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

    async function loadLeaderboard() {
        try {
            const { data, error } = await supabase
                .from("scores")
                .select("*")
                .order("score", { ascending: false });
            if (error) throw error;

            const table = document.getElementById("leaderboard");
            table.innerHTML = "";

            if (data && data.length > 0) {
                data.forEach((row, index) => {
                    let medal = "";
                    let style = "";

                    if (index === 0) {
                        medal = "🥇 ";
                        style = "background-color: gold; font-weight: bold;";
                    } else if (index === 1) {
                        medal = "🥈 ";
                        style = "background-color: silver; font-weight: bold;";
                    } else if (index === 2) {
                        medal = "🥉 ";
                        style = "background-color: #cd7f32; font-weight: bold;";
                    }

                    table.innerHTML += `
                        <tr style="${style}">
                            <td>${medal}${row.username}</td>
                            <td>${row.score}</td>
                        </tr>
                    `;
                });
            } else {
                table.innerHTML = `<tr><td colspan="2">Aucun score pour le moment.</td></tr>`;
            }

        } catch (err) {
            console.error("Erreur lors du chargement du leaderboard :", err);
        }
    }

    // --- Envoyer un message ---
    document.getElementById("sendMessage").addEventListener("click", async () => {
        const message = document.getElementById("messageInput").value.trim();
        if (!message) {
            alert("Écris un message !");
            return;
        }

        try {
            const { error } = await supabase.from("messages").insert({
                content: message
            });
            if (error) throw error;

            document.getElementById("messageInput").value = "";
            alert("Message envoyé 💌");

            loadMessages();
        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
            alert("Erreur lors de l'envoi du message.");
        }
    });

});
