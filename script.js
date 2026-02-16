const supabase = window.supabase.createClient(
  "https://ddzebzonhkghfzjkvuan.supabase.co",
  "sb_publishable_XEk9jtKJ__YwooQy-qU5ew_srAfLOnI"
);

// BOUTONS
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("saveBtn").addEventListener("click", saveScore);
document.getElementById("refreshBtn").addEventListener("click", loadLeaderboard);

// LOGIN
async function login() {
    const email = document.getElementById("email").value;

    await supabase.auth.signInWithOtp({ email: email });

    alert("Regarde tes mails pour te connecter !");
}

// SAVE SCORE
async function saveScore() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        alert("Tu dois être connecté !");
        return;
    }

    const score = document.getElementById("scoreInput").value;

    await supabase.from("scores").insert({
        user_id: userData.user.id,
        username: userData.user.email,
        score: score
    });

    alert("Score enregistré !");
}

// LOAD LEADERBOARD
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
