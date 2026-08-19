import type { User, Category, Quiz, Question, QuizAttempt, Chapter, TechGame } from '../types';

const STORAGE_KEYS = {
  USERS: 'skillpulse_users_v10',
  CATEGORIES: 'skillpulse_categories_v10',
  QUIZZES: 'skillpulse_quizzes_v10',
  QUESTIONS: 'skillpulse_questions_v10',
  CHAPTERS: 'skillpulse_chapters_v10',
  GAMES: 'skillpulse_games_v10',
  ATTEMPTS: 'skillpulse_attempts_v10',
  CURRENT_USER: 'skillpulse_current_user_v10',
  INITIALIZED: 'skillpulse_initialized_v10',
};

// DEFAULT INITIAL ACCOUNTS
const INITIAL_USERS: User[] = [
  {
    id: 'u-prajakta-1',
    name: 'Prajakta Gochhayat',
    email: 'gochhayatprajakta@gmail.com',
    password: 'password123',
    role: 'STUDENT',
    status: 'ACTIVE',
    createdAt: '2026-02-01T14:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prajakta',
    savedQuizIds: ['quiz-py', 'quiz-cpp', 'quiz-ml', 'quiz-sec'],
    bio: 'Engineering Scholar',
    xpPoints: 3400,
    level: 7,
    streakDays: 9,
  },
  {
    id: 'u-prajakta-admin',
    name: 'Prajakta Gochhayat',
    email: 'prajaktagochhayat@gmail.com',
    password: 'password123',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-02-01T14:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PrajaktaAdmin',
    savedQuizIds: [],
    bio: 'System Administrator',
    xpPoints: 5000,
    level: 10,
    streakDays: 14,
  },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-py', name: 'Python Programming', description: 'Core Python, OOP, NumPy & Pandas', icon: 'Terminal', createdAt: '2026-01-01' },
  { id: 'cat-c', name: 'C Language', description: 'C Syntax, Pointers & Memory', icon: 'Code', createdAt: '2026-01-01' },
  { id: 'cat-cpp', name: 'C++ Systems', description: 'OOP, STL Containers & Templates', icon: 'Code', createdAt: '2026-01-01' },
  { id: 'cat-java', name: 'Java Core', description: 'Java OOP, JVM & Spring Boot', icon: 'Layers', createdAt: '2026-01-01' },
  { id: 'cat-js', name: 'JavaScript', description: 'ES6+, Async Promises & Event Loop', icon: 'Code', createdAt: '2026-01-01' },
  { id: 'cat-ts', name: 'TypeScript', description: 'Type Safety, Generics & React TS', icon: 'Layers', createdAt: '2026-01-01' },
  { id: 'cat-sql', name: 'SQL Databases', description: 'Relational Schemas, JOINs & Indexing', icon: 'Database', createdAt: '2026-01-01' },
  { id: 'cat-mongodb', name: 'MongoDB NoSQL', description: 'BSON Document Model & Pipelines', icon: 'Database', createdAt: '2026-01-01' },
  { id: 'cat-dsa', name: 'Data Structures', description: 'Arrays, Trees, Graphs & DP', icon: 'Cpu', createdAt: '2026-01-01' },
  { id: 'cat-ml', name: 'Machine Learning', description: 'Regression, Classification & Scikit-Learn', icon: 'Sparkles', createdAt: '2026-01-01' },
  { id: 'cat-ai', name: 'Artificial Intelligence', description: 'Deep Learning, PyTorch & Transformers', icon: 'Sparkles', createdAt: '2026-01-01' },
  { id: 'cat-sec', name: 'Cyber Security', description: 'OWASP Top 10, XSS & Encryption', icon: 'ShieldCheck', createdAt: '2026-01-01' },
  { id: 'cat-devops', name: 'DevOps & Cloud', description: 'Docker Containers & Kubernetes', icon: 'Server', createdAt: '2026-01-01' },
  { id: 'cat-os', name: 'Operating Systems', description: 'Process Scheduling, Memory & Networks', icon: 'Globe', createdAt: '2026-01-01' },
  { id: 'cat-web', name: 'HTML5 & CSS3', description: 'Semantic Layouts, Flexbox & Grid', icon: 'Layout', createdAt: '2026-01-01' },
  { id: 'cat-react', name: 'React.js Architecture', description: 'JSX, Hooks & State Management', icon: 'Layers', createdAt: '2026-01-01' },
  { id: 'cat-node', name: 'Node.js Backend', description: 'Runtime, Express & REST APIs', icon: 'Server', createdAt: '2026-01-01' },
  { id: 'cat-git', name: 'Git & Version Control', description: 'Repositories, Branching & PRs', icon: 'GitBranch', createdAt: '2026-01-01' },
];

const SUBJECT_IDS = [
  'quiz-py', 'quiz-c', 'quiz-cpp', 'quiz-java', 'quiz-js', 'quiz-ts',
  'quiz-sql', 'quiz-mongodb', 'quiz-dsa', 'quiz-ml', 'quiz-ai', 'quiz-sec',
  'quiz-devops', 'quiz-os', 'quiz-web', 'quiz-react', 'quiz-node', 'quiz-git'
];

const CHAPTER_TITLES_BY_SUBJECT: Record<string, string[]> = {
  'quiz-py': ['Fundamentals & Data Types', 'Functions & Scope', 'OOP Mechanics', 'Decorators & Generators', 'NumPy Vectors', 'Pandas DataFrames', 'Matplotlib Visualization', 'FastAPI Web Services'],
  'quiz-c': ['Syntax & Primitives', 'Control Flow', 'Pointers & Addresses', 'Strings & Buffers', 'Structs & Unions', 'Dynamic Memory', 'File I/O Operations', 'Bitwise & Preprocessor'],
  'quiz-cpp': ['Classes & Objects', 'Inheritance & Virtuals', 'STL Containers', 'Smart Pointers', 'Templates & Generics', 'Move Semantics', 'Exceptions & RAII', 'Modern C++20 Features'],
  'quiz-java': ['Java OOP Core', 'Interfaces & Abstract', 'Exception Handling', 'Collections Framework', 'Multithreading & Concurrency', 'JVM Memory & GC', 'Spring Boot REST', 'Spring Data JPA'],
  'quiz-js': ['Variables & Scope', 'Closures & Prototypes', 'Async & Promises', 'Event Loop Architecture', 'DOM & Events', 'ES6+ Modules', 'Express.js Basics', 'Node Engine Runtime'],
  'quiz-ts': ['Type Annotations', 'Interfaces & Types', 'Generics & Constraints', 'Utility Types', 'Discriminated Unions', 'React TS Integration', 'Decorators & Metadata', 'TSConfig Tuning'],
  'quiz-sql': ['DDL & DML Basics', 'Multi-Table JOINs', 'GroupBy Aggregations', 'Subqueries & CTEs', 'Window Functions', 'B-Tree Indexes', 'ACID Transactions', 'Query Optimization'],
  'quiz-mongodb': ['BSON Document Model', 'Query Selectors', 'Mongoose ODM', 'Aggregation Pipeline', 'Compound Indexes', 'Replica Sets', 'Horizontal Sharding', 'Redis Cache Layer'],
  'quiz-dsa': ['Arrays & Big-O', 'Linked Lists', 'Stacks & Queues', 'Trees & BSTs', 'Graph Algorithms', 'Dynamic Programming', 'Sorting & Searching', 'Heaps & Tries'],
  'quiz-ml': ['Supervised Learning', 'Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forests', 'K-Means Clustering', 'Model Evaluation', 'Scikit-Learn Pipelines'],
  'quiz-ai': ['Neural Net Core', 'Backpropagation', 'Activation Functions', 'CNNs & Vision', 'RNNs & Sequence', 'Transformers & Attention', 'Fine-Tuning LLMs', 'RAG Architecture'],
  'quiz-sec': ['OWASP Top 10', 'SQL Injection & XSS', 'Cryptography & Hashing', 'JWT & OAuth2', 'Network Security', 'Penetration Testing', 'Web Application Firewalls', 'Cloud Security'],
  'quiz-devops': ['Docker Containers', 'Dockerfile Commands', 'Docker Compose', 'Kubernetes Pods', 'K8s Deployments', 'CI/CD Pipelines', 'AWS EC2 & S3', 'Terraform IaC'],
  'quiz-os': ['CPU Scheduling', 'Process & Threads', 'Memory Paging', 'Virtual Memory', 'Deadlock Detection', 'File Systems & I/O', 'OSI 7-Layer Model', 'TCP/IP Socket Net'],
  'quiz-web': ['Semantic HTML5', 'CSS Flexbox Layouts', 'CSS Grid System', 'Responsive Media Queries', 'Tailwind Utilities', 'Web Accessibility ARIA', 'CSS Animations', 'Form Validations'],
  'quiz-react': ['JSX & Virtual DOM', 'useState & Hooks', 'useEffect Lifecycle', 'Custom Hooks', 'Context API State', 'Redux Toolkit', 'React Router v6', 'Performance Memo'],
  'quiz-node': ['Node Runtime Async', 'Event Emitter Engine', 'Buffer & Streams', 'Express Middleware', 'REST API Routes', 'Authentication JWT', 'MongoDB Integration', 'Error Handling'],
  'quiz-git': ['Git Repos & Commits', 'Branching Strategies', 'Merging & Conflicts', 'Interactive Rebase', 'Pull Request Review', 'Git Stash & Reset', 'GitHub Actions CI', 'Git Hooks'],
};

const INITIAL_CHAPTERS: Chapter[] = [];

SUBJECT_IDS.forEach((subId) => {
  const titles = CHAPTER_TITLES_BY_SUBJECT[subId];
  titles.forEach((t, idx) => {
    const chNum = idx + 1;
    INITIAL_CHAPTERS.push({
      id: `ch-${subId}-${chNum}`,
      quizId: subId,
      chapterNumber: chNum,
      title: `Chapter ${chNum}: ${t}`,
      description: `Comprehensive guide and notes covering ${t.toLowerCase()} in engineering software systems.`,
      summaryNotes: `${t} represents a core foundation in modern engineering architecture and software development. Understanding its fundamental principles enables developers to build high-performance, robust, and scalable application modules.

In practical execution, ${t.toLowerCase()} provides the required contracts and execution pipelines necessary for memory efficiency, loose coupling, and clean code separation. Master these concepts to solve real-world technical problems effectively.`,
      keyConcepts: [`Core ${t} Principles`, `Implementation Best Practices`, `Performance Optimization & Trade-offs`],
      codeExample: `// Example implementation of ${t}\nfunction executeModule() {\n    console.log("Module initialized: ${t}");\n}`,
    });
  });
});

const INITIAL_QUIZZES: Quiz[] = [
  { id: 'quiz-py', title: 'Python Programming & Libraries', description: 'Master core Python syntax, OOP, Decorators, NumPy, Pandas, and FastAPI.', categoryId: 'cat-py', categoryName: 'Python Programming', difficulty: 'Intermediate', duration: 25, passingScore: 60, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-py'), averageRating: 4.9, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  { id: 'quiz-c', title: 'C Language Fundamentals', description: 'Master procedural C syntax, pointers, structures, and dynamic memory management.', categoryId: 'cat-c', categoryName: 'C Language', difficulty: 'Intermediate', duration: 20, passingScore: 60, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-c'), averageRating: 4.8, createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-01-18T10:00:00Z' },
  { id: 'quiz-cpp', title: 'C++ Systems & OOP', description: 'Object-oriented programming in C++, templates, STL containers, and smart pointers.', categoryId: 'cat-cpp', categoryName: 'C++ Systems', difficulty: 'Advanced', duration: 25, passingScore: 65, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-cpp'), averageRating: 4.9, createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z' },
  { id: 'quiz-java', title: 'Java Core & Enterprise', description: 'Core Java OOP, Collections, Exception handling, Multithreading, and Spring Boot.', categoryId: 'cat-java', categoryName: 'Java Core', difficulty: 'Intermediate', duration: 25, passingScore: 70, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-java'), averageRating: 4.7, createdAt: '2026-01-22T10:00:00Z', updatedAt: '2026-01-22T10:00:00Z' },
  { id: 'quiz-js', title: 'JavaScript Engine & Web', description: 'Closures, Event Loop macro/micro tasks, Promises, Async/Await, and Node Express.', categoryId: 'cat-js', categoryName: 'JavaScript', difficulty: 'Intermediate', duration: 20, passingScore: 60, maxAttempts: 4, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-js'), averageRating: 4.9, createdAt: '2026-01-25T10:00:00Z', updatedAt: '2026-01-25T10:00:00Z' },
  { id: 'quiz-ts', title: 'TypeScript & Fullstack Systems', description: 'Strict type safety, Generics, Discriminated Unions, Utility Types, and React TS.', categoryId: 'cat-ts', categoryName: 'TypeScript', difficulty: 'Intermediate', duration: 20, passingScore: 70, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-ts'), averageRating: 5.0, createdAt: '2026-01-28T10:00:00Z', updatedAt: '2026-01-28T10:00:00Z' },
  { id: 'quiz-sql', title: 'SQL Relational Databases', description: 'DDL/DML, Multi-Table JOINs, GroupBy aggregations, B-Tree Indexes, and ACID.', categoryId: 'cat-sql', categoryName: 'SQL Databases', difficulty: 'Advanced', duration: 25, passingScore: 65, maxAttempts: 2, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-sql'), averageRating: 4.8, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z' },
  { id: 'quiz-mongodb', title: 'MongoDB NoSQL Architecture', description: 'BSON Document model, Mongoose schemas, Aggregation Pipelines, and Redis.', categoryId: 'cat-mongodb', categoryName: 'MongoDB NoSQL', difficulty: 'Intermediate', duration: 20, passingScore: 60, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-mongodb'), averageRating: 4.6, createdAt: '2026-02-03T10:00:00Z', updatedAt: '2026-02-03T10:00:00Z' },
  { id: 'quiz-dsa', title: 'Data Structures & Algorithms', description: 'Arrays, Linked Lists, Binary Search Trees, Graphs, and Dynamic Programming.', categoryId: 'cat-dsa', categoryName: 'Data Structures', difficulty: 'Advanced', duration: 30, passingScore: 70, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1516116211223-4c714cf9946d?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-dsa'), averageRating: 4.9, createdAt: '2026-02-04T10:00:00Z', updatedAt: '2026-02-04T10:00:00Z' },
  { id: 'quiz-ml', title: 'Machine Learning Fundamentals', description: 'Supervised vs Unsupervised learning, Linear/Logistic Regression, Decision Trees, and Scikit-Learn.', categoryId: 'cat-ml', categoryName: 'Machine Learning', difficulty: 'Intermediate', duration: 25, passingScore: 65, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-ml'), averageRating: 4.9, createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-05T10:00:00Z' },
  { id: 'quiz-ai', title: 'Artificial Intelligence & LLMs', description: 'Deep Learning, PyTorch Neural Networks, Transformers, and Retrieval-Augmented Generation (RAG).', categoryId: 'cat-ai', categoryName: 'Artificial Intelligence', difficulty: 'Advanced', duration: 30, passingScore: 75, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-ai'), averageRating: 5.0, createdAt: '2026-02-06T10:00:00Z', updatedAt: '2026-02-06T10:00:00Z' },
  { id: 'quiz-sec', title: 'Cyber Security & Web Defense', description: 'OWASP Top 10 vulnerabilities, SQLi, XSS, CSRF, Cryptography, and Penetration Testing.', categoryId: 'cat-sec', categoryName: 'Cyber Security', difficulty: 'Advanced', duration: 25, passingScore: 70, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-sec'), averageRating: 4.8, createdAt: '2026-02-07T10:00:00Z', updatedAt: '2026-02-07T10:00:00Z' },
  { id: 'quiz-devops', title: 'Cloud Computing & DevOps', description: 'Docker Containerization, Kubernetes Pod Orchestration, AWS Services, and CI/CD Pipelines.', categoryId: 'cat-devops', categoryName: 'DevOps & Cloud', difficulty: 'Intermediate', duration: 25, passingScore: 65, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-devops'), averageRating: 4.7, createdAt: '2026-02-08T10:00:00Z', updatedAt: '2026-02-08T10:00:00Z' },
  { id: 'quiz-os', title: 'Operating Systems & Networks', description: 'Process Scheduling, CPU Context Switching, Memory Management, OSI 7 Layers, and TCP Sockets.', categoryId: 'cat-os', categoryName: 'Operating Systems', difficulty: 'Advanced', duration: 25, passingScore: 65, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-os'), averageRating: 4.8, createdAt: '2026-02-09T10:00:00Z', updatedAt: '2026-02-09T10:00:00Z' },
  { id: 'quiz-web', title: 'HTML5, CSS3 & Responsive UI', description: 'Semantic HTML, Flexbox, CSS Grid, Media Queries, and Modern Responsive Design.', categoryId: 'cat-web', categoryName: 'HTML5 & CSS3', difficulty: 'Beginner', duration: 20, passingScore: 60, maxAttempts: 4, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-web'), averageRating: 4.9, createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z' },
  { id: 'quiz-react', title: 'React.js Architecture & State', description: 'JSX, Functional Components, Custom Hooks, Redux Toolkit, and Context API.', categoryId: 'cat-react', categoryName: 'React.js Architecture', difficulty: 'Intermediate', duration: 25, passingScore: 65, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-react'), averageRating: 5.0, createdAt: '2026-02-11T10:00:00Z', updatedAt: '2026-02-11T10:00:00Z' },
  { id: 'quiz-node', title: 'Node.js Backend & REST APIs', description: 'Node Async Runtime, Event Emitter, Express Routes, Middleware, and JWT Authentication.', categoryId: 'cat-node', categoryName: 'Node.js Backend', difficulty: 'Intermediate', duration: 20, passingScore: 60, maxAttempts: 3, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-node'), averageRating: 4.7, createdAt: '2026-02-12T10:00:00Z', updatedAt: '2026-02-12T10:00:00Z' },
  { id: 'quiz-git', title: 'Git, GitHub & Version Control', description: 'Commits, Branching strategies, Interactive Rebase, Pull Requests, and GitHub Actions.', categoryId: 'cat-git', categoryName: 'Git & Version Control', difficulty: 'Beginner', duration: 20, passingScore: 60, maxAttempts: 4, status: 'Published', thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80', chapters: INITIAL_CHAPTERS.filter(c => c.quizId === 'quiz-git'), averageRating: 4.9, createdAt: '2026-02-13T10:00:00Z', updatedAt: '2026-02-13T10:00:00Z' },
];

const INITIAL_QUESTIONS: Question[] = [
  { id: 'q-py-1', quizId: 'quiz-py', chapterId: 'ch-quiz-py-1', questionText: 'Which Python data structure is immutable once created?', type: 'single', marks: 1, difficulty: 'Beginner', explanation: 'Tuples are immutable in Python.', createdAt: '2026-01-15', options: [{ id: 'o-1', questionId: 'q-py-1', optionText: 'List', isCorrect: false }, { id: 'o-2', questionId: 'q-py-1', optionText: 'Tuple', isCorrect: true }, { id: 'o-3', questionId: 'q-py-1', optionText: 'Dict', isCorrect: false }] },
  { id: 'q-c-1', quizId: 'quiz-c', chapterId: 'ch-quiz-c-3', questionText: 'What operator is used to obtain memory address in C?', type: 'single', marks: 1, difficulty: 'Beginner', explanation: '& is the address-of operator.', createdAt: '2026-01-18', options: [{ id: 'o-4', questionId: 'q-c-1', optionText: '&', isCorrect: true }, { id: 'o-5', questionId: 'q-c-1', optionText: '*', isCorrect: false }] },
];

const INITIAL_GAMES: TechGame[] = [
  { id: 'game-1', subjectId: 'quiz-py', subjectName: 'Python Programming', title: 'Python Syntax Unscrambler Puzzle', type: 'bug-hunter', description: 'Re-order scrambled Python code blocks into the correct function order!', difficulty: 'Intermediate', icon: 'Bug' },
  { id: 'game-2', subjectId: 'quiz-c', subjectName: 'C Language', title: 'C Pointer Memory Address Arena', type: 'pointer-arena', description: 'Trace memory addresses and pointer dereferences!', difficulty: 'Advanced', icon: 'Cpu' },
  { id: 'game-3', subjectId: 'quiz-java', subjectName: 'Java Core', title: 'Java Multithreading Race', type: 'thread-race', description: 'Synchronize threads and resolve deadlock locks!', difficulty: 'Advanced', icon: 'Zap' },
  { id: 'game-4', subjectId: 'quiz-js', subjectName: 'JavaScript Engine', title: 'JS Event Loop Macro/Micro Sprint', type: 'event-loop', description: 'Predict Promise micro-tasks vs setTimeout macro-tasks!', difficulty: 'Intermediate', icon: 'Sparkles' },
  { id: 'game-5', subjectId: 'quiz-sql', subjectName: 'SQL Databases', title: 'SQL Query Clause Speed Runner', type: 'sql-runner', description: 'Assemble SELECT, JOIN, and HAVING query clauses!', difficulty: 'Intermediate', icon: 'Database' },
  { id: 'game-6', subjectId: 'quiz-dsa', subjectName: 'Data Structures', title: 'Tech Term Word Finder Matrix', type: 'speed-sprint', description: 'Search and click hidden tech keywords in an interactive matrix grid!', difficulty: 'Advanced', icon: 'Flame' },
];

const INITIAL_ATTEMPTS: QuizAttempt[] = [
  { id: 'att-101', certificateId: 'QZ-ATT101-998', quizId: 'quiz-py', quizTitle: 'Python Programming & Libraries', userId: 'u-prajakta-1', userName: 'Prajakta Gochhayat', userEmail: 'gochhayatprajakta@gmail.com', score: 5, totalMarks: 5, percentage: 100, correctAnswersCount: 5, incorrectAnswersCount: 0, unansweredCount: 0, timeTakenSeconds: 420, status: 'PASSED', startedAt: '2026-02-10T10:00:00Z', completedAt: '2026-02-10T10:07:00Z', answers: [] },
];

export function initializeDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(INITIAL_CHAPTERS));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(INITIAL_GAMES));
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export function getItem<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export { STORAGE_KEYS };
