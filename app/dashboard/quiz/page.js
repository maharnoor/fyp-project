'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Target, CheckCircle, Trophy, ArrowRight, RotateCcw, Brain, Lightbulb } from 'lucide-react'
import FieldIcon, { getFieldColor } from '@/components/ui/FieldIcon'

// Question bank — randomly sampled per attempt so retakes feel fresh.
// Each option's fieldTag determines which career field gets a point.
const QUESTION_BANK = [
    {
        id: 'q1',
        question: 'Which of these subjects do you enjoy the most?',
        options: ['Mathematics & Logic', 'Biology & Chemistry', 'Economics & Accounting', 'Art & Literature'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q2',
        question: 'What type of problem do you find most satisfying to solve?',
        options: ['Writing and debugging code', "Diagnosing a patient's illness", 'Planning a business strategy', 'Creating a design or artwork'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q3',
        question: 'How do you prefer to spend your free time?',
        options: ['Building apps or gaming', 'Reading health/science articles', 'Watching business/finance content', 'Sketching, painting or photography'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q4',
        question: 'Which career environment appeals to you most?',
        options: ['Tech startup or software company', 'Hospital or clinic', 'Corporate office or bank', 'Design studio or media agency'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q5',
        question: 'What is your approach to working with others?',
        options: ['Prefer working independently with technical tools', 'Enjoy helping and caring for people', 'Lead teams and manage projects', 'Collaborate creatively with a team'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q6',
        question: 'Which of the following skills comes most naturally to you?',
        options: ['Logical reasoning and algorithms', 'Memorization and attention to detail', 'Persuasion and negotiation', 'Visual creativity and imagination'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q7',
        question: 'Which subject were you best at in school?',
        options: ['Physics & Math', 'Biology', 'Any — I was well-rounded', 'Social studies & languages'],
        fieldTags: ['engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 'q8',
        question: 'Imagine your ideal workday — which fits best?',
        options: ['Coding and solving technical problems', 'Examining and treating patients', 'Attending meetings and closing deals', 'Designing visuals or writing creatively'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q9',
        question: 'What is most important to you in a career?',
        options: ['Innovation and building new things', 'Saving lives and making a health impact', 'Financial success and leadership', 'Creative expression and recognition'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q10',
        question: 'If you could shadow a professional for a day, who would it be?',
        options: ['A software engineer at Google', 'A surgeon at a top hospital', 'A CEO of a successful startup', 'A creative director at an ad agency'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q11',
        question: 'Which type of book or article would you pick up first?',
        options: ['A guide on machine learning', 'A medical case study', 'A biography of a successful entrepreneur', 'A photography or design magazine'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q12',
        question: 'Which kind of challenge excites you the most?',
        options: ['Building a robot or automated system', 'Researching a cure for a disease', 'Launching a new product into the market', 'Designing a beautiful brand identity'],
        fieldTags: ['engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 'q13',
        question: 'How do you prefer to express your ideas?',
        options: ['Through code and technical diagrams', 'Through detailed reports and analysis', 'Through pitches and presentations', 'Through visuals, stories or music'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q14',
        question: 'Which tool would you most enjoy mastering?',
        options: ['VS Code / GitHub', 'Stethoscope / lab equipment', 'Excel / financial dashboards', 'Photoshop / Illustrator'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q15',
        question: 'Which YouTube channel are you most likely to subscribe to?',
        options: ['Fireship / Coding tutorials', 'Doctor Mike / Med school vlogs', 'Y Combinator / Startup advice', 'Procreate / Art tutorials'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q16',
        question: 'Pick the achievement that would make you proudest:',
        options: ['Launching a popular app', 'Saving a patient\'s life', 'Building a profitable company', 'Winning a design or art award'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q17',
        question: 'Which of these university degrees sounds most exciting?',
        options: ['BS Computer Science', 'MBBS', 'BBA / Finance', 'BFA / Architecture'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q18',
        question: 'Which engineering branch sounds most interesting to you?',
        options: ['Software / AI', 'Biomedical', 'Industrial / Management', 'Architecture & Design'],
        fieldTags: ['cs', 'engineering', 'business', 'arts'],
    },
    {
        id: 'q19',
        question: 'Which kind of teamwork do you enjoy?',
        options: ['Hackathons and coding sprints', 'Hospital rounds with doctors', 'Boardroom meetings and strategy', 'Creative brainstorming sessions'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q20',
        question: 'What kind of impact do you want to make?',
        options: ['Build technology that changes lives', 'Improve health and well-being', 'Drive economic growth and jobs', 'Inspire people through creativity'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q21',
        question: 'Which type of news do you follow most closely?',
        options: ['Tech & AI breakthroughs', 'Healthcare & medicine', 'Stock market & business', 'Film, fashion & culture'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q22',
        question: 'Pick the side project you\'d most enjoy:',
        options: ['Building your own website or game', 'Volunteering at a clinic', 'Selling something online', 'Starting a YouTube or art channel'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q23',
        question: 'Which class would you take as an elective?',
        options: ['Data Structures', 'Human Anatomy', 'Marketing 101', 'Drawing & Composition'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q24',
        question: 'Which famous figure do you admire the most?',
        options: ['Elon Musk / Bill Gates', 'Abdul Sattar Edhi / a renowned doctor', 'Warren Buffett / Jeff Bezos', 'Sadequain / a famous artist'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q25',
        question: 'Which event would you most enjoy attending?',
        options: ['A tech conference', 'A medical seminar', 'A business summit', 'An art exhibition'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q26',
        question: 'Which app do you find yourself using the most?',
        options: ['GitHub or Stack Overflow', 'WebMD or health trackers', 'LinkedIn or finance apps', 'Pinterest or Behance'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q27',
        question: 'Pick the gift you would love to receive:',
        options: ['A high-end laptop', 'A microscope or anatomy atlas', 'A premium suit or leather planner', 'A sketchbook and pro art supplies'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q28',
        question: 'The best part of your school day was usually:',
        options: ['Computer lab', 'Biology lab', 'Debating or commerce club', 'Art class'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q29',
        question: 'If you started a company, what would it do?',
        options: ['Build a SaaS product', 'Run a healthcare clinic', 'Sell consumer products online', 'Create a creative studio'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q30',
        question: 'Which subject did you struggle with the least?',
        options: ['Math', 'Biology', 'Economics', 'English Literature'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q31',
        question: 'How do you usually tackle a difficult problem?',
        options: ['Build a tool to automate it', 'Research the symptoms carefully', 'Plan a step-by-step strategy', 'Reframe it creatively'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q32',
        question: 'Which workspace makes you happiest?',
        options: ['A desk with multiple monitors', 'A clean hospital ward', 'A modern boardroom', 'A bright studio with natural light'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q33',
        question: 'Pick a vacation activity you would love:',
        options: ['Joining a hackathon', 'Volunteering at a medical camp', 'Attending a networking event', 'Going on an art retreat'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q34',
        question: 'Which feels like a fun puzzle to you?',
        options: ['Debugging a tricky bug', 'Diagnosing a rare illness', 'Optimizing a budget', 'Composing a song or poem'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q35',
        question: 'Which class assignment would you actually enjoy?',
        options: ['Build a chatbot', 'Dissect a frog or run a lab experiment', 'Write a business plan', 'Paint a self-portrait'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q36',
        question: 'What is your dream company to work at?',
        options: ['Google or Microsoft', 'Aga Khan University Hospital', 'Goldman Sachs or McKinsey', 'Pixar or a top design firm'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q37',
        question: 'Which book genre do you prefer?',
        options: ['Sci-fi or tech non-fiction', 'Medical thrillers or science', 'Business biographies', 'Poetry or literary fiction'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q38',
        question: 'Which social-media post would you most likely share?',
        options: ['A coding tutorial', 'A health & wellness tip', 'An investment insight', 'An art process video'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q39',
        question: 'Which best describes your communication style?',
        options: ['Precise and logical', 'Caring and informative', 'Confident and persuasive', 'Expressive and emotional'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q40',
        question: 'Which kind of game do you enjoy most?',
        options: ['Strategy or coding games', 'Trivia / general knowledge', 'Monopoly or business sims', 'Drawing or storytelling games'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q41',
        question: 'What do you usually doodle in class?',
        options: ['Code snippets or flowcharts', 'Diagrams of organs', 'Charts and numbers', 'Faces, scenes or shapes'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q42',
        question: 'How would you spend a free rainy weekend?',
        options: ['Coding a side project', 'Reading medical articles', 'Studying market trends', 'Painting or photography'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q43',
        question: 'Which competition would you compete in?',
        options: ['ICPC coding contest', 'Science olympiad', 'Business case competition', 'Art exhibition'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q44',
        question: 'Which of these would you call your superpower?',
        options: ['Logical thinking', 'Memory and recall', 'Influence and leadership', 'Creativity and imagination'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q45',
        question: 'Pick the word that best describes you:',
        options: ['Analytical', 'Caring', 'Ambitious', 'Imaginative'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q46',
        question: 'Which workplace dress code suits you best?',
        options: ['Casual hoodie and jeans', 'White lab coat or scrubs', 'Formal suit', 'Trendy / creative fashion'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q47',
        question: 'Which "language" excites you the most?',
        options: ['Python or JavaScript', 'Latin medical terminology', 'The language of finance and markets', 'Visual / design language'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q48',
        question: 'Pick an Instagram theme you would run:',
        options: ['Tech tips and dev memes', 'Health & wellness', 'Money and side hustles', 'Aesthetic photography'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q49',
        question: 'Which podcast are you most likely to enjoy?',
        options: ['Lex Fridman / tech podcasts', 'Huberman Lab / health science', 'How I Built This / startups', '99% Invisible / design'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q50',
        question: 'Where would you most enjoy interning?',
        options: ['A tech firm', 'A hospital or research lab', 'A corporate office or bank', 'A design studio or agency'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q51',
        question: 'Which talent do you wish you had more of?',
        options: ['Coding mastery', 'Surgical precision', 'Charisma and leadership', 'Artistic flair'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q52',
        question: 'What energizes you the most?',
        options: ['Solving a hard algorithm', 'Helping someone heal', 'Closing a big deal', 'Finishing a creative work'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q53',
        question: 'What would you teach a workshop on?',
        options: ['Programming basics', 'Human anatomy or first aid', 'Personal finance', 'Drawing or design'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q54',
        question: 'Which gift card would you choose?',
        options: ['Steam / coding course platform', 'Medical bookstore', 'Bloomberg or business books', 'Behance Pro / art supplies'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q55',
        question: 'Which type of team do you thrive in?',
        options: ['A small dev team', 'A medical squad', 'A cross-functional business org', 'A creative collective'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q56',
        question: 'Which school project memory do you cherish?',
        options: ['Building a robot or app', 'A microscopy or chemistry lab', 'A stock market simulation', 'Designing a poster or play'],
        fieldTags: ['engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 'q57',
        question: 'Which documentary would you want to watch?',
        options: ['The Social Dilemma', 'Pandemic / Virus Hunters', 'Inside Bill\'s Brain', 'Abstract: The Art of Design'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q58',
        question: 'Which Pakistani institution inspires you most?',
        options: ['NUST / FAST', 'AKU / AIMC', 'IBA / LUMS', 'NCA / Indus Valley'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q59',
        question: 'Which feels most rewarding to you?',
        options: ['Shipping a feature users love', 'Healing a patient', 'Hitting a revenue target', 'Showing your art to an audience'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q60',
        question: 'Pick the news topic that grabs your attention:',
        options: ['AI advancements', 'Health breakthroughs', 'Stock movements', 'Cultural events'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q61',
        question: 'Which entrance exam would you target?',
        options: ['NUST / FAST entrance test', 'MDCAT', 'GMAT or IBA test', 'NCA art admission test'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q62',
        question: 'Which feels more like fun than work?',
        options: ['Building websites or apps', 'Studying diseases and biology', 'Reading P&L statements', 'Writing or sketching'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q63',
        question: 'What do you binge-watch most?',
        options: ['Mr. Robot / Silicon Valley', 'Grey\'s Anatomy / House MD', 'Shark Tank / Suits', 'Drive to Survive / art docs'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q64',
        question: 'Which event would you cover as a journalist?',
        options: ['Apple keynote', 'WHO press conference', 'World Economic Forum', 'Cannes film festival'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q65',
        question: 'Which of these motivates you the most?',
        options: ['Building something useful', 'Saving lives', 'Creating wealth', 'Expressing yourself'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q66',
        question: 'Pick the puzzle type you\'d try first:',
        options: ['Logic / coding puzzles', 'Patient case puzzles', 'Strategic resource puzzles', 'Visual / spatial puzzles'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q67',
        question: 'Which scholarship would you target?',
        options: ['HEC tech scholarship', 'MBBS scholarship', 'Fulbright business scholarship', 'Art residency abroad'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q68',
        question: 'Which kind of internship excites you most?',
        options: ['Open-source contributor', 'Hospital observership', 'Startup grind', 'Studio apprenticeship'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q69',
        question: 'Pick a dream city to work in:',
        options: ['San Francisco (tech)', 'Boston (medical)', 'New York (finance)', 'Paris (art & design)'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q70',
        question: 'What counts as "interesting data" to you?',
        options: ['Server logs and metrics', 'Patient symptoms', 'Sales numbers', 'Color palettes and moodboards'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q71',
        question: 'What is usually inside your bag?',
        options: ['Laptop and charger', 'Notebook with biology notes', 'Planner and calculator', 'Sketchbook and pens'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q72',
        question: 'Which question would you research first?',
        options: ['How will AI change jobs?', 'How can we cure cancer?', 'How do markets really work?', 'How does art move emotions?'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q73',
        question: 'Pick the conference you\'d love to speak at:',
        options: ['Google I/O', 'TEDMED', 'World Economic Forum', 'Adobe MAX'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q74',
        question: 'Which classroom did you love the most?',
        options: ['Computer lab', 'Biology lab', 'Commerce class', 'Art room'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q75',
        question: 'What is your favorite internet rabbit hole?',
        options: ['Stack Overflow / GitHub', 'WebMD / PubMed', 'Bloomberg / business blogs', 'Behance / Pinterest'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q76',
        question: 'Which "hat" would you wear at a startup?',
        options: ['CTO / lead engineer', 'Chief Medical Officer', 'CEO / founder', 'Creative Director'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q77',
        question: 'Pick the Slack channel you\'d lurk in:',
        options: ['#engineering', '#research', '#growth', '#design'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q78',
        question: 'Which subject did classmates ask you for help with?',
        options: ['Math or computer', 'Biology or chemistry', 'Accounting or business studies', 'Drawing or English'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q79',
        question: 'What was your favorite hobby as a kid?',
        options: ['Taking apart electronics', 'Playing doctor with siblings', 'Selling candy or lemonade', 'Drawing or storytelling'],
        fieldTags: ['engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 'q80',
        question: 'Which TED Talk would you watch first?',
        options: ['On AI ethics', 'On gene editing', 'On entrepreneurship', 'On creativity'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q81',
        question: 'Which icon represents your interests best?',
        options: ['Laptop and code', 'Stethoscope and medicine', 'Charts and growth', 'Brush and palette'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q82',
        question: 'Which of these would you happily pay for?',
        options: ['Premium IDE / dev tools', 'A medical anatomy app', 'Stock alerts subscription', 'Photoshop / Procreate'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q83',
        question: 'Which moment is most satisfying?',
        options: ['Code that runs first try', 'A correct, clear diagnosis', 'A signed contract or sale', 'Finishing an artwork'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q84',
        question: 'Pick the type of museum you\'d visit:',
        options: ['Tech / computing museum', 'Science of the body museum', 'Money & banking museum', 'Modern art museum'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q85',
        question: 'Which is your favourite school subject right now?',
        options: ['Computer Science', 'Biology', 'Business Studies', 'Fine Arts'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q86',
        question: 'Pick the conversation you\'d eagerly join:',
        options: ['About new programming languages', 'About new treatments', 'About IPOs and startups', 'About new exhibitions'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q87',
        question: 'Which mode of learning suits you best?',
        options: ['Online courses and docs', 'Lab demos and rotations', 'Case studies and mentoring', 'Workshops and critiques'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q88',
        question: 'Which job title sounds best to you?',
        options: ['Software Engineer', 'Doctor', 'Manager / Consultant', 'Designer / Artist'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q89',
        question: 'Which kind of failure would sting the most?',
        options: ['A bug in production', 'A misdiagnosis', 'Missing a quarterly target', 'A bad review of your art'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q90',
        question: 'What do you want people to say about you?',
        options: ['"Brilliant problem-solver"', '"Saved my life"', '"Made me successful"', '"Inspired me deeply"'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q91',
        question: 'Which is more your style?',
        options: ['Open-source contributor', 'Free clinic volunteer', 'Side-hustle entrepreneur', 'Indie creator'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q92',
        question: 'Which calendar would you want most full?',
        options: ['Sprint planning sessions', 'Patient appointments', 'Investor meetings', 'Studio sessions'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q93',
        question: 'Pick a productivity app you\'d live in:',
        options: ['Notion / VS Code', 'Epic EHR / health tracker', 'Excel / Google Sheets', 'Figma / Procreate'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q94',
        question: 'Which job challenge thrills you?',
        options: ['Scaling a system to millions', 'Performing surgery successfully', 'Outpacing competitors in a market', 'Going viral with creative work'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q95',
        question: 'Pick a personal blog topic:',
        options: ['Tech tutorials', 'Health & nutrition', 'Finance & startups', 'Photography & design'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q96',
        question: 'Which would you research for fun on a weekend?',
        options: ['A new JavaScript framework', 'A disease pathology', 'Market psychology', 'Color theory'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q97',
        question: 'Pick a weekend workshop you\'d sign up for:',
        options: ['Build a mobile app', 'First-aid training', 'Stock investing basics', 'Watercolor painting'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q98',
        question: 'Which is your "happy place"?',
        options: ['At your IDE coding away', 'In a clinic helping patients', 'In a meeting room strategizing', 'In a studio making art'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q99',
        question: 'What do you most want to be remembered for?',
        options: ['Inventing something useful', 'Healing many people', 'Building an empire', 'Creating timeless art'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q100',
        question: 'If you had unlimited free time, you would mostly:',
        options: ['Build apps and learn AI', 'Study medicine deeply', 'Start companies and side hustles', 'Travel and make art'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    // Engineering-leaning questions (give engineering fairer representation)
    {
        id: 'q101',
        question: 'Which kind of project would you build at home?',
        options: ['A mobile app', 'A first-aid kit guide', 'An Arduino or robotics kit', 'A handmade craft or painting'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
    {
        id: 'q102',
        question: 'Which infrastructure fascinates you most?',
        options: ['Cloud computing systems', 'Hospital systems', 'Bridges, roads and buildings', 'Stadiums and theaters'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
    {
        id: 'q103',
        question: 'Which YouTube series would you follow?',
        options: ['Coding tutorials', 'Surgery walkthroughs', 'How big machines are built', 'Behind-the-scenes of films'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
    {
        id: 'q104',
        question: 'Which engineering feat impresses you most?',
        options: ['A self-driving car AI', 'A successful organ transplant', 'A massive bridge or dam', 'A modern art installation'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
    {
        id: 'q105',
        question: 'Pick an O/A-level subject combo you would choose:',
        options: ['Maths + CS + Physics', 'Bio + Chem + Physics', 'Maths + Econ + Accounting', 'Art + Lit + Design'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 'q106',
        question: 'Which problem would you most love to solve?',
        options: ['Make AI safer for humans', 'Cure a chronic disease', 'Design earthquake-proof homes', 'Lift a brand to global fame'],
        fieldTags: ['cs', 'medical', 'engineering', 'business'],
    },
    {
        id: 'q107',
        question: 'Which industry would you like to disrupt?',
        options: ['EdTech / SaaS', 'Healthcare', 'Construction / energy', 'Retail and fashion'],
        fieldTags: ['cs', 'medical', 'engineering', 'business'],
    },
    {
        id: 'q108',
        question: 'Which Pakistani university appeals to you most?',
        options: ['FAST / NUCES', 'AKU', 'UET / GIKI', 'NCA'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
    {
        id: 'q109',
        question: 'Which museum tour sounds most fun?',
        options: ['A computing history museum', 'A natural science museum', 'A railway / aviation museum', 'A fine arts museum'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
    {
        id: 'q110',
        question: 'Which mechanism do you find most fascinating?',
        options: ['How algorithms work', 'How the human heart works', 'How engines and machines work', 'How a story or song moves people'],
        fieldTags: ['cs', 'medical', 'engineering', 'arts'],
    },
]

const QUESTIONS_PER_ATTEMPT = 10

// Fisher-Yates shuffle (returns a new array, original untouched)
function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

function pickQuestions() {
    return shuffle(QUESTION_BANK).slice(0, QUESTIONS_PER_ATTEMPT)
}

export default function QuizPage() {
    const { token } = useAuth()
    const router = useRouter()
    const [questions, setQuestions] = useState([])
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState([])
    const [selectedOption, setSelectedOption] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)
    const [result, setResult] = useState(null)

    // Pick a fresh random set on mount (and on retake via handleRestart).
    useEffect(() => {
        setQuestions(pickQuestions())
    }, [])

    if (questions.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center text-gray-400">
                Loading quiz...
            </div>
        )
    }

    const question = questions[current]
    const progress = (current / questions.length) * 100

    const handleSelect = (optionIdx) => {
        setSelectedOption(optionIdx)
    }

    const handleNext = async () => {
        if (selectedOption === null) return

        const newAnswers = [...answers, {
            questionId: question.id,
            selectedOption,
            fieldTag: question.fieldTags[selectedOption],
        }]
        setAnswers(newAnswers)

        if (current < questions.length - 1) {
            setCurrent(current + 1)
            setSelectedOption(null)
        } else {
            setSubmitting(true)
            try {
                const res = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ answers: newAnswers, totalQuestions: questions.length }),
                })
                const data = await res.json()
                if (res.ok) {
                    setResult(data)
                    setDone(true)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setSubmitting(false)
            }
        }
    }

    const handleRestart = () => {
        setQuestions(pickQuestions())
        setCurrent(0)
        setAnswers([])
        setSelectedOption(null)
        setDone(false)
        setResult(null)
    }

    if (done && result) {
        const topRec = result.recommendations?.[0]
        const topField = topRec?.field
        const topColor = getFieldColor(topField)
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
                <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center animate-float"
                        style={{ background: `${topColor}20`, border: `1px solid ${topColor}40` }}>
                        <FieldIcon field={topField} size={40} useFieldColor />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Quiz Complete!
                    </h1>
                    <p className="text-gray-400 text-lg">Here are your top career field matches</p>
                </div>

                <div className="space-y-4">
                    {result.recommendations?.map((rec, i) => {
                        const fd = rec.fieldData
                        const color = getFieldColor(rec.field)
                        return (
                            <div key={i} className="card" style={{
                                border: i === 0 ? '1px solid rgba(99,102,241,0.4)' : undefined,
                                background: i === 0 ? 'rgba(99,102,241,0.08)' : undefined,
                            }}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                                        <FieldIcon field={rec.field} size={24} useFieldColor />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white">{fd?.name}</h3>
                                            {i === 0 && <span className="badge inline-flex items-center gap-1" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}><Trophy size={10} /> Best Match</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-3">{rec.explanation}</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${rec.confidence}%` }} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{rec.confidence}% confidence match</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex gap-3">
                    <button onClick={handleRestart} className="btn-secondary flex-1 justify-center">
                        <RotateCcw size={16} /> Retake Quiz
                    </button>
                    <button onClick={() => router.push('/dashboard/recommendations')} className="btn-primary flex-1 justify-center">
                        Full Analysis <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">AI Career Quiz</span>
                </div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Discover Your Path
                </h1>
                <p className="text-gray-400 mt-1">Answer honestly to get the most accurate recommendations</p>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Question {current + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="progress-bar" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex gap-1 mt-2">
                    {questions.map((_, i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                                background: i < current ? '#6366f1' : i === current ? '#8b5cf6' : '#1f2937'
                            }} />
                    ))}
                </div>
            </div>

            {/* Question Card */}
            <div className="card animate-scale-in" key={current}>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">
                        {current + 1}
                    </div>
                    <h2 className="text-xl font-bold text-white">{question.question}</h2>
                </div>

                <div className="space-y-3">
                    {question.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            id={`quiz-option-${i}`}
                            className={`quiz-option w-full text-left ${selectedOption === i ? 'selected' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedOption === i
                                    ? 'border-indigo-500 bg-indigo-500'
                                    : 'border-gray-600'
                                }`}>
                                {selectedOption === i
                                    ? <CheckCircle size={16} className="text-white" />
                                    : <span className="text-xs font-bold text-gray-400">{String.fromCharCode(65 + i)}</span>}
                            </div>
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={selectedOption === null || submitting}
                    id="quiz-next"
                    className="btn-primary w-full justify-center mt-8"
                    style={{ padding: '14px', opacity: selectedOption === null ? '0.5' : '1' }}
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                        </span>
                    ) : current === questions.length - 1 ? (
                        <span className="flex items-center gap-2"><Brain size={18} /> Get My Recommendation</span>
                    ) : (
                        <span className="flex items-center gap-2">Next Question <ArrowRight size={18} /></span>
                    )}
                </button>
            </div>

            {/* Tip */}
            <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <Lightbulb size={12} className="text-amber-400" />
                Answer based on genuine interests, not what you think is &quot;correct&quot; — there are no wrong answers!
            </p>
        </div>
    )
}
