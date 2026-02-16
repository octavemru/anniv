const supabase = window.supabase.createClient(
  "TON_URL",
  "TA_CLE_ANON"
);

document.getElementById("saveBtn").addEventListener("click", saveScore);
document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

async function saveScore() {

    const username = document.getElementById("username").value;
    const score = document.getElementById("scoreInput").value;

    if(username === "" || score === ""){
        alert("Remplis ton pseudo et ton score !");
        return;
    }

    await supabase.from("scores").insert({
        username: username,
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
