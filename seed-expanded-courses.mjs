import { drizzle } from "drizzle-orm/mysql2";
import { courses, institutions } from "./drizzle/schema.ts";
import { eq, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Comprehensive course data for all 5 community colleges
const expandedCourses = {
  // FOOTHILL COLLEGE
  foothill: {
    business: [
      { code: "BUSI 11", title: "Introduction to Information Systems", units: 5, description: "Introduction to the concepts of management and information systems especially as used in business and similar organizations. Covers the need for information, how computers are used in business and other organizations to provide information, elements of computer hardware and software, software development, data storage and communication, and the social impact of computers." },
      { code: "BUSI 12", title: "Introduction to Data Analytics & Business Decisions", units: 4, description: "Overview of data analytics and their use in making business decisions, covering a broad selection of topics along the life-cycle of data analytics. Professional skills, such as communication, presentation, and data storytelling, are presented." },
      { code: "BUSI 18", title: "Business Law I", units: 5, description: "Introduction to law applicable to business. Social forces and the law; source of law; agencies for enforcement; and court systems and procedures. California law applicable to contracts, tort negligence, agency, and the Uniform Commercial Code." },
      { code: "BUSI 19", title: "Business Law II", units: 4, description: "Law of sales, warranty and product liability, partnerships, corporations, personal property, and bailments. The Uniform Commercial Code as related to negotiable instruments and secured transactions, and creditor-debtor rights." },
      { code: "BUSI 22", title: "Principles of Business", units: 5, description: "Examination of the principles and functions of business and the objectives and operations of the corporate and small business managerial decision-making process. The course examines the relationship between businesses and consumers, internal and external stakeholders." },
      { code: "BUSI 30", title: "Emerging Technologies & Business", units: 4, description: "Comprehensive exploration of how emerging technologies - such as generative artificial intelligence - and other pivotal innovations influence business and society." },
      { code: "BUSI 45", title: "Fundamentals of Personal Finance", units: 4, description: "Designed to help students understand the impact of financial decisions on their personal, professional, and community lives. Topics include the time value of money, major consumer purchases, retirement planning, investment options." },
      { code: "BUSI 57", title: "Principles of Advertising", units: 4, description: "Introduction to advertising campaign management: the selection of the target market and market segments; campaign goal setting; selection of channels and media; identification of strategy; design and implementation." },
      { code: "BUSI 59", title: "Principles of Marketing", units: 4, description: "Contemporary marketing developments and applications relative to business activities that determine customer demand for products and services. Focus on market planning strategy, determining the right product, price, distribution and promotion elements." },
      { code: "BUSI 59A", title: "Online Marketing", units: 5, description: "Marketing strategies and techniques to help businesses reach potential customers online, drive traffic to generate customer-to-business interaction, convert leads to sales, and maintain customer relationships over time." },
      { code: "BUSI 59B", title: "E-Business", units: 5, description: "Foundations and principles of building and innovating digital and e-commerce businesses sustainably into platforms, including the internet, mobile, and virtual/augmented reality, powered by emerging technologies such as artificial intelligence and blockchain." },
      { code: "BUSI 59C", title: "Marketing Content Strategy & Branding", units: 4, description: "Focused on branding and content strategy, this course aims to push students to explore concepts such as consumer psychology and behavior, content and channel creation, visual design, and search engine optimization." },
      { code: "BUSI 59D", title: "Market Analytics & Performance Optimization", units: 4, description: "Focusing on key performance indicators (KPIs), this course aims to give students the skills needed to analyze results of marketing efforts. Students will learn about factors that drive conversion and how to optimize their efforts using data and A/B testing." },
      { code: "BUSI 59E", title: "Email Marketing", units: 4, description: "Deep dive into the world of email marketing. Students will learn about the role of email marketing in a company's marketing campaign, what stages of the customer journey email marketing is suited for, and best practices for email visuals and copy." },
      { code: "BUSI 60", title: "Fundamentals of Finance", units: 5, description: "Introduction to the fundamentals of financial analysis and applications to business challenges in valuation, risk analysis, corporate investment decisions, and basic security analysis and investment management." },
      { code: "BUSI 61", title: "Investment Fundamentals", units: 3, description: "Introduction to securities investment characteristics and rights. Investment vehicles (stock, bonds, derivatives). Markets and exchanges. Stock and bond valuation analyses. Portfolio evaluation and stock trading." },
      { code: "BUSI 70", title: "Business & Professional Ethics", units: 4, description: "Social and moral dilemmas encountered in business and professional lives. Exploration and analysis of the ongoing conflicts between personal value systems, expected codes of behavior, evolving technology and government regulations." },
      { code: "BUSI 87", title: "Human Resources Management", units: 5, description: "Comprehensive study of human resource management in organizations, including human resource planning; employment legislation; recruitment and selection; training and development; compensation and benefits; performance appraisal and career management." },
      { code: "BUSI 88A", title: "Foundations of Leadership", units: 4, description: "Introduction to leadership concepts and practices in organizational settings." },
    ],
    computerScience: [
      { code: "C S 1A", title: "Object-Oriented Programming Methodologies in Java", units: 4.5, description: "Systematic introduction to fundamental concepts of computer science through the study of the Java programming language. Coding topics include Java control structures, classes, methods, arrays, graphical user interfaces and elementary data structures. Concept topics include algorithms, recursion, data abstraction, problem solving strategies, code style, documentation, debugging techniques and testing." },
      { code: "C S 1B", title: "Intermediate Software Design in Java", units: 4.5, description: "Systematic treatment of intermediate concepts in computer science through the study of Java object-oriented programming (OOP). Coding topics include Java interfaces, class extension, generics, the Java collections framework, multi-dimensional arrays and file I/O. Concept topics include OOP project design, inheritance, polymorphism, method chaining, functional programming, linked-lists, FIFOs, LIFOs, event-driven programming and guarded code." },
      { code: "C S 1C", title: "Advanced Data Structures and Algorithms in Java", units: 4.5, description: "Systematic treatment of advanced data structures, algorithm analysis and abstract data types in the Java programming language. Coding topics include the development of ADTs from scratch, building ADTs on top of the java.util collections, array lists, linked lists, trees, maps, hashing functions and graphs. Concept topics include searching, big-O time complexity, analysis of all major sorting techniques, top down splaying, AVL tree balancing, shortest path algorithms, minimum spanning trees and maximum flow graphs." },
      { code: "C S 2A", title: "Object-Oriented Programming Methodologies in C++", units: 4.5, description: "Systematic introduction to fundamental concepts of computer science through the study of the C++ programming language. Coding topics include C++ control structures, objects, global-scope functions, class methods, arrays and elementary data structures. Concept topics include algorithms, recursion, data abstraction, problem solving strategies, code style, documentation, debugging techniques and testing." },
      { code: "C S 2B", title: "Intermediate Software Design in C++", units: 4.5, description: "Systematic treatment of intermediate concepts in computer science through the study of C++ object-oriented programming (OOP). Coding topics include C++ derived classes, class templates, function templates, virtual functions, operator overloading, an introduction to the Standard Template Library, multiple inheritance, pointers, dynamic memory allocation and file I/O. Concept topics include OOP project design, inheritance, polymorphism, method chaining, functional programming, linked-lists, FIFOs, LIFOs, events in GUIs and guarded code." },
      { code: "C S 2C", title: "Advanced Data Structures and Algorithms in C++", units: 4.5, description: "Systematic treatment of advanced data structures, algorithm analysis and abstract data types in the C++ programming language. Coding topics include the development of ADTs from scratch, building ADTs on top of the STL templates, vectors, lists, trees, maps, hashing functions and graphs. Concept topics include searching, big-O time complexity, analysis of all major sorting techniques, top down splaying, AVL tree balancing, shortest path algorithms, minimum spanning trees and maximum flow graphs." },
      { code: "C S 3A", title: "Object-Oriented Programming Methodologies in Python", units: 4.5, description: "Systematic introduction to fundamental concepts of computer science through the study of the Python programming language. Coding topics include control structures, functions, classes, string processing, lists, tuples, dictionaries, working with files, and elementary graphics. Concept topics include algorithms, data abstraction, problem solving strategies, code style, documentation, debugging techniques and testing." },
      { code: "C S 3B", title: "Intermediate Software Design in Python", units: 4.5, description: "Systematic treatment of intermediate concepts in computer science through the study of Python object-oriented programming (OOP). Coding topics include Python sequences, user-defined classes and interfaces, modules, packages, collection classes, threads, lambda expressions, list comprehensions, regular expressions and multi-dimensional arrays. Concept topics include OOP project design, recursion, inheritance, polymorphism, functional programming, linked-lists, FIFOs, LIFOs, event-driven parsing, exceptions, and guarded code." },
      { code: "C S 3C", title: "Advanced Data Structures and Algorithms in Python", units: 4.5, description: "Systematic treatment of advanced data structures, algorithm analysis and abstract data types in the Python programming language. Coding topics include the development of ADTs from scratch, building ADTs on top of Python collections, lists, trees, maps, hashing functions and graphs. Concept topics include searching, big-O time complexity, analysis of all major sorting techniques, tree balancing, shortest path algorithms, minimum spanning trees and maximum flow graphs." },
      { code: "C S 10", title: "Introduction to Computer Architecture", units: 4.5, description: "Introduction to computer organization and architecture, including digital logic design, instruction set architecture, assembly language programming, processor design, memory hierarchy, and input/output systems." },
      { code: "C S 11A", title: "Introduction to Machine Learning", units: 4.5, description: "Introduction to machine learning concepts, algorithms, and applications. Topics include supervised and unsupervised learning, neural networks, deep learning, and practical applications of ML techniques." },
      { code: "C S 11B", title: "Introduction to Artificial Intelligence", units: 4.5, description: "Introduction to artificial intelligence concepts and techniques. Topics include search algorithms, knowledge representation, planning, reasoning under uncertainty, and intelligent agents." },
      { code: "C S 12A", title: "Computer Graphics", units: 4.5, description: "Introduction to computer graphics programming. Topics include 2D and 3D graphics, transformations, rendering, shading, and interactive graphics applications." },
      { code: "C S 12B", title: "Game Programming", units: 4.5, description: "Introduction to game programming concepts and techniques. Topics include game engines, physics simulation, collision detection, artificial intelligence for games, and game design patterns." },
      { code: "C S 18", title: "Discrete Mathematics for Computer Science", units: 4.5, description: "Mathematical foundations for computer science. Topics include logic, sets, functions, relations, combinatorics, graph theory, and discrete probability." },
      { code: "C S 20A", title: "iOS Mobile App Development", units: 4.5, description: "Introduction to iOS mobile application development using Swift. Topics include iOS SDK, user interface design, data persistence, networking, and app deployment." },
      { code: "C S 22A", title: "Android Mobile App Development", units: 4.5, description: "Introduction to Android mobile application development using Kotlin. Topics include Android SDK, user interface design, data persistence, networking, and app deployment." },
    ],
    generalEducation: [
      { code: "ENGL 1A", title: "Composition and Reading", units: 5, description: "Expository writing with emphasis on the essay form. Instruction in critical thinking, reading, and writing. Includes research methods and documentation." },
      { code: "ENGL 1B", title: "Critical Thinking and Writing", units: 5, description: "Advanced composition with emphasis on critical thinking and argumentation. Analysis and evaluation of texts from various disciplines." },
      { code: "COMM 1A", title: "Public Speaking", units: 4, description: "Theory and practice of public speaking. Emphasis on speech organization, delivery, audience analysis, and critical listening." },
      { code: "MATH 1A", title: "Calculus I", units: 5, description: "Limits, continuity, derivatives, applications of derivatives, introduction to integration." },
      { code: "MATH 1B", title: "Calculus II", units: 5, description: "Techniques of integration, applications of integration, sequences and series." },
      { code: "MATH 10", title: "Elementary Statistics", units: 5, description: "Descriptive statistics, probability, sampling distributions, estimation, hypothesis testing, correlation and regression." },
      { code: "MATH 106", title: "College Algebra", units: 5, description: "Algebraic operations, equations and inequalities, functions and graphs, polynomial and rational functions, exponential and logarithmic functions." },
      { code: "PSYC 1", title: "General Psychology", units: 5, description: "Introduction to the scientific study of behavior and mental processes. Topics include biological bases of behavior, sensation and perception, learning, memory, cognition, development, personality, social psychology, and psychological disorders." },
      { code: "SOC 1", title: "Introduction to Sociology", units: 5, description: "Introduction to the sociological perspective, including culture, socialization, social structure, deviance, inequality, and social institutions." },
      { code: "HIST 4A", title: "History of the United States I", units: 5, description: "Survey of United States history from pre-Columbian times through Reconstruction." },
      { code: "HIST 4B", title: "History of the United States II", units: 5, description: "Survey of United States history from Reconstruction to the present." },
      { code: "BIOL 10", title: "Principles of Biology", units: 5, description: "Introduction to biological principles including cell structure and function, genetics, evolution, ecology, and diversity of life." },
      { code: "CHEM 1A", title: "General Chemistry I", units: 5, description: "Atomic structure, chemical bonding, stoichiometry, thermochemistry, gases, and solutions." },
      { code: "PHYS 4A", title: "Physics for Scientists and Engineers I", units: 5, description: "Mechanics, including kinematics, dynamics, work and energy, momentum, rotation, and oscillations." },
    ],
    digitalArts: [
      { code: "ART 2A", title: "Beginning Drawing", units: 3, description: "Introduction to drawing techniques and materials. Emphasis on observational drawing, composition, and visual expression." },
      { code: "ART 2B", title: "Intermediate Drawing", units: 3, description: "Continued development of drawing skills with emphasis on advanced techniques, conceptual development, and personal expression." },
      { code: "ART 4A", title: "Beginning Painting", units: 3, description: "Introduction to painting techniques and materials. Emphasis on color theory, composition, and visual expression." },
      { code: "GID 10", title: "Digital Imaging", units: 3, description: "Introduction to digital imaging using industry-standard software. Topics include image editing, compositing, and digital illustration." },
      { code: "GID 11", title: "Vector Graphics", units: 3, description: "Introduction to vector-based graphics using industry-standard software. Topics include logo design, illustration, and layout." },
      { code: "GID 20", title: "3D Modeling and Animation", units: 3, description: "Introduction to 3D modeling and animation using industry-standard software. Topics include modeling, texturing, lighting, and animation." },
      { code: "GID 30", title: "Motion Graphics", units: 3, description: "Introduction to motion graphics and visual effects. Topics include animation, compositing, and video editing." },
      { code: "GID 40", title: "Web Design", units: 3, description: "Introduction to web design principles and techniques. Topics include HTML, CSS, responsive design, and user experience." },
      { code: "PHOT 1", title: "Beginning Photography", units: 3, description: "Introduction to photography including camera operation, exposure, composition, and digital image processing." },
    ],
    audio: [
      { code: "MUS 1A", title: "Music Theory I", units: 4, description: "Fundamentals of music theory including notation, scales, intervals, chords, and basic harmony." },
      { code: "MUS 1B", title: "Music Theory II", units: 4, description: "Continuation of Music Theory I with emphasis on advanced harmony, voice leading, and analysis." },
      { code: "MUS 4A", title: "Music Technology I", units: 3, description: "Introduction to music technology including MIDI, digital audio workstations, and music production techniques." },
      { code: "MUS 4B", title: "Music Technology II", units: 3, description: "Advanced music technology including sound design, mixing, mastering, and audio post-production." },
      { code: "MUS 12A", title: "Audio Recording I", units: 3, description: "Introduction to audio recording techniques including microphone placement, signal flow, and basic mixing." },
      { code: "MUS 12B", title: "Audio Recording II", units: 3, description: "Advanced audio recording techniques including multitrack recording, editing, and production." },
    ],
  },
  
  // DE ANZA COLLEGE
  deanza: {
    business: [
      { code: "BUS 10", title: "Introduction to Business", units: 5, description: "Survey of business principles, practices, and environment. Topics include business organization, management, marketing, finance, and entrepreneurship." },
      { code: "BUS 11", title: "Introduction to Personal Finance", units: 4, description: "Personal financial planning including budgeting, credit management, insurance, investments, and retirement planning." },
      { code: "BUS 18", title: "Business Law I", units: 5, description: "Legal environment of business including contracts, torts, agency, and business organizations." },
      { code: "BUS 21", title: "Business and Society", units: 5, description: "Examination of the relationship between business and society, including ethics, social responsibility, and sustainability." },
      { code: "BUS 49", title: "Management", units: 5, description: "Principles and practices of management including planning, organizing, leading, and controlling." },
      { code: "BUS 50", title: "Nonprofit Corporations", units: 5, description: "Management and operations of nonprofit organizations including governance, fundraising, and program development." },
      { code: "BUS 54", title: "Business Mathematics", units: 5, description: "Mathematical applications in business including percentages, interest, annuities, and financial analysis." },
      { code: "BUS 57", title: "Human Resource Management", units: 5, description: "Principles and practices of human resource management including recruitment, selection, training, compensation, and labor relations." },
      { code: "BUS 58", title: "The Business Plan", units: 4, description: "Development of a comprehensive business plan including market analysis, financial projections, and operational strategies." },
      { code: "BUS 65", title: "Leadership", units: 5, description: "Leadership theories and practices including communication, motivation, team building, and organizational change." },
      { code: "BUS 70", title: "Principles of E-Commerce", units: 5, description: "Electronic commerce including online business models, digital marketing, and e-commerce technologies." },
      { code: "BUS 71", title: "Digital Marketing Strategies", units: 5, description: "Digital marketing techniques including social media marketing, search engine optimization, and content marketing." },
      { code: "BUS 73", title: "International Marketing", units: 5, description: "Marketing in the global environment including cultural considerations, international market research, and global marketing strategies." },
      { code: "BUS 85", title: "Business Communication", units: 3, description: "Written and oral communication in business settings including reports, presentations, and interpersonal communication." },
      { code: "BUS 86", title: "Business Analytics", units: 5, description: "Data analysis for business decision-making including descriptive and predictive analytics, data visualization, and business intelligence." },
      { code: "BUS 87", title: "Introduction to Selling", units: 4, description: "Sales principles and techniques including prospecting, presentation, negotiation, and customer relationship management." },
      { code: "BUS 89", title: "Advertising", units: 5, description: "Advertising principles and practices including campaign development, media planning, and creative strategy." },
      { code: "BUS 90", title: "Principles of Marketing", units: 5, description: "Marketing concepts and strategies including market research, consumer behavior, product development, pricing, distribution, and promotion." },
    ],
    computerScience: [
      { code: "CIS 21JA", title: "Introduction to x86 Processor Assembly Language", units: 4.5, description: "Introduction to computer architecture and assembly language programming using x86 processors. Topics include instruction set architecture, addressing modes, and low-level programming." },
      { code: "CIS 22A", title: "Beginning Programming Methodologies in C++", units: 4.5, description: "Introduction to computer programming using C++. Topics include data types, control structures, functions, arrays, and basic object-oriented programming concepts." },
      { code: "CIS 22B", title: "Intermediate Programming Methodologies in C++", units: 4.5, description: "Intermediate C++ programming including classes, inheritance, polymorphism, templates, and the Standard Template Library." },
      { code: "CIS 22C", title: "Data Structures", units: 4.5, description: "Data structures and algorithms including linked lists, stacks, queues, trees, graphs, sorting, and searching." },
      { code: "CIS 25", title: "Introduction to Programming in Java", units: 4.5, description: "Introduction to computer programming using Java. Topics include object-oriented programming, data structures, and graphical user interfaces." },
      { code: "CIS 26A", title: "Introduction to Programming in Python", units: 4.5, description: "Introduction to computer programming using Python. Topics include data types, control structures, functions, and basic data structures." },
      { code: "CIS 26B", title: "Advanced Python Programming", units: 4.5, description: "Advanced Python programming including object-oriented programming, file I/O, regular expressions, and web programming." },
      { code: "CIS 27", title: "Introduction to Database Management Systems", units: 4.5, description: "Database concepts and SQL including database design, normalization, queries, and database administration." },
      { code: "CIS 29", title: "Systems Analysis and Design", units: 4.5, description: "Systems development life cycle including requirements analysis, design, implementation, and testing." },
      { code: "CIS 30", title: "Introduction to Web Development", units: 4.5, description: "Web development using HTML, CSS, and JavaScript. Topics include responsive design, accessibility, and client-side programming." },
      { code: "CIS 35A", title: "Introduction to Java Programming", units: 4.5, description: "Java programming including object-oriented design, inheritance, polymorphism, and graphical user interfaces." },
      { code: "CIS 40", title: "Discrete Mathematics for Computer Science", units: 4.5, description: "Mathematical foundations for computer science including logic, sets, functions, relations, combinatorics, and graph theory." },
      { code: "CIS 50", title: "Operating Systems", units: 4.5, description: "Operating system concepts including process management, memory management, file systems, and security." },
      { code: "CIS 60", title: "Computer Networks", units: 4.5, description: "Computer networking concepts including network protocols, network architecture, and network security." },
    ],
    generalEducation: [
      { code: "EWRT 1A", title: "Reading and Composition", units: 5, description: "Critical reading and expository writing with emphasis on the essay form. Includes research methods and documentation." },
      { code: "EWRT 1B", title: "Critical Reading, Writing, and Thinking", units: 5, description: "Advanced composition with emphasis on critical analysis and argumentation. Analysis of texts from various disciplines." },
      { code: "COMM 1", title: "Public Speaking", units: 4, description: "Theory and practice of public speaking including speech organization, delivery, and audience analysis." },
      { code: "MATH 1A", title: "Calculus I", units: 5, description: "Limits, continuity, derivatives, and applications of derivatives." },
      { code: "MATH 1B", title: "Calculus II", units: 5, description: "Integration techniques, applications of integration, and infinite series." },
      { code: "MATH 10", title: "Elementary Statistics", units: 5, description: "Descriptive and inferential statistics including probability, sampling, estimation, and hypothesis testing." },
      { code: "MATH 114", title: "Analytic Geometry and Calculus I", units: 5, description: "Functions, limits, derivatives, and applications with emphasis on analytic geometry." },
      { code: "PSYC 1", title: "General Psychology", units: 5, description: "Introduction to psychology including biological bases, learning, memory, development, personality, and social psychology." },
      { code: "SOC 1", title: "Introduction to Sociology", units: 5, description: "Sociological perspective including culture, socialization, social structure, and social institutions." },
      { code: "HIST 17A", title: "United States History to 1877", units: 5, description: "Survey of United States history from colonial period through Reconstruction." },
      { code: "HIST 17B", title: "United States History from 1865", units: 5, description: "Survey of United States history from Reconstruction to the present." },
      { code: "BIOL 6A", title: "General Biology I", units: 5, description: "Biological principles including cell biology, genetics, and evolution." },
      { code: "CHEM 1A", title: "General Chemistry I", units: 5, description: "Atomic structure, bonding, stoichiometry, and thermochemistry." },
      { code: "PHYS 4A", title: "Physics for Scientists and Engineers: Mechanics", units: 5, description: "Mechanics including kinematics, dynamics, work, energy, and momentum." },
    ],
    digitalArts: [
      { code: "ARTS 2A", title: "Drawing and Composition I", units: 4, description: "Introduction to drawing techniques including line, value, perspective, and composition." },
      { code: "ARTS 2B", title: "Drawing and Composition II", units: 4, description: "Continued development of drawing skills with emphasis on advanced techniques and conceptual development." },
      { code: "ARTS 4A", title: "Color and Design", units: 4, description: "Color theory and design principles including composition, balance, and visual communication." },
      { code: "ARTS 13A", title: "Digital Imaging I", units: 4, description: "Digital image editing and manipulation using industry-standard software." },
      { code: "ARTS 13B", title: "Digital Imaging II", units: 4, description: "Advanced digital imaging techniques including compositing and digital illustration." },
      { code: "ARTS 14", title: "3D Computer Modeling", units: 4, description: "Three-dimensional modeling and rendering using industry-standard software." },
      { code: "ARTS 15", title: "Animation", units: 4, description: "Principles of animation including timing, motion, and storytelling." },
      { code: "F/TV 1", title: "Introduction to Film and Television", units: 4, description: "History and aesthetics of film and television including analysis of visual storytelling." },
      { code: "F/TV 10", title: "Video Production I", units: 4, description: "Introduction to video production including camera operation, lighting, and editing." },
      { code: "PHTG 1", title: "Introduction to Photography", units: 4, description: "Photography fundamentals including camera operation, exposure, composition, and digital workflow." },
    ],
    audio: [
      { code: "MUSI 1A", title: "Music Theory I", units: 5, description: "Fundamentals of music theory including notation, scales, intervals, and basic harmony." },
      { code: "MUSI 1B", title: "Music Theory II", units: 5, description: "Continuation of music theory with emphasis on harmony, voice leading, and analysis." },
      { code: "MUSI 1C", title: "Music Theory III", units: 5, description: "Advanced music theory including chromatic harmony, modulation, and formal analysis." },
      { code: "MUSI 4A", title: "Musicianship I", units: 2, description: "Ear training and sight-singing including melodic and rhythmic dictation." },
      { code: "MUSI 4B", title: "Musicianship II", units: 2, description: "Continuation of ear training and sight-singing with emphasis on harmonic dictation." },
      { code: "MUSI 10A", title: "Music Technology I", units: 3, description: "Introduction to music technology including MIDI, digital audio, and music production." },
      { code: "MUSI 10B", title: "Music Technology II", units: 3, description: "Advanced music technology including sound design, mixing, and mastering." },
    ],
  },
  
  // SAN JOSE CITY COLLEGE
  sjcc: {
    business: [
      { code: "BUS 10", title: "Introduction to Business", units: 3, description: "Survey of business including business organization, management, marketing, finance, and entrepreneurship." },
      { code: "BUS 20", title: "Business Law", units: 3, description: "Legal environment of business including contracts, torts, and business organizations." },
      { code: "BUS 30", title: "Principles of Management", units: 3, description: "Management principles and practices including planning, organizing, leading, and controlling." },
      { code: "BUS 40", title: "Principles of Marketing", units: 3, description: "Marketing concepts including market research, consumer behavior, and marketing strategy." },
      { code: "BUS 50", title: "Human Resource Management", units: 3, description: "Human resource management including recruitment, training, compensation, and labor relations." },
      { code: "BUS 60", title: "Business Communication", units: 3, description: "Written and oral communication in business settings." },
      { code: "BUS 70", title: "Small Business Management", units: 3, description: "Management of small businesses including planning, financing, and operations." },
      { code: "BUS 80", title: "International Business", units: 3, description: "International business environment including global markets, cultural considerations, and international trade." },
      { code: "BUS 90", title: "Business Ethics", units: 3, description: "Ethical issues in business including social responsibility and corporate governance." },
      { code: "ACCT 1A", title: "Financial Accounting", units: 4, description: "Principles of financial accounting including recording, classifying, and reporting financial information." },
      { code: "ACCT 1B", title: "Managerial Accounting", units: 4, description: "Accounting for management decision-making including cost analysis, budgeting, and performance evaluation." },
      { code: "ECON 1", title: "Principles of Macroeconomics", units: 3, description: "Macroeconomic principles including national income, unemployment, inflation, and fiscal policy." },
      { code: "ECON 2", title: "Principles of Microeconomics", units: 3, description: "Microeconomic principles including supply and demand, market structures, and resource allocation." },
    ],
    computerScience: [
      { code: "CSCI 10", title: "Introduction to Computer Science", units: 3, description: "Introduction to computer science including programming, algorithms, and problem solving." },
      { code: "CSCI 20", title: "Programming in C++", units: 4, description: "Programming using C++ including data types, control structures, functions, and object-oriented programming." },
      { code: "CSCI 30", title: "Data Structures", units: 4, description: "Data structures and algorithms including arrays, linked lists, stacks, queues, trees, and graphs." },
      { code: "CSCI 40", title: "Computer Architecture", units: 3, description: "Computer organization and architecture including digital logic, instruction sets, and memory systems." },
      { code: "CSCI 50", title: "Database Management Systems", units: 3, description: "Database concepts and SQL including database design, normalization, and queries." },
      { code: "CSCI 60", title: "Web Development", units: 3, description: "Web development using HTML, CSS, JavaScript, and server-side programming." },
      { code: "CSCI 70", title: "Operating Systems", units: 3, description: "Operating system concepts including process management, memory management, and file systems." },
      { code: "CSCI 80", title: "Computer Networks", units: 3, description: "Computer networking including network protocols, architecture, and security." },
      { code: "CSCI 90", title: "Software Engineering", units: 3, description: "Software development methodologies including requirements analysis, design, implementation, and testing." },
      { code: "CSCI 100", title: "Artificial Intelligence", units: 3, description: "Artificial intelligence concepts including search algorithms, knowledge representation, and machine learning." },
    ],
    generalEducation: [
      { code: "ENGL 1A", title: "College Composition", units: 3, description: "Expository writing with emphasis on critical thinking, reading, and writing." },
      { code: "ENGL 1B", title: "Critical Thinking and Writing", units: 3, description: "Advanced composition with emphasis on argumentation and analysis." },
      { code: "COMM 1", title: "Public Speaking", units: 3, description: "Theory and practice of public speaking." },
      { code: "MATH 1A", title: "Calculus I", units: 5, description: "Limits, derivatives, and applications." },
      { code: "MATH 1B", title: "Calculus II", units: 5, description: "Integration and infinite series." },
      { code: "MATH 10", title: "Elementary Statistics", units: 4, description: "Descriptive and inferential statistics." },
      { code: "MATH 71", title: "College Algebra", units: 4, description: "Algebraic operations, functions, and graphs." },
      { code: "PSYC 1", title: "General Psychology", units: 3, description: "Introduction to psychology." },
      { code: "SOC 1", title: "Introduction to Sociology", units: 3, description: "Sociological perspective and social institutions." },
      { code: "HIST 17A", title: "United States History to 1877", units: 3, description: "Survey of United States history to Reconstruction." },
      { code: "HIST 17B", title: "United States History from 1865", units: 3, description: "Survey of United States history from Reconstruction to present." },
      { code: "BIOL 10", title: "General Biology", units: 4, description: "Biological principles including cell biology, genetics, and evolution." },
      { code: "CHEM 1A", title: "General Chemistry I", units: 5, description: "Atomic structure, bonding, and stoichiometry." },
      { code: "PHYS 2A", title: "General Physics I", units: 4, description: "Mechanics including motion, forces, and energy." },
    ],
    digitalArts: [
      { code: "ART 1A", title: "Drawing I", units: 3, description: "Introduction to drawing techniques and materials." },
      { code: "ART 1B", title: "Drawing II", units: 3, description: "Continued development of drawing skills." },
      { code: "ART 2A", title: "Design I", units: 3, description: "Principles of two-dimensional design." },
      { code: "ART 2B", title: "Design II", units: 3, description: "Principles of three-dimensional design." },
      { code: "ART 10", title: "Digital Imaging", units: 3, description: "Digital image editing and manipulation." },
      { code: "ART 20", title: "3D Modeling", units: 3, description: "Three-dimensional modeling and rendering." },
      { code: "ART 30", title: "Animation", units: 3, description: "Principles and techniques of animation." },
      { code: "PHOT 1", title: "Introduction to Photography", units: 3, description: "Photography fundamentals including camera operation and composition." },
    ],
    audio: [
      { code: "MUS 1A", title: "Music Theory I", units: 3, description: "Fundamentals of music theory." },
      { code: "MUS 1B", title: "Music Theory II", units: 3, description: "Continuation of music theory." },
      { code: "MUS 10", title: "Music Technology", units: 3, description: "Introduction to music technology and production." },
      { code: "MUS 20", title: "Audio Recording", units: 3, description: "Audio recording techniques and equipment." },
    ],
  },
  
  // EVERGREEN VALLEY COLLEGE
  evergreen: {
    business: [
      { code: "BUS 1", title: "Introduction to Business", units: 3, description: "Survey of business principles, practices, and environment." },
      { code: "BUS 10", title: "Business Law", units: 3, description: "Legal environment of business." },
      { code: "BUS 20", title: "Principles of Management", units: 3, description: "Management principles and practices." },
      { code: "BUS 30", title: "Principles of Marketing", units: 3, description: "Marketing concepts and strategies." },
      { code: "BUS 40", title: "Human Resource Management", units: 3, description: "Human resource management principles." },
      { code: "BUS 50", title: "Business Communication", units: 3, description: "Written and oral communication in business." },
      { code: "BUS 60", title: "Small Business Management", units: 3, description: "Management of small businesses." },
      { code: "BUS 70", title: "International Business", units: 3, description: "International business environment." },
      { code: "ACCT 1A", title: "Financial Accounting", units: 4, description: "Principles of financial accounting." },
      { code: "ACCT 1B", title: "Managerial Accounting", units: 4, description: "Accounting for management decision-making." },
      { code: "ECON 1", title: "Principles of Macroeconomics", units: 3, description: "Macroeconomic principles." },
      { code: "ECON 2", title: "Principles of Microeconomics", units: 3, description: "Microeconomic principles." },
    ],
    computerScience: [
      { code: "CS 10", title: "Introduction to Computer Science", units: 3, description: "Introduction to computer science and programming." },
      { code: "CS 20", title: "Programming in C++", units: 4, description: "Programming using C++." },
      { code: "CS 30", title: "Data Structures", units: 4, description: "Data structures and algorithms." },
      { code: "CS 40", title: "Computer Architecture", units: 3, description: "Computer organization and architecture." },
      { code: "CS 50", title: "Database Management", units: 3, description: "Database concepts and SQL." },
      { code: "CS 60", title: "Web Development", units: 3, description: "Web development technologies." },
      { code: "CS 70", title: "Operating Systems", units: 3, description: "Operating system concepts." },
      { code: "CS 80", title: "Computer Networks", units: 3, description: "Computer networking." },
    ],
    generalEducation: [
      { code: "ENGL 1A", title: "College Composition", units: 4, description: "Expository writing and critical thinking." },
      { code: "ENGL 1B", title: "Critical Thinking and Writing", units: 4, description: "Advanced composition and argumentation." },
      { code: "COMM 1", title: "Public Speaking", units: 3, description: "Theory and practice of public speaking." },
      { code: "MATH 1A", title: "Calculus I", units: 5, description: "Limits, derivatives, and applications." },
      { code: "MATH 1B", title: "Calculus II", units: 5, description: "Integration and series." },
      { code: "MATH 10", title: "Elementary Statistics", units: 4, description: "Statistical methods and applications." },
      { code: "MATH 71", title: "College Algebra", units: 4, description: "Algebraic operations and functions." },
      { code: "PSYC 1", title: "General Psychology", units: 3, description: "Introduction to psychology." },
      { code: "SOC 1", title: "Introduction to Sociology", units: 3, description: "Sociological perspective." },
      { code: "HIST 17A", title: "United States History to 1877", units: 3, description: "Survey of United States history." },
      { code: "HIST 17B", title: "United States History from 1865", units: 3, description: "Survey of United States history." },
      { code: "BIOL 10", title: "General Biology", units: 4, description: "Biological principles." },
      { code: "CHEM 1A", title: "General Chemistry I", units: 5, description: "Atomic structure and bonding." },
      { code: "PHYS 2A", title: "General Physics I", units: 4, description: "Mechanics." },
    ],
    digitalArts: [
      { code: "ART 1A", title: "Drawing I", units: 3, description: "Introduction to drawing." },
      { code: "ART 1B", title: "Drawing II", units: 3, description: "Advanced drawing techniques." },
      { code: "ART 2A", title: "Design I", units: 3, description: "Two-dimensional design principles." },
      { code: "ART 10", title: "Digital Imaging", units: 3, description: "Digital image editing." },
      { code: "ART 20", title: "3D Modeling", units: 3, description: "Three-dimensional modeling." },
      { code: "PHOT 1", title: "Introduction to Photography", units: 3, description: "Photography fundamentals." },
    ],
    audio: [
      { code: "MUS 1A", title: "Music Theory I", units: 3, description: "Fundamentals of music theory." },
      { code: "MUS 1B", title: "Music Theory II", units: 3, description: "Continuation of music theory." },
      { code: "MUS 10", title: "Music Technology", units: 3, description: "Music technology and production." },
    ],
  },
  
  // SIERRA COLLEGE
  sierra: {
    business: [
      { code: "BUS 1", title: "Introduction to Business", units: 3, description: "Survey of business principles and practices." },
      { code: "BUS 18", title: "Business Law", units: 3, description: "Legal environment of business." },
      { code: "BUS 20", title: "Principles of Management", units: 3, description: "Management principles and practices." },
      { code: "BUS 30", title: "Principles of Marketing", units: 3, description: "Marketing concepts and strategies." },
      { code: "BUS 40", title: "Human Resource Management", units: 3, description: "Human resource management principles." },
      { code: "BUS 50", title: "Business Communication", units: 3, description: "Written and oral communication in business." },
      { code: "BUS 60", title: "Small Business Management", units: 3, description: "Management of small businesses." },
      { code: "BUS 70", title: "International Business", units: 3, description: "International business environment." },
      { code: "ACCT 1A", title: "Financial Accounting", units: 4, description: "Principles of financial accounting." },
      { code: "ACCT 1B", title: "Managerial Accounting", units: 4, description: "Accounting for management decision-making." },
      { code: "ECON 1A", title: "Principles of Macroeconomics", units: 3, description: "Macroeconomic principles." },
      { code: "ECON 1B", title: "Principles of Microeconomics", units: 3, description: "Microeconomic principles." },
    ],
    computerScience: [
      { code: "CSCI 1", title: "Introduction to Computer Science", units: 3, description: "Introduction to computer science and programming." },
      { code: "CSCI 10", title: "Programming in C++", units: 4, description: "Programming using C++." },
      { code: "CSCI 20", title: "Data Structures", units: 4, description: "Data structures and algorithms." },
      { code: "CSCI 30", title: "Computer Architecture", units: 3, description: "Computer organization and architecture." },
      { code: "CSCI 40", title: "Database Management", units: 3, description: "Database concepts and SQL." },
      { code: "CSCI 50", title: "Web Development", units: 3, description: "Web development technologies." },
      { code: "CSCI 60", title: "Operating Systems", units: 3, description: "Operating system concepts." },
      { code: "CSCI 70", title: "Computer Networks", units: 3, description: "Computer networking." },
    ],
    generalEducation: [
      { code: "ENGL 1A", title: "College Composition", units: 3, description: "Expository writing and critical thinking." },
      { code: "ENGL 1B", title: "Critical Thinking and Writing", units: 3, description: "Advanced composition and argumentation." },
      { code: "COMM 1", title: "Public Speaking", units: 3, description: "Theory and practice of public speaking." },
      { code: "MATH 1A", title: "Calculus I", units: 5, description: "Limits, derivatives, and applications." },
      { code: "MATH 1B", title: "Calculus II", units: 5, description: "Integration and series." },
      { code: "MATH 13", title: "Elementary Statistics", units: 4, description: "Statistical methods and applications." },
      { code: "MATH 29", title: "College Algebra", units: 4, description: "Algebraic operations and functions." },
      { code: "PSYC 1", title: "General Psychology", units: 3, description: "Introduction to psychology." },
      { code: "SOC 1", title: "Introduction to Sociology", units: 3, description: "Sociological perspective." },
      { code: "HIST 17A", title: "United States History to 1877", units: 3, description: "Survey of United States history." },
      { code: "HIST 17B", title: "United States History from 1865", units: 3, description: "Survey of United States history." },
      { code: "BIOL 10", title: "General Biology", units: 4, description: "Biological principles." },
      { code: "CHEM 1A", title: "General Chemistry I", units: 5, description: "Atomic structure and bonding." },
      { code: "PHYS 4A", title: "General Physics I", units: 4, description: "Mechanics." },
    ],
    digitalArts: [
      { code: "ART 1A", title: "Drawing I", units: 3, description: "Introduction to drawing." },
      { code: "ART 1B", title: "Drawing II", units: 3, description: "Advanced drawing techniques." },
      { code: "ART 2A", title: "Design I", units: 3, description: "Two-dimensional design principles." },
      { code: "ART 10", title: "Digital Imaging", units: 3, description: "Digital image editing." },
      { code: "ART 20", title: "3D Modeling", units: 3, description: "Three-dimensional modeling." },
      { code: "PHOT 1", title: "Introduction to Photography", units: 3, description: "Photography fundamentals." },
    ],
    audio: [
      { code: "MUS 1A", title: "Music Theory I", units: 3, description: "Fundamentals of music theory." },
      { code: "MUS 1B", title: "Music Theory II", units: 3, description: "Continuation of music theory." },
      { code: "MUS 10", title: "Music Technology", units: 3, description: "Music technology and production." },
    ],
  },
};

async function seedExpandedCourses() {
  console.log("Starting expanded course seeding...");
  
  // Get institution IDs
  const institutionMap = {
    foothill: "Foothill College",
    deanza: "De Anza College",
    sjcc: "San José City College",
    evergreen: "Evergreen Valley College",
    sierra: "Sierra College",
  };
  
  const institutionIds = {};
  for (const [key, name] of Object.entries(institutionMap)) {
    const result = await db.select().from(institutions).where(eq(institutions.name, name)).limit(1);
    if (result.length > 0) {
      institutionIds[key] = result[0].id;
    }
  }
  
  console.log("Institution IDs:", institutionIds);
  
  let totalCoursesAdded = 0;
  
  // Seed courses for each institution
  for (const [collegeKey, categories] of Object.entries(expandedCourses)) {
    const institutionId = institutionIds[collegeKey];
    if (!institutionId) {
      console.log(`Skipping ${collegeKey} - institution not found`);
      continue;
    }
    
    console.log(`\nSeeding courses for ${institutionMap[collegeKey]}...`);
    
    for (const [category, coursesArray] of Object.entries(categories)) {
      console.log(`  - ${category}: ${coursesArray.length} courses`);
      
      for (const course of coursesArray) {
        try {
          // Check if course already exists
          const existing = await db.select().from(courses)
            .where(and(
              eq(courses.courseCode, course.code),
              eq(courses.institutionId, institutionId)
            ))
            .limit(1);
          
          if (existing.length === 0) {
            await db.insert(courses).values({
              institutionId,
              courseCode: course.code,
              title: course.title,
              units: Math.round(course.units), // Convert to integer
              description: course.description,
            });
            totalCoursesAdded++;
            console.log(`    ✓ Added ${course.code}`);
          } else {
            console.log(`    - Skipped ${course.code} (exists)`);
          }
        } catch (error) {
          console.error(`    ✗ Error adding course ${course.code}:`, error.message);
        }
      }
    }
  }
  
  console.log(`\n✅ Seeding complete! Added ${totalCoursesAdded} new courses.`);
  
  // Print summary
  const summary = await db.select().from(courses);
  console.log(`\nTotal courses in database: ${summary.length}`);
  
  // Count by institution
  for (const [key, name] of Object.entries(institutionMap)) {
    const institutionId = institutionIds[key];
    if (institutionId) {
      const count = await db.select().from(courses).where(eq(courses.institutionId, institutionId));
      console.log(`  - ${name}: ${count.length} courses`);
    }
  }
}

seedExpandedCourses()
  .then(() => {
    console.log("\n🎉 Expanded course catalog seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding expanded courses:", error);
    process.exit(1);
  });
