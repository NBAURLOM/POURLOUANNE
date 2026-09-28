const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const questions = [
  ["Comment tu te décrirais en trois mots ?", ["Calme", "Spontanée", "Curieuse", "Ça dépend du jour"]],
  ["Qu'est-ce qui te met instantanément de bonne humeur ?", ["Une bonne musique", "Rire avec quelqu'un", "Un bon repas", "Une petite attention"]],
  ["Tu es plutôt soirée tranquille ou sortie improvisée ?", ["Soirée tranquille", "Sortie improvisée", "Les deux", "Ça dépend avec qui"]],
  ["Quelle chanson pourrais-tu écouter encore et encore ?", ["Une chanson nostalgique", "Un classique", "Un son qui bouge", "Je change tout le temps"]],
  ["Quel petit plaisir tu assumes complètement ?", ["Manger", "Dormir", "Faire du shopping", "Regarder des séries"]],
  ["Quel endroit tu rêves de visiter ?", ["Une grande ville", "Une île", "Un endroit perdu", "Je veux tout voir"]],
  ["Plutôt plage ou montagne ?", ["🏖️ Plage", "🏔️ Montagne", "Les deux", "Aucun des deux"]],
  ["Quand tu as une journée libre, tu fais quoi ?", ["Je sors", "Je reste chez moi", "Je vois quelqu'un", "Je décide au dernier moment"]],
  ["Qu'est-ce qui compte vraiment pour toi chez une personne ?", ["La confiance", "L'humour", "La sincérité", "L'attention"]],
  ["Tu accordes facilement ta confiance ?", ["Oui", "Pas vraiment", "Avec le temps", "Ça dépend"]],
  ["Quand quelque chose te dérange, tu en parles ?", ["Directement", "J'attends", "Je garde pour moi", "Ça dépend"]],
  ["Qu'est-ce que les gens comprennent souvent mal chez toi ?", ["Mon caractère", "Mon silence", "Mon humour", "Je ne sais pas encore"]],
  ["Tu préfères recevoir de l'affection ou en donner ?", ["En recevoir", "En donner", "Les deux", "Ça dépend"]],
  ["Qu'est-ce qui peut vraiment te faire rire ?", ["L'humour absurde", "Les petites situations", "Les gens que j'aime", "Presque tout"]],
  ["Quel est ton genre de journée parfaite ?", ["Sortir", "Rester tranquille", "Voyager", "Improviser"]],
  ["Qu'est-ce qui te fait te sentir vraiment appréciée ?", ["Les mots", "Les actes", "Les petites attentions", "Le temps passé ensemble"]],
  ["Quelle qualité tu recherches le plus chez quelqu'un ?", ["L'écoute", "La loyauté", "L'humour", "La douceur"]],
  ["Qu'est-ce qui peut réellement te toucher ?", ["Une attention inattendue", "Une conversation", "Un geste simple", "Un souvenir"]],
  ["Tu penses qu'on peut vraiment connaître quelqu'un à 100 % ?", ["Oui", "Non", "Jamais complètement", "Je ne sais pas"]],
  ["Qu'est-ce que tu aimerais qu'une personne comprenne de toi sans que tu aies à l'expliquer ?", ["Ma façon de penser", "Mes émotions", "Mes silences", "Tout"]],
  ["Quel rêve tu aimerais absolument réaliser ?", ["Voyager", "Un projet personnel", "Une vie tranquille", "Encore à trouver"]],
  ["Qu'est-ce qui te rend réellement heureuse ?", ["Les gens que j'aime", "Les petits moments", "Réussir quelque chose", "Un peu de tout"]],
  ["Quelle version de toi aimerais-tu devenir dans quelques années ?", ["Plus libre", "Plus sereine", "Plus ambitieuse", "Je veux surtout rester moi-même"]],
  ["Si quelqu'un voulait vraiment apprendre à te connaître, qu'est-ce que tu aimerais qu'il découvre en premier ?", ["Ma personnalité", "Mes passions", "Ma façon d'aimer", "Tout doucement, au fil du temps"]]
];

let qi = 0;
const answers = {};
let pauseSeen = false;
function renderQuestion() {
  const [q, opts] = questions[qi];
  $("#qNumber").textContent = String(qi+1).padStart(2,"0");
  $("#qCount").textContent = `/ ${questions.length}`;
  $("#questionText").textContent = q;
  $("#answers").innerHTML = opts.map(o => `<button class="answer">${o}</button>`).join("");
  $("#questionProgress").style.width = `${((qi+1)/questions.length)*100}%`;
  $("#customAnswer").value = answers[qi]?.custom || "";
  $$(".answer").forEach(btn => btn.addEventListener("click", () => chooseAnswer(btn.textContent)));
}
function chooseAnswer(value) {
  answers[qi] = {value};
  nextQuestion();
}
function customAnswer() {
  const v = $("#customAnswer").value.trim();
  if(v) { answers[qi] = {custom:v}; nextQuestion(); }
}
function nextQuestion() {
  $("#questionCard").classList.remove("reveal");
  $("#questionCard").style.opacity = "0";
  $("#questionCard").style.transform = "translateY(15px)";
  setTimeout(() => {
    if(!pauseSeen && qi === 7) {
      pauseSeen = true;
      qi++;
      renderQuestion();


      $("#questionCard").style.opacity = "1";
      $("#questionCard").style.transform = "none";
      go("pause");
      return;
    }
    if(qi < questions.length-1) qi++;
    else {
      go("gallery");
      return;
    }
    renderQuestion();
    $("#questionCard").style.opacity = "1";
    $("#questionCard").style.transform = "none";
  }, 250);
}
$("#customBtn").addEventListener("click", customAnswer);
$("#customAnswer").addEventListener("keydown", e => { if(e.key === "Enter") customAnswer(); });
renderQuestion();

$$(".flip-card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});

function go(id) {
  const target = document.getElementById(id);
  if (!target) return;
  $$(".screen").forEach(s => s.classList.remove("active"));
  target.classList.add("active");
  window.scrollTo(0, 0);
  updateProgress();
}
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".next");
  if (!btn) return;
  event.preventDefault();
  event.stopPropagation();
  if (btn.id === "finalFromSummary" || btn.classList.contains("disabled")) return;

  const target = btn.dataset.target;
  if (!target) return;

  if (target === "questions" && pauseSeen) {
    go("questions");
    renderQuestion();
  } else {
    go(target);
  }
});
function updateProgress(){
  const ids=["intro","questions","pause","gallery","proof","activities","calendar","summary","message","final"];
  const current = Math.max(0, ids.indexOf($$(".screen.active")[0]?.id || "intro"));
  $("#progressBar").style.width = `${(current/(ids.length-1))*100}%`;
}
// Les écrans sont contrôlés uniquement par les boutons / réponses.

let selectedActivity = "";
$$(".activity-card").forEach(card => card.addEventListener("click", () => {
  $$(".activity-card").forEach(c=>c.classList.remove("selected"));
  card.classList.add("selected");
  selectedActivity = card.dataset.activity;
  $("#selectedActivity").textContent = `Tu as choisi : ${selectedActivity} ✨`;
  $("#activityNext").classList.remove("disabled");
}));

// Calendar
let viewDate = new Date();
viewDate.setDate(1);
let chosenDate = null;
function renderCalendar(){
  const monthNames=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  $("#monthLabel").textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const last = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 0);
  let start = (first.getDay()+6)%7;
  let html="";
  const prevLast = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
  for(let i=start-1;i>=0;i--) html += `<button class="day muted">${prevLast-i}</button>`;
  const today = new Date(); today.setHours(0,0,0,0);
  for(let d=1;d<=last.getDate();d++){
    const dt = new Date(viewDate.getFullYear(),viewDate.getMonth(),d);
    const past = dt < today;
    const isToday = dt.getTime()===today.getTime();
    const isSel = chosenDate && dt.getTime()===chosenDate.getTime();
    html += `<button class="day ${past?"muted":""} ${isToday?"today":""} ${isSel?"selected":""}" ${past?"disabled":""} data-day="${d}">${d}</button>`;
  }
  const total = start + last.getDate();
  const remain = (7-total%7)%7;
  for(let d=1;d<=remain;d++) html += `<button class="day muted">${d}</button>`;
  $("#days").innerHTML=html;
  $$("#days .day:not(.muted)").forEach(btn => btn.addEventListener("click",()=>{
    chosenDate = new Date(viewDate.getFullYear(),viewDate.getMonth(),Number(btn.dataset.day));
    renderCalendar();
    const label=chosenDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    $("#dateSelected").textContent = `Date choisie : ${label}`;
    $("#dateNext").classList.remove("disabled");
  }));
}
$("#prevMonth").addEventListener("click",()=>{viewDate.setMonth(viewDate.getMonth()-1);renderCalendar()});
$("#nextMonth").addEventListener("click",()=>{viewDate.setMonth(viewDate.getMonth()+1);renderCalendar()});
renderCalendar();

$("#dateNext").addEventListener("click",()=>{
  if(!chosenDate || !selectedActivity) return;
  const date=chosenDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  $("#choiceSummary").textContent=`Tu as choisi ${selectedActivity} — ${date}. ✨`;
  $("#choiceSummary").classList.add("show");
});

$("#finalBtn").addEventListener("click",()=>{
  buildSummary();
  go("summary");
});


/* ---------- Fin du parcours : calendrier -> message -> résumé -> fin ---------- */

$("#dateNext").addEventListener("click", (event) => {
  event.preventDefault();
  if (!chosenDate || !selectedActivity) return;

  const date = chosenDate.toLocaleDateString("fr-FR", {
    weekday:"long", day:"numeric", month:"long"
  });
  $("#choiceSummary").textContent = `Tu as choisi ${selectedActivity} — ${date}. ✨`;
  $("#choiceSummary").classList.add("show");
  go("message");
});

function buildSummary() {
  const container = $("#summaryAnswers");
  if (!container) return;

  container.innerHTML = "";

  questions.forEach(([question], index) => {
    const answer = answers[index];
    if (!answer) return;

    const value = answer.value || answer.custom || "";
    const row = document.createElement("div");
    row.className = "summary-answer";
    row.innerHTML = `
      <span class="num">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <div class="question">${question}</div>
        <div class="answer-value">${value}</div>
      </div>
    `;
    container.appendChild(row);
  });

  const date = chosenDate
    ? chosenDate.toLocaleDateString("fr-FR", {
        weekday:"long", day:"numeric", month:"long"
      })
    : "date à choisir";

  $("#summaryPlan").textContent = selectedActivity
    ? `${selectedActivity} · ${date} ✨`
    : "Une petite sortie à choisir ✨";
}

$("#finalBtn").addEventListener("click", (event) => {
  event.preventDefault();
  buildSummary();
  go("summary");
});

$("#finalFromSummary").addEventListener("click", (event) => {
  event.preventDefault();
  go("final");
});

/* Partage / sauvegarde du résumé en image */
async function makeSummaryImage() {
  const canvas = document.createElement("canvas");
  const width = 1200;
  const pad = 70;
  const rows = questions
    .map(([question], index) => ({
      question,
      answer: answers[index]
    }))
    .filter(item => item.answer);

  const rowHeight = 78;
  canvas.width = width;
  canvas.height = Math.max(850, 180 + rows.length * rowHeight + 130);

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff5f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#3b2028";
  ctx.font = "600 20px Arial";
  ctx.fillText("POUR LOUANNE", pad, 55);

  ctx.fillStyle = "#b45d78";
  ctx.font = "42px Georgia";
  ctx.fillText("♡", width - pad - 28, 58);

  ctx.fillStyle = "#3b2028";
  ctx.font = "500 42px Georgia";
  ctx.fillText("Ce que j'ai découvert de toi", pad, 115);

  let y = 165;
  rows.forEach((row, index) => {
    const value = row.answer.value || row.answer.custom || "";

    ctx.fillStyle = "#b18a96";
    ctx.font = "14px Arial";
    ctx.fillText(String(index + 1).padStart(2, "0"), pad, y);

    ctx.fillStyle = "#92727c";
    ctx.font = "14px Arial";
    ctx.fillText(row.question.slice(0, 105), pad + 42, y);

    ctx.fillStyle = "#4f2e38";
    ctx.font = "600 16px Arial";
    ctx.fillText(value.slice(0, 105), pad + 42, y + 27);

    ctx.strokeStyle = "#efdfe4";
    ctx.beginPath();
    ctx.moveTo(pad, y + 48);
    ctx.lineTo(width - pad, y + 48);
    ctx.stroke();

    y += rowHeight;
  });

  const date = chosenDate
    ? chosenDate.toLocaleDateString("fr-FR", {
        weekday:"long", day:"numeric", month:"long"
      })
    : "date à choisir";

  ctx.fillStyle = "#f9e5ea";
  ctx.fillRect(pad, y + 5, width - pad * 2, 70);
  ctx.fillStyle = "#633c49";
  ctx.font = "600 17px Arial";
  ctx.fillText(
    selectedActivity ? `${selectedActivity} · ${date} ✨` : "Une petite sortie à choisir ✨",
    pad + 18,
    y + 48
  );

  return new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
}

$("#shareSummary").addEventListener("click", async () => {
  const blob = await makeSummaryImage();
  if (!blob) return;

  const file = new File([blob], "louanne-resume.png", {type:"image/png"});

  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({files:[file]})
  ) {
    await navigator.share({
      title: "Mon résumé pour Louanne",
      files: [file]
    });
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "louanne-resume.png";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});

/* Vidéo — compatible mobile / GitHub Pages */
const video = $("#pauseVideo");
const videoPlaceholder = $("#videoPlaceholder");

if (video) {
  video.addEventListener("loadedmetadata", () => {
    if (videoPlaceholder) videoPlaceholder.style.display = "none";
  });

  video.addEventListener("canplay", () => {
    if (videoPlaceholder) videoPlaceholder.style.display = "none";
  });

  video.addEventListener("error", () => {
    if (videoPlaceholder) {
      videoPlaceholder.style.display = "flex";
      videoPlaceholder.querySelector("strong").textContent = "Vidéo indisponible";
      videoPlaceholder.querySelector("small").textContent = "Vérifie que moment-de-pause.mp4 est bien dans assets/videos/";
    }
  });

  if (videoPlaceholder) {
    videoPlaceholder.addEventListener("click", () => {
      video.play().catch(() => {});
      videoPlaceholder.style.display = "none";
    });
  }
}

/* Reprise après la vidéo */
const resumeBtn = document.querySelector("#pause .next");
if (resumeBtn) {
  resumeBtn.addEventListener("click", event => {
    event.preventDefault();
    if (pauseSeen) {
      go("questions");
      renderQuestion();
    }
  });
}
