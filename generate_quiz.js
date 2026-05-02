const fs = require('fs');

const questionsData = [
  { q: "What subjects do you enjoy most?", o: ["Math & Computing", "Biology & Chemistry", "Economics & Accounts", "Literature & Design"], m: ["cs", "medical", "business", "arts"] },
  { q: "How do you spend free time?", o: ["Coding/Gaming", "Reading Science", "Following Markets", "Drawing/Music"], m: ["cs", "medical", "business", "arts"] },
  { q: "Ideal work environment?", o: ["Tech Hub/Lab", "Hospital/Clinic", "Corporate Office", "Design Studio"], m: ["engineering", "medical", "business", "arts"] },
  { q: "What problem do you like solving?", o: ["System Bugs", "Health Issues", "Financial Inefficiencies", "Creative Blocks"], m: ["cs", "medical", "business", "arts"] },
  { q: "What is your approach to work?", o: ["Logical & Analytical", "Caring & Precise", "Strategic & Organized", "Imaginative & Free"], m: ["engineering", "medical", "business", "arts"] },
  { q: "Who would you shadow?", o: ["Software Engineer", "Surgeon", "CEO", "Art Director"], m: ["cs", "medical", "business", "arts"] },
  { q: "Favorite type of news?", o: ["Tech Innovations", "Medical Breakthroughs", "Stock Market updates", "Cultural Events"], m: ["cs", "medical", "business", "arts"] },
  { q: "How do you handle a complex project?", o: ["Break it into algorithms", "Research case studies", "Create a business plan", "Brainstorm visually"], m: ["cs", "medical", "business", "arts"] },
  { q: "Which tool do you prefer?", o: ["Code Editor / CAD", "Microscope / Lab tools", "Spreadsheets", "Sketchpad / Camera"], m: ["engineering", "medical", "business", "arts"] },
  { q: "Best school subject?", o: ["Physics / IT", "Biology", "Business Studies", "Fine Arts"], m: ["cs", "medical", "business", "arts"] },
  { q: "Reaction to stressful situations?", o: ["Analyze logically", "Stay calm and help", "Manage resources", "Express through art"], m: ["engineering", "medical", "business", "arts"] },
  { q: "Favorite documentaries?", o: ["How things work / Tech", "Human body / Nature", "Startups / Economics", "History / Art"], m: ["engineering", "medical", "business", "arts"] },
  { q: "Preferred type of impact?", o: ["Building scalable systems", "Saving lives", "Growing economies", "Inspiring people"], m: ["cs", "medical", "business", "arts"] },
  { q: "Hobby preference?", o: ["Building PCs / Robotics", "Volunteering at clinic", "Trading / Investing", "Painting / Writing"], m: ["engineering", "medical", "business", "arts"] },
  { q: "Learning style?", o: ["Hands-on building", "Memorizing facts", "Case studies", "Visual observation"], m: ["cs", "medical", "business", "arts"] },
  { q: "Approach to planning?", o: ["Flowcharts", "Protocols", "Agendas / Budgets", "Mood boards"], m: ["cs", "medical", "business", "arts"] },
  { q: "Ideal team role?", o: ["Technical Lead", "Caregiver / Expert", "Project Manager", "Creative Director"], m: ["engineering", "medical", "business", "arts"] },
  { q: "What sounds like fun?", o: ["Hackathon", "First aid workshop", "Pitch competition", "Art exhibition"], m: ["cs", "medical", "business", "arts"] },
  { q: "Reaction to complex data?", o: ["Write a script to parse", "Look for biological patterns", "Calculate ROI", "Visualize it creatively"], m: ["cs", "medical", "business", "arts"] },
  { q: "Preferred conversation topic?", o: ["AI & Gadgets", "Health & Wellness", "Startups & Crypto", "Movies & Design"], m: ["cs", "medical", "business", "arts"] },
  { q: "Natural talent?", o: ["Math & Logic", "Empathy & Care", "Persuasion & Leadership", "Creativity & Aesthetics"], m: ["engineering", "medical", "business", "arts"] },
  { q: "What you value most?", o: ["Innovation", "Health", "Wealth", "Beauty"], m: ["cs", "medical", "business", "arts"] },
  { q: "Long-term career goal?", o: ["CTO / Lead Engineer", "Chief Medical Officer", "CEO / Founder", "Renowned Artist"], m: ["engineering", "medical", "business", "arts"] },
  { q: "Favorite TV show theme?", o: ["Sci-Fi / Hacking", "Medical Drama", "Corporate Drama", "Documentaries on Art"], m: ["cs", "medical", "business", "arts"] },
  { q: "If you had 1 million dollars?", o: ["Fund a tech startup", "Donate to medical research", "Invest in real estate", "Open an art gallery"], m: ["cs", "medical", "business", "arts"] }
];

let questionsArray = [];
let scoringObject = {};

questionsData.forEach((item, index) => {
  questionsArray.push(`    {
        question: '${item.q.replace(/'/g, "\\'")}',
        option1: '${item.o[0]}',
        option2: '${item.o[1]}',
        option3: '${item.o[2]}',
        option4: '${item.o[3]}',
        correctAnswer: '1',
        fieldTag: '${item.m[0]}',
        weight: 3,
    }`);
    
  scoringObject[index] = `{ 0: { ${item.m[0]}: 3 }, 1: { ${item.m[1]}: 3 }, 2: { ${item.m[2]}: 3 }, 3: { ${item.m[3]}: 3 } }`;
});

const newQuestionsCode = `const QUIZ_QUESTIONS = [\n${questionsArray.join(',\n')}\n];`;

let scoringLines = [];
for (let i = 0; i < 25; i++) {
    scoringLines.push(`    ${i}: ${scoringObject[i]},`);
}
const newScoringCode = `export const QUIZ_SCORING = {\n    // format: questionIndex -> { optionIndex -> { field: points } }\n${scoringLines.join('\n')}\n}`;

// Read and replace seed.js
let seedJs = fs.readFileSync('prisma/seed.js', 'utf8');
seedJs = seedJs.replace(/const QUIZ_QUESTIONS = \[[\s\S]*?\]/, newQuestionsCode);
fs.writeFileSync('prisma/seed.js', seedJs);

// Read and replace recommendation.js
let recJs = fs.readFileSync('lib/recommendation.js', 'utf8');
recJs = recJs.replace(/export const QUIZ_SCORING = \{[\s\S]*?\n\}/, newScoringCode);
fs.writeFileSync('lib/recommendation.js', recJs);

console.log("Updated seed.js and recommendation.js with 25 questions!");
