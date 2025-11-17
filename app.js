// Read values
function getSymptoms() {
  return Array.from(document.querySelectorAll(".symptom"))
    .filter(b => b.checked)
    .map(b => b.value);
}
function getOtherNote() {
  return document.getElementById("otherNote").value.trim();
}

// Risks
function buildRisks(symptoms, note){
  const risks = [];
  if (symptoms.includes("double")) risks.push("Duplicate labels and synonym conflicts confuse users and systems.");
  if (symptoms.includes("outdated")) risks.push("Outdated or insensitive labels reduce trust in the source.");
  if (symptoms.includes("no-owner")) risks.push("Without a clear owner, quality and cadence are not guaranteed.");
  if (symptoms.includes("no-links")) risks.push("Without links to external vocabularies, interoperability suffers.");
  if (symptoms.includes("not-findable")) risks.push("Poor findability makes the source effectively unusable.");
  if (symptoms.includes("overlap")) risks.push("Overlapping sources create noise and inconsistent usage.");
  if (symptoms.includes("no-log")) risks.push("No change log means decisions and errors cannot be reconstructed.");
  if (note) risks.push("Field note: " + note);
  if (!risks.length) risks.push("No immediate risks noted. The source appears stable; schedule regular reviews.");
  return risks;
}

// Status
function determineStatus(symptomCount){
  if (symptomCount === 0) return "Relatively stable; light maintenance recommended.";
  if (symptomCount <= 2) return "Mild irritation. Clear improvements possible without major risk.";
  if (symptomCount <= 4) return "Structural concerns. Focused effort needed to keep the source healthy.";
  return "Red alert. Combine fixes and governance to stabilize quickly.";
}

// Summary
function buildSummary(orgType, sourceName, status){
  const name = sourceName || "your terminology source";
  const org = orgType || "your organization";
  return `McCoy examined ${name} within ${org}. Status: ${status} Focus on ownership, quality and linking so users trust and reuse your terms.`;
}

// Advice
function buildAdvice(symptoms){
  const blocks = [];

  if (symptoms.includes("double")){
    blocks.push({
      title: "Duplicate terms / synonym conflicts",
      text: [
        "Pick one preferred label per concept; store alternates as synonyms.",
        "Record who decides preferred labels and why.",
        "Communicate preferred labels to editorial and data teams."
      ]
    });
  }
  if (symptoms.includes("outdated")){
    blocks.push({
      title: "Outdated / insensitive labels",
      text: [
        "Schedule a content review with domain experts.",
        "Mark deprecated labels and point to the current ones.",
        "Check if sensitive or outdated phrases still appear in products."
      ]
    });
  }
  if (symptoms.includes("no-owner")){
    blocks.push({
      title: "No clear owner / steward",
      text: [
        "Assign a role (not a single person) as formal steward.",
        "Define review cadence and decision process.",
        "Document how new terms are proposed and approved."
      ]
    });
  }
  if (symptoms.includes("no-links")){
    blocks.push({
      title: "Few or no external links",
      text: [
        "Choose 1–2 external vocabularies that fit your domain.",
        "Start mapping a small core set with stable URIs.",
        "Document which source is authoritative per domain."
      ]
    });
  }
  if (symptoms.includes("not-findable")){
    blocks.push({
      title: "Poor findability",
      text: [
        "Run quick user tests: how do people actually search.",
        "Ensure systems index both preferred labels and synonyms.",
        "Adjust unhelpful labels that users never search for."
      ]
    });
  }
  if (symptoms.includes("overlap")){
    blocks.push({
      title: "Overlapping sources",
      text: [
        "Inventory all sources and their intended scope.",
        "Pick a leading source per domain.",
        "In non-leading sources: refer to the preferred term in the leading source."
      ]
    });
  }
  if (symptoms.includes("no-log")){
    blocks.push({
      title: "No or limited change log",
      text: [
        "Ensure each change has a date and actor.",
        "Maintain a human-readable changelog for major updates.",
        "Add short rationales for sensitive changes."
      ]
    });
  }

  if (!blocks.length){
    blocks.push({
      title: "No urgent issues",
      text: [
        "The source appears stable.",
        "Plan at least two fixed reviews per year.",
        "Keep ownership and decision rules explicit."
      ]
    });
  }

  return blocks;
}

// Render
function renderList(el, items){
  el.innerHTML = "";
  items.forEach(txt => {
    const li = document.createElement("li");
    li.textContent = txt;
    el.appendChild(li);
  });
}
function renderAdvice(container, blocks){
  container.innerHTML = "";
  blocks.forEach(block => {
    const wrap = document.createElement("div");
    wrap.className = "advice-item";

    const titleEl = document.createElement("div");
    titleEl.className = "advice-title";
    titleEl.textContent = block.title;
    wrap.appendChild(titleEl);

    const ul = document.createElement("ul");
    ul.className = "advice-text";
    block.text.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    wrap.appendChild(ul);

    container.appendChild(wrap);
  });
}

// Sounds (optional)
function playScan(){
  try{ new Audio("assets/scan-beep.mp3").play(); }catch(e){}
}
function playAlert(){
  try{ new Audio("assets/red-alert.mp3").play(); }catch(e){}
}

// PDF
async function exportPdf(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const orgType = document.getElementById("orgType").value || "(unknown)";
  const sourceName = document.getElementById("sourceName").value || "(unknown)";
  const sourceAge = document.getElementById("sourceAge").value || "(unknown)";
  const changes = document.getElementById("changes").value || "(unknown)";
  const status = document.getElementById("diagnosisStatus").textContent || "(no status)";

  const riskEls = document.querySelectorAll("#riskList li");
  const risks = Array.from(riskEls).map(li => li.textContent);

  const adviceEls = document.querySelectorAll(".advice-item");

  let y = 12;
  doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  doc.text("Starfleet Medical Log – Terminology Assessment", 10, y); y+=8;

  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`Organization: ${orgType}`, 10, y); y+=5;
  doc.text(`Source: ${sourceName}`, 10, y); y+=5;
  doc.text(`In use since: ${sourceAge}`, 10, y); y+=5;
  doc.text(`Major revisions: ${changes}`, 10, y); y+=8;

  doc.setFont("helvetica", "bold"); doc.text("Status", 10, y); y+=6;
  doc.setFont("helvetica", "normal");
  doc.splitTextToSize(status, 180).forEach(line => { doc.text(line, 10, y); y+=5; }); y+=3;

  doc.setFont("helvetica", "bold"); doc.text("Key risks", 10, y); y+=6;
  doc.setFont("helvetica", "normal");
  risks.forEach(r => {
    if (y > 270){ doc.addPage(); y=12; }
    doc.splitTextToSize("• " + r, 180).forEach(line => { doc.text(line, 10, y); y+=5; });
  });
  y+=6;

  doc.setFont("helvetica", "bold"); doc.text("Treatment plan", 10, y); y+=6;
  doc.setFont("helvetica", "normal");
  adviceEls.forEach(block => {
    if (y > 260){ doc.addPage(); y=12; }
    const title = block.querySelector(".advice-title")?.textContent || "";
    if (title){ doc.setFont("helvetica","bold"); doc.text("• " + title, 10, y); y+=5; }
    doc.setFont("helvetica","normal");
    block.querySelectorAll("li").forEach(li => {
      if (y > 270){ doc.addPage(); y=12; }
      doc.splitTextToSize("   " + li.textContent, 180).forEach(line => { doc.text(line, 10, y); y+=5; });
    });
    y+=3;
  });

  y+=8;
  doc.setFont("helvetica","normal");
  doc.text("McCoy’s verdict: This source is treatable. With ownership, cadence and careful linking,", 10, y); y+=5;
  doc.text("it can operate at Starfleet standards.", 10, y);

  doc.save("Starfleet_Medical_Log_Terminology.pdf");
}

// Events
document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scanBtn");
  const pdfBtn = document.getElementById("pdfBtn");

  scanBtn.addEventListener("click", () => {
    const symptoms = getSymptoms();
    const note = getOtherNote();

    const risks = buildRisks(symptoms, note);
    const status = determineStatus(symptoms.length);

    const orgType = document.getElementById("orgType").value;
    const sourceName = document.getElementById("sourceName").value;

    const summary = buildSummary(orgType, sourceName, status);

    document.getElementById("diagnosisStatus").textContent = status;
    document.getElementById("statusPill").textContent = status;
    renderList(document.getElementById("riskList"), risks);
    document.getElementById("summary").textContent = summary;

    const advice = buildAdvice(symptoms);
    renderAdvice(document.getElementById("adviceList"), advice);

    document.getElementById("diagnosis").classList.remove("hidden");
    document.getElementById("advice").classList.remove("hidden");

    playScan();
    if (symptoms.length >= 5) playAlert();
  });

  pdfBtn.addEventListener("click", exportPdf);
});
