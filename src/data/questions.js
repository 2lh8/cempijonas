// Julijos & Jono viktorina – "Kas nori tapti milijonieriumi?"
// Teisingi atsakymai eilės tvarka: D, A, B, A, C, D, A, C, B, D, A, D, B

const questions = [
  // 1 – €100
  {
    question: "Ką Julija pagalvojo pirmą kartą pamačiusi Joną?",
    options: [
      "Įdomus marškinių pasirinkimas",
      "Rūpestingas",
      "Ką jis pamatė Gintarėje?",
      "Kažkas kabina",
    ],
    correct: 3,
  },
  // 2 – €200
  {
    question: "Koks pirmas filmas, kurį žiūrėjote dviese?",
    options: ["Trainspotting", "Iron Claw", "Terminator", "5th Element"],
    correct: 0,
  },
  // 3 – €500
  {
    question: "Kokį daiktą Julija pasiimtų į negyvenamą salą?",
    options: [
      "SPF kremą",
      "Fotoaparatą (jei grįžtume iš salos)",
      "Peilį",
      "Degtinės butelį",
    ],
    correct: 1,
  },
  // 4 – €1,000
  {
    question: "Koks tavo drabužis labiausiai nepatinka Julijai?",
    options: ["M-1 maikės", "Juoda striukė", "Tapkės", "Sportinės kelnės"],
    correct: 0,
  },
  // 5 – €2,000 (saugus taškas)
  {
    question: "Kas Julijai yra didžiausia nepagarba santykiuose?",
    options: [
      "Dingimas be paaiškinimo",
      "Nemokėjimas susidėlioti prioritetų",
      "Melas",
      "Žeminimas prie kitų",
    ],
    correct: 2,
  },
  // 6 – €4,000
  {
    question: "Pasak Julijos, koks aktorius filme vaidintų Joną?",
    options: [
      "Johnny Depp (Fear and Loathing in Las Vegas)",
      "David Schwimmer (Rosas)",
      "Michael Scott",
      "Jim Carrey",
    ],
    correct: 3,
  },
  // 7 – €8,000
  {
    question: "Kur Julija norėtų gyventi, jei taptumėte milijonieriais?",
    options: [
      "Nuosavam name prie jūros",
      "Viennoje, Austrijoje",
      "Giedraičiuose",
      "Cape Town, P. Afrikoje",
    ],
    correct: 0,
  },
  // 8 – €16,000
  {
    question: "Koks Jono įprotis Juliją labiausiai erzina?",
    options: [
      '"Greitas" išsimaudymas vonioje',
      'Važiavimas į visas įmanomas parduotuves, dėl "gerų" akcijų',
      "Kai manęs 10k. per dieną prašo eiti pamiegoti pietų miego",
      "Labai garsiai klausytis muzikos",
    ],
    correct: 2,
  },
  // 9 – €32,000 (saugus taškas)
  {
    question: 'Koks Julijos mėgstamiausias maistas, kai ji nori „comfort food"?',
    options: ["Kebabas", "Bulvytės", "Pizza", "Barščiai"],
    correct: 1,
  },
  // 10 – €64,000
  {
    question: "Koks Julijos slaptas guilty pleasure?",
    options: [
      "Scrollinimas",
      "Ilgi skincare ritualai",
      "Britney Spears",
      "Pabūti vienai ir nieko nedaryti",
    ],
    correct: 3,
  },
  // 11 – €125,000
  {
    question: "Kaip Julija apibūdintų Joną trimis žodžiais?",
    options: [
      "Mylintis, rūpestingas, dosnus",
      "Juokingas, tvarkingas, undinas",
      "Sarkastiškas, netvarkingas, undinas",
      "Plepalas, svajotojas, undinas",
    ],
    correct: 0,
  },
  // 12 – €500,000
  {
    question: "Kokį pažadą sau Julija laiko svarbiausiu?",
    options: [
      "Gyventi sąmoningai ir sveikai",
      "Reguliariai sportuoti",
      "Šeima pirmoje vietoje",
      "Visi",
    ],
    correct: 3,
  },
  // 13 – €1,000,000
  {
    question: "Ką Julija labiausiai vertina žmonėse?",
    options: [
      "Grožį",
      "Kai jie yra tokie, kokie yra",
      "Iškalbą",
      "Humoro jausmą",
    ],
    correct: 1,
  },
];

export const MONEY_LADDER = Array(13).fill("Lygis");

// Saugūs taškai – klausimų indeksai (nuo 0)
export const SAFETY_NETS = [4, 8];

export default questions;
