const supabase = window.supabase.createClient(
  "https://ddzebzonhkghfzjkvuan.supabase.co",   
  "sb_secret_aIhn55ueLbZY0FPOjAVjxQ_aMePvFFQ"
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
