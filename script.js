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
        {   
            type: "text",
            question: "Quel est l'enfant préféré de Papa ?", 
            options: ["Octave", "Magdalena", "Bartholomé"], 
            answer: 0 
        },
        {
            type: "text",
            question: "Quelle est son expression préférée ?", 
            options: ["Diantre", "Daube", "Zut"], 
            answer: 1 
        },
        { 
            type: "text",
            question: "Quel est son hobby préféré ?", options: ["Football", "Cyclisme", "Trail"], 
            answer: 2 
        },
        {   
            type: "image",
            question: "Qui est papa ?", 
            options: [
                { image: "gabin.jpg",correct:false},
                { image: "papa.jpg",correct:true},
                { image: "singe.jpg",correct:false}
            ] 
        }
    ];

    // --- Charger les messages ---
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

    // --- Charger messages au démarrage ---
    loadMessages();

    // --- Fonction pour charger le quiz ---
    function loadQuiz() {
    const container = document.getElementById("quizContainer");
    container.innerHTML = "";
    score = 0;

    quizQuestions.forEach((q) => {
        const div = document.createElement("div");
        div.style.marginBottom = "30px";
        div.innerHTML += `<p>${q.question}</p>`;

        if(q.type === "text") {
            // Quiz texte
            q.options.forEach((option, i) => {
                const btn = document.createElement("button");
                btn.innerText = option;
                btn.style.margin = "5px";

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
        }
        else if(q.type === "image") {
            // Quiz image
            div.style.display = "flex";
            div.style.justifyContent = "center";
            div.style.flexWrap = "wrap";

            q.options.forEach((option) => {
                const btn = document.createElement("button");
                btn.style.border = "none";
                btn.style.background = "transparent";
                btn.style.cursor = "pointer";
                btn.style.margin = "5px";

                const img = document.createElement("img");
                img.src = option.image;
                img.alt = "Option";
                img.style.width = "150px";
                img.style.borderRadius = "8px";
                btn.appendChild(img);

                btn.addEventListener("click", () => {
                    if(option.correct){
                        score++;
                        img.style.border = "4px solid green";
                    } else {
                        img.style.border = "4px solid red";
                    }

                    Array.from(div.getElementsByTagName("button"))
                         .forEach(b => b.disabled = true);
                });

                div.appendChild(btn);
            });
        }

        container.appendChild(div);
    });
}


    // --- Valider le pseudo (unique) ---
    document.getElementById("validatePseudo").addEventListener("click", async () => {
        const input = document.getElementById("pseudo").value.trim();
        if (!input) {
            alert("Entre un pseudo !");
            return;
        }

        try {
            // Vérifier si le pseudo existe déjà
            let { data: existing, error } = await supabase
                .from("scores")
                .select("*")
                .eq("username", input)
                .limit(1);

            if (error) throw error;

            if (existing.length > 0) {
                alert("Ce pseudo existe déjà ! Choisis-en un autre.");
                return;
            }

            pseudo = input;
            document.getElementById("quizSection").style.display = "block";
            loadQuiz();

        } catch (err) {
            console.error("Erreur lors de la vérification du pseudo :", err);
            alert("Erreur lors de la vérification du pseudo.");
        }
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
            loadLeaderboard();

        } catch (err) {
            console.error("Erreur lors de l'enregistrement du score :", err);
            alert("Erreur lors de l'enregistrement du score.");
        }
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
