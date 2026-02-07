// Questions organized by difficulty (Easy, Medium, Hard, Expert, Final)
// Each question has: question text, 4 options, correct answer index (0-3)

const questions = [
  // Level 1 - $100 (Easy)
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct: 2,
  },
  // Level 2 - $200 (Easy)
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
  },
  // Level 3 - $300 (Easy)
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correct: 2,
  },
  // Level 4 - $500 (Easy)
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3,
  },
  // Level 5 - $1,000 (Easy - Safety Net)
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct: 2,
  },
  // Level 6 - $2,000 (Medium)
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
  },
  // Level 7 - $4,000 (Medium)
  {
    question: "In which year did the Titanic sink?",
    options: ["1905", "1912", "1920", "1898"],
    correct: 1,
  },
  // Level 8 - $8,000 (Medium)
  {
    question: "What is the smallest country in the world by area?",
    options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
    correct: 2,
  },
  // Level 9 - $16,000 (Medium)
  {
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Oxygen", "Carbon", "Hydrogen"],
    correct: 3,
  },
  // Level 10 - $32,000 (Medium - Safety Net)
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1,
  },
  // Level 11 - $64,000 (Hard)
  {
    question: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correct: 1,
  },
  // Level 12 - $125,000 (Hard)
  {
    question: "In computing, what does 'HTTP' stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Tech Transfer Process",
      "HyperText Transmission Platform",
      "High Transfer Text Protocol",
    ],
    correct: 0,
  },
  // Level 13 - $250,000 (Expert)
  {
    question: "Which scientist developed the theory of general relativity?",
    options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Max Planck"],
    correct: 2,
  },
  // Level 14 - $500,000 (Expert)
  {
    question: "What is the rarest blood type in humans?",
    options: ["O Negative", "AB Negative", "B Negative", "A Negative"],
    correct: 1,
  },
  // Level 15 - $1,000,000 (Final)
  {
    question: "In what year was the first successful human heart transplant performed?",
    options: ["1967", "1955", "1972", "1960"],
    correct: 0,
  },
];

export const MONEY_LADDER = [
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000",
  "$2,000",
  "$4,000",
  "$8,000",
  "$16,000",
  "$32,000",
  "$64,000",
  "$125,000",
  "$250,000",
  "$500,000",
  "$1,000,000",
];

export const SAFETY_NETS = [4, 9]; // indices of safety net levels (0-based)

export default questions;
