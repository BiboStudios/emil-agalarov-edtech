import {
  Student,
  AttendanceRecord,
  ExamResult,
  TuitionPayment,
  LessonVideo,
  Quiz,
  FlashcardDeck,
  HomeworkItem
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    name: 'Murad Əliyev',
    group: 'B1',
    parentPhone: '+994 50 234 56 78',
    studentPhone: '+994 70 234 56 78',
    monthlyFee: 120,
    accessCode: 'MURA-2026',
    joinedDate: '2026-09-01',
    email: 'murad.aliyev@gmail.com',
    notes: 'Qrammatika biliyi çox güclüdür, lüğət ehtiyatını zənginləşdirməyə fokuslanır.'
  },
  {
    id: 'stu-2',
    name: 'Ayan Məmmədova',
    group: 'A2',
    parentPhone: '+994 55 345 67 89',
    studentPhone: '+994 55 345 67 80',
    monthlyFee: 120,
    accessCode: 'AYAN-2026',
    joinedDate: '2026-09-05',
    email: 'ayan.m@mail.ru',
    notes: 'Speaking dərslərində aktivdir, dinləmə tapşırıqlarını yaxşı mənimsəyir.'
  },
  {
    id: 'stu-3',
    name: 'Fərid Qasımov',
    group: 'B1',
    parentPhone: '+994 70 456 78 90',
    studentPhone: '+994 50 456 78 91',
    monthlyFee: 140,
    accessCode: 'FARI-2026',
    joinedDate: '2026-08-15',
    email: 'farid.gasimov@code.edu.az',
    notes: 'IELTS hədəfi var. Writing esseləri üzərində əlavə çalışır.'
  },
  {
    id: 'stu-4',
    name: 'Leyla Həsənli',
    group: 'A1',
    parentPhone: '+994 50 567 89 01',
    studentPhone: '+994 55 567 89 02',
    monthlyFee: 100,
    accessCode: 'LEYL-2026',
    joinedDate: '2026-10-01',
    email: 'leyla.hasanli@gmail.com',
    notes: 'Sıfırdan başladı, çox çalışqandır. Əsas cümlə quruluşlarını öyrənir.'
  },
  {
    id: 'stu-5',
    name: 'Nihad İsmayılov',
    group: 'A2',
    parentPhone: '+994 77 678 90 12',
    studentPhone: '+994 77 678 90 13',
    monthlyFee: 120,
    accessCode: 'NIHA-2026',
    joinedDate: '2026-09-10',
    email: 'nihad.ismayil@yahoo.com',
    notes: 'Qaydalara diqqətlidir, ev tapşırıqlarını həmişə vaxtında təhvil verir.'
  },
  {
    id: 'stu-6',
    name: 'Zəhra Rəhimova',
    group: 'B1',
    parentPhone: '+994 51 789 01 23',
    studentPhone: '+994 51 789 01 24',
    monthlyFee: 130,
    accessCode: 'ZAHR-2026',
    joinedDate: '2026-08-20',
    email: 'zahra.rahimova@icloud.com',
    notes: 'Listening və Reading balları ən yüksək nəticələrdəndir.'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Murad Əliyev (stu-1)
  { id: 'att-101', date: '2026-11-14', studentId: 'stu-1', status: 'present', topic: 'Present Perfect vs Past Simple' },
  { id: 'att-102', date: '2026-11-12', studentId: 'stu-1', status: 'present', topic: 'Phrasal Verbs with Look & Get' },
  { id: 'att-103', date: '2026-11-10', studentId: 'stu-1', status: 'late', topic: 'Conditionals Type 1 & 2', note: '10 dəqiqə gecikdi (yol tıxacı)' },
  { id: 'att-104', date: '2026-11-07', studentId: 'stu-1', status: 'present', topic: 'Listening & Discussion: Technology' },
  { id: 'att-105', date: '2026-11-05', studentId: 'stu-1', status: 'present', topic: 'Passive Voice in Present & Past' },
  { id: 'att-106', date: '2026-11-03', studentId: 'stu-1', status: 'excused', topic: 'Reading Comprehension Mock', note: 'Məktəb tədbiri səbəbilə icazəli' },
  { id: 'att-107', date: '2026-10-31', studentId: 'stu-1', status: 'present', topic: 'Relative Clauses: Who, Which, That' },

  // Ayan Məmmədova (stu-2)
  { id: 'att-201', date: '2026-11-14', studentId: 'stu-2', status: 'present', topic: 'Past Continuous & Past Simple' },
  { id: 'att-202', date: '2026-11-12', studentId: 'stu-2', status: 'present', topic: 'Modal Verbs: Should, Must, Have to' },
  { id: 'att-203', date: '2026-11-10', studentId: 'stu-2', status: 'absent', topic: 'Prepositions of Place & Movement', note: 'Xəstələndiyi bildirildi' },
  { id: 'att-204', date: '2026-11-07', studentId: 'stu-2', status: 'present', topic: 'Comparatives & Superlatives' },
  { id: 'att-205', date: '2026-11-05', studentId: 'stu-2', status: 'present', topic: 'Daily Routines & Irregular Verbs' },

  // Fərid Qasımov (stu-3)
  { id: 'att-301', date: '2026-11-14', studentId: 'stu-3', status: 'present', topic: 'Present Perfect vs Past Simple' },
  { id: 'att-302', date: '2026-11-12', studentId: 'stu-3', status: 'present', topic: 'Phrasal Verbs with Look & Get' },
  { id: 'att-303', date: '2026-11-10', studentId: 'stu-3', status: 'present', topic: 'Conditionals Type 1 & 2' },
  { id: 'att-304', date: '2026-11-07', studentId: 'stu-3', status: 'present', topic: 'Listening & Discussion: Technology' },

  // Leyla Həsənli (stu-4)
  { id: 'att-401', date: '2026-11-14', studentId: 'stu-4', status: 'present', topic: 'Verb To Be & Simple Questions' },
  { id: 'att-402', date: '2026-11-12', studentId: 'stu-4', status: 'present', topic: 'Possessive Adjectives & Family Vocab' },
  { id: 'att-403', date: '2026-11-10', studentId: 'stu-4', status: 'present', topic: 'Present Simple: He/She/It rules' },

  // Nihad İsmayılov (stu-5)
  { id: 'att-501', date: '2026-11-14', studentId: 'stu-5', status: 'late', topic: 'Past Continuous & Past Simple' },
  { id: 'att-502', date: '2026-11-12', studentId: 'stu-5', status: 'present', topic: 'Modal Verbs: Should, Must, Have to' },

  // Zəhra Rəhimova (stu-6)
  { id: 'att-601', date: '2026-11-14', studentId: 'stu-6', status: 'present', topic: 'Present Perfect vs Past Simple' },
  { id: 'att-602', date: '2026-11-12', studentId: 'stu-6', status: 'present', topic: 'Phrasal Verbs with Look & Get' }
];

export const INITIAL_EXAMS: ExamResult[] = [
  // Murad Əliyev (stu-1) - Shows nice upward progress!
  {
    id: 'exam-101',
    studentId: 'stu-1',
    examTitle: 'Sentyabr Diaqnostik Sınaq İmtahanı',
    date: '2026-09-28',
    readingScore: 18,
    listeningScore: 16,
    grammarScore: 20,
    vocabularyScore: 17,
    totalScore: 71,
    maxScore: 100,
    teacherFeedback: 'Ümumi baza yaxşıdır. Xüsusilə qrammatika qaydalarını sürətli xatırlayır. Dinləmə və yeni sözlərə daha çox diqqət yetirməliyik.'
  },
  {
    id: 'exam-102',
    studentId: 'stu-1',
    examTitle: 'Oktyabr Aylıq İnkişaf Sınağı',
    date: '2026-10-25',
    readingScore: 21,
    listeningScore: 19,
    grammarScore: 23,
    vocabularyScore: 20,
    totalScore: 83,
    maxScore: 100,
    teacherFeedback: 'Əla irəliləyiş! Dinləmə bölməsində nəzərəçarpan artım var. Zamanlar arasındakı fərqləri artıq çaşdırmır. Belə davam et!'
  },
  {
    id: 'exam-103',
    studentId: 'stu-1',
    examTitle: 'Noyabr Aralıq Qiymətləndirmə (Mock Exam)',
    date: '2026-11-12',
    readingScore: 24,
    listeningScore: 22,
    grammarScore: 24,
    vocabularyScore: 22,
    totalScore: 92,
    maxScore: 100,
    teacherFeedback: 'Möhtəşəm nəticə! B1 səviyyəsini uğurla tamamlayır. İfadələr və idiomların istifadəsi çox yerində idi. Təbrik edirəm!'
  },

  // Ayan Məmmədova (stu-2)
  {
    id: 'exam-201',
    studentId: 'stu-2',
    examTitle: 'Sentyabr Diaqnostik Sınaq İmtahanı',
    date: '2026-09-28',
    readingScore: 15,
    listeningScore: 17,
    grammarScore: 16,
    vocabularyScore: 16,
    totalScore: 64,
    maxScore: 100,
    teacherFeedback: 'Danışıq və tələffüzü gözəldir. Qrammatik zaman formalarında bəzi boşluqlar var, dərslərdə təkrar edəcəyik.'
  },
  {
    id: 'exam-202',
    studentId: 'stu-2',
    examTitle: 'Oktyabr Aylıq İnkişaf Sınağı',
    date: '2026-10-25',
    readingScore: 19,
    listeningScore: 21,
    grammarScore: 19,
    vocabularyScore: 18,
    totalScore: 77,
    maxScore: 100,
    teacherFeedback: 'Söz ehtiyatında böyük artım hiss olunur. Dərslərə davamiyyəti qoruyub saxlamaq çox önəmlidir.'
  },

  // Fərid Qasımov (stu-3)
  {
    id: 'exam-301',
    studentId: 'stu-3',
    examTitle: 'Oktyabr Aylıq İnkişaf Sınağı',
    date: '2026-10-25',
    readingScore: 23,
    listeningScore: 22,
    grammarScore: 21,
    vocabularyScore: 21,
    totalScore: 87,
    maxScore: 100,
    teacherFeedback: 'Writing tapşırıqlarında cümlə zənginliyi artır. IELTS formatına uyğun sınaqlara başlamaq vaxtıdır.'
  },
  {
    id: 'exam-302',
    studentId: 'stu-3',
    examTitle: 'Noyabr Aralıq Qiymətləndirmə (Mock Exam)',
    date: '2026-11-12',
    readingScore: 24,
    listeningScore: 24,
    grammarScore: 22,
    vocabularyScore: 23,
    totalScore: 93,
    maxScore: 100,
    teacherFeedback: 'Yüksək səviyyəli akademik yanaşma. Listening hissəsində demək olar ki, səhvsiz yazdı.'
  },

  // Leyla Həsənli (stu-4)
  {
    id: 'exam-401',
    studentId: 'stu-4',
    examTitle: 'Noyabr Aralıq Qiymətləndirmə (Mock Exam)',
    date: '2026-11-12',
    readingScore: 18,
    listeningScore: 17,
    grammarScore: 19,
    vocabularyScore: 18,
    totalScore: 72,
    maxScore: 100,
    teacherFeedback: 'Birinci ay üçün çox gözəl nəticə! A1 səviyyəsini möhkəmləndirir, cəsarətlə danışmağa davam etməlidir.'
  },

  // Zəhra Rəhimova (stu-6)
  {
    id: 'exam-601',
    studentId: 'stu-6',
    examTitle: 'Noyabr Aralıq Qiymətləndirmə (Mock Exam)',
    date: '2026-11-12',
    readingScore: 25,
    listeningScore: 24,
    grammarScore: 23,
    vocabularyScore: 24,
    totalScore: 96,
    maxScore: 100,
    teacherFeedback: 'Qrupun ən yüksək nəticəsi! Dərslərə məsuliyyəti və müstəqil mütaliəsi təqdirəlayiqdir.'
  }
];

export const INITIAL_TUITION: TuitionPayment[] = [
  {
    id: 'tui-1',
    studentId: 'stu-1',
    monthYear: '2026-11',
    amount: 120,
    status: 'paid',
    paymentDate: '2026-11-03',
    receiptNote: 'MilliÖn terminal vasitəsilə ödənilib.'
  },
  {
    id: 'tui-2',
    studentId: 'stu-2',
    monthYear: '2026-11',
    amount: 120,
    status: 'pending',
    paymentDate: undefined,
    receiptNote: 'Valideynlə danışıldı, ayın 20-dək ödəniləcək.'
  },
  {
    id: 'tui-3',
    studentId: 'stu-3',
    monthYear: '2026-11',
    amount: 140,
    status: 'paid',
    paymentDate: '2026-11-02',
    receiptNote: 'Bank kartına köçürmə.'
  },
  {
    id: 'tui-4',
    studentId: 'stu-4',
    monthYear: '2026-11',
    amount: 100,
    status: 'paid',
    paymentDate: '2026-11-05',
    receiptNote: 'Nağd ödənilib.'
  },
  {
    id: 'tui-5',
    studentId: 'stu-5',
    monthYear: '2026-11',
    amount: 120,
    status: 'overdue',
    paymentDate: undefined,
    receiptNote: 'Xatırlatma mesajı göndərildi.'
  },
  {
    id: 'tui-6',
    studentId: 'stu-6',
    monthYear: '2026-11',
    amount: 130,
    status: 'paid',
    paymentDate: '2026-11-01',
    receiptNote: 'Kartdan karta köçürmə.'
  }
];

export const INITIAL_VIDEOS: LessonVideo[] = [
  {
    id: 'vid-1',
    title: 'Present Perfect vs Past Simple: Əsas Fərqlər və İstifadə Qaydaları',
    description: 'Nə vaxt Have/Has + V3, nə vaxt isə keçmiş sadə zaman istifadə olunur? "Since", "For", "Already", "Yet" açar sözləri və cümlə nümunələri.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYJzZq1u65Y',
    videoId: 'kYJzZq1u65Y',
    level: 'B1',
    topic: 'Tenses',
    duration: '14:20',
    uploadDate: '2026-11-05'
  },
  {
    id: 'vid-2',
    title: 'Modal Verbs: Can, Could, Must, Should və Have To fərqi',
    description: 'Qabiliyyət, məcburiyyət və məsləhət bildirən modal fellərin dərindən izahı. Gündəlik ingilis dilində ən çox edilən səhvlər.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Nk9nQwoCGu8',
    videoId: 'Nk9nQwoCGu8',
    level: 'A2',
    topic: 'Modal Verbs',
    duration: '12:45',
    uploadDate: '2026-10-28'
  },
  {
    id: 'vid-3',
    title: 'Gündəlik Danışıqda Ən Çox İşlənən 25 Phrasal Verb (Frazeoloji Feillər)',
    description: 'Look after, give up, break down, run out of və daha çoxu. Nümunə dialoqlarla yadda saxlamağın asan metodları.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kM6d9i0eE3s',
    videoId: 'kM6d9i0eE3s',
    level: 'B1',
    topic: 'Vocabulary',
    duration: '18:10',
    uploadDate: '2026-11-01'
  },
  {
    id: 'vid-4',
    title: 'İngilis Dilində Tələffüz və Dinləməni İnkşaf Etdirməyin 5 Qızıl Qaydası',
    description: 'Native speaker-ləri anlamaq üçün "connected speech", "linking sounds" və reduksiya olunmuş saitlərin izahı.',
    youtubeUrl: 'https://www.youtube.com/watch?v=vV77mJ3x7xM',
    videoId: 'vV77mJ3x7xM',
    level: 'All',
    topic: 'Listening',
    duration: '16:30',
    uploadDate: '2026-10-15'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Present Perfect vs Past Simple Master Quiz',
    topic: 'Tenses',
    level: 'B1',
    description: 'Present Perfect və Past Simple zamanlarının fərqləndirilməsi üzrə 5 sualdan ibarət yoxlama testi.',
    durationMinutes: 10,
    questions: [
      {
        id: 'q1-1',
        question: 'I ___ to London twice, but I ___ there last year.',
        options: [
          'have been / went',
          'went / have been',
          'have gone / went',
          'was / have gone'
        ],
        correctAnswerIndex: 0,
        explanation: 'Həyat təcrübəsindən danışarkən zaman göstərilməyibsə "have been", keçmişdə dəqiq zaman ("last year") verildikdə isə Past Simple ("went") işlənir.'
      },
      {
        id: 'q1-2',
        question: 'She hasn’t finished her homework ___.',
        options: [
          'already',
          'yet',
          'since',
          'just'
        ],
        correctAnswerIndex: 1,
        explanation: 'İnkar və sual cümlələrinin sonunda "hələ də" mənasında adətən "yet" istifadə olunur.'
      },
      {
        id: 'q1-3',
        question: 'When ___ your new car?',
        options: [
          'have you bought',
          'did you buy',
          'you bought',
          'did you bought'
        ],
        correctAnswerIndex: 1,
        explanation: '"When" sual sözü dəqiq keçmiş zaman anını soruşduğu üçün Past Simple sual forması ("did you buy") tələb edir.'
      },
      {
        id: 'q1-4',
        question: 'He ___ in Baku since 2018.',
        options: [
          'lives',
          'lived',
          'has lived',
          'is living'
        ],
        correctAnswerIndex: 2,
        explanation: '"Since" (filan tarixdən bəri) keçmişdə başlayıb hələ də davam edən vəziyyətləri bildirdiyi üçün Present Perfect ("has lived") tələb edir.'
      },
      {
        id: 'q1-5',
        question: 'Oh no! I ___ my keys. I can\'t open the door now!',
        options: [
          'lost',
          'have lost',
          'was losing',
          'had lost'
        ],
        correctAnswerIndex: 1,
        explanation: 'Hadisə keçmişdə baş versə də nəticəsi indiki zamana birbaşa təsir edir ("qapını aça bilmirəm"). Bu halda Present Perfect ("have lost") işlənir.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Modal Verbs: Can, Must, Should, Have to',
    topic: 'Modal Verbs',
    level: 'A2',
    description: 'Qabiliyyət, nəsihət və qayda-qanun bildirən modal fellərin praktiki testi.',
    durationMinutes: 8,
    questions: [
      {
        id: 'q2-1',
        question: 'You ___ wear a seatbelt while driving. It is the law!',
        options: [
          'should',
          'might',
          'must',
          'can'
        ],
        correctAnswerIndex: 2,
        explanation: 'Rəsmi qanun və mütləq qaydaları ifadə etmək üçün güclü məcburiyyət bildirən "must" istifadə olunur.'
      },
      {
        id: 'q2-2',
        question: 'You look very tired. You ___ go to bed early tonight.',
        options: [
          'should',
          'must',
          'have to',
          'could not'
        ],
        correctAnswerIndex: 0,
        explanation: 'Dostcasına məsləhət və tövsiyə vermək üçün "should" istifadə edilir.'
      },
      {
        id: 'q2-3',
        question: 'Tomorrow is Sunday! We ___ wake up early.',
        options: [
          'mustn’t',
          'don’t have to',
          'shouldn’t',
          'can’t'
        ],
        correctAnswerIndex: 1,
        explanation: 'Məcburiyyətin olmadığını ("ehtiyac yoxdur") bildirmək üçün "don\'t have to" işlənir. "Mustn\'t" isə qadağa bildirir.'
      },
      {
        id: 'q2-4',
        question: 'Excuse me, ___ you tell me the way to the metro station?',
        options: [
          'must',
          'could',
          'should',
          'need'
        ],
        correctAnswerIndex: 1,
        explanation: 'Nəzakətli xahiş və müraciət zamanı "Could you...?" ən uyğun formadır.'
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'Essential Vocabulary & Prepositions Quiz',
    topic: 'Vocabulary',
    level: 'A1',
    description: 'Zaman və məkan sözönüləri (in, on, at) və vacib gündəlik ifadələr.',
    durationMinutes: 7,
    questions: [
      {
        id: 'q3-1',
        question: 'The English lesson starts ___ 15:00 ___ Monday.',
        options: [
          'at / on',
          'in / at',
          'on / in',
          'at / in'
        ],
        correctAnswerIndex: 0,
        explanation: 'Dəqiq saatlar üçün "at" (at 15:00), həftənin günləri üçün isə "on" (on Monday) istifadə olunur.'
      },
      {
        id: 'q3-2',
        question: 'My brother was born ___ July, ___ 2005.',
        options: [
          'in / in',
          'on / in',
          'at / on',
          'in / on'
        ],
        correctAnswerIndex: 0,
        explanation: 'Aylar və illər təkbaşına işləndikdə "in" sözönüsü qəbul edir (in July, in 2005).'
      },
      {
        id: 'q3-3',
        question: 'We usually go on vacation ___ summer.',
        options: [
          'at',
          'on',
          'in',
          'to'
        ],
        correctAnswerIndex: 2,
        explanation: 'Fəsillər qarşısında "in" sözönüsü işlənir (in summer, in winter).'
      },
      {
        id: 'q3-4',
        question: 'What does "look after" mean in Azerbaijani?',
        options: [
          'Axtarmaq',
          'Qayğısına qalmaq / baxmaq',
          'Gözləmək',
          'Görünmək'
        ],
        correctAnswerIndex: 1,
        explanation: '"Look after" frazeoloji feli Azərbaycan dilində "qayğısına qalmaq, qorumaq, baxmaq" deməkdir.'
      }
    ]
  }
];

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'B1 Essential Phrasal Verbs (Frazeoloji Fellər)',
    level: 'B1',
    description: 'İmtahanlarda və real danışıqda ən çox qarşıya çıxan 10 vacib frazeoloji fel.',
    cards: [
      {
        id: 'fc-1',
        front: 'Look after',
        back: 'Qayğısına qalmaq, baxmaq',
        phonetic: '/lʊk ˈɑːftər/',
        exampleSentence: 'Can you please look after my cat while I am on vacation?',
        level: 'B1'
      },
      {
        id: 'fc-2',
        front: 'Give up',
        back: 'Təslim olmaq, vərdişi atmaq',
        phonetic: '/ɡɪv ʌp/',
        exampleSentence: 'Never give up on your dreams, keep practicing every day!',
        level: 'B1'
      },
      {
        id: 'fc-3',
        front: 'Run out of',
        back: 'Qurtarmaq, tükənmək (ehtiyat)',
        phonetic: '/rʌn aʊt əv/',
        exampleSentence: 'We have run out of milk, I need to go to the supermarket.',
        level: 'B1'
      },
      {
        id: 'fc-4',
        front: 'Figure out',
        back: 'Həll etmək, başa düşmək',
        phonetic: '/ˈfɪɡjər aʊt/',
        exampleSentence: 'I finally figured out how to solve this grammar puzzle.',
        level: 'B1'
      },
      {
        id: 'fc-5',
        front: 'Put off',
        back: 'Təxirə salmaq, gecikdirmək',
        phonetic: '/pʊt ɒf/',
        exampleSentence: 'Don\'t put off until tomorrow what you can do today.',
        level: 'B1'
      },
      {
        id: 'fc-6',
        front: 'Carry on',
        back: 'Davam etmək',
        phonetic: '/ˈkæri ɒn/',
        exampleSentence: 'Please carry on reading while I write down the new words.',
        level: 'B1'
      },
      {
        id: 'fc-7',
        front: 'Come across',
        back: 'Təsadüfən rast gəlmək',
        phonetic: '/kʌm əˈkrɒs/',
        exampleSentence: 'I came across an interesting English article yesterday.',
        level: 'B1'
      },
      {
        id: 'fc-8',
        front: 'Break down',
        back: 'Xarab olmaq (maşın/cihaz)',
        phonetic: '/breɪk daʊn/',
        exampleSentence: 'Our car broke down on the way to Shusha.',
        level: 'B1'
      }
    ]
  },
  {
    id: 'deck-2',
    title: 'Oxford 3000 Academic & Daily Vocabulary',
    level: 'A2',
    description: 'A2 və B1 səviyyəsində səlis danışıq üçün zəruri olan sözlər.',
    cards: [
      {
        id: 'fc-201',
        front: 'Improve',
        back: 'Təkmilləşdirmək, inkişaf etdirmək',
        phonetic: '/ɪmˈpruːv/',
        exampleSentence: 'Reading English books helps improve your vocabulary.',
        level: 'A2'
      },
      {
        id: 'fc-202',
        front: 'Opportunity',
        back: 'İmkan, fürsət',
        phonetic: '/ˌɒpəˈtjuːnəti/',
        exampleSentence: 'Studying with Emil teacher is a great opportunity to learn fast.',
        level: 'A2'
      },
      {
        id: 'fc-203',
        front: 'Fluently',
        back: 'Səlis, axıcı şəkildə',
        phonetic: '/ˈfluːəntli/',
        exampleSentence: 'My goal is to speak English fluently in 6 months.',
        level: 'A2'
      },
      {
        id: 'fc-204',
        front: 'Confident',
        back: 'Özünə güvənən, əmin',
        phonetic: '/ˈkɒnfɪdənt/',
        exampleSentence: 'Be confident when speaking during the lesson.',
        level: 'A2'
      },
      {
        id: 'fc-205',
        front: 'Achieve',
        back: 'Nail olmaq, qazanmaq',
        phonetic: '/əˈtʃiːv/',
        exampleSentence: 'With hard work, you can achieve a band score 7.5 in IELTS.',
        level: 'B1'
      }
    ]
  }
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'Unit 4: Present Perfect vs Past Simple Çalışma Dəftəri',
    description: 'Təqdim olunmuş PDF vəsaitindəki Səhifə 42-45 arasındakı 25 testi tamamlayın və 100 sözlük qısa inşa ("My Best Travel Experience") yazın.',
    group: 'B1',
    dueDate: '2026-11-18',
    resourceName: 'Unit4_Present_Perfect_Workbook.pdf',
    resourceUrl: '#'
  },
  {
    id: 'hw-2',
    title: 'Reading Comprehension: "The Digital Revolution"',
    description: 'Mətni diqqətlə oxuyun, naməlum 10 sözün mənasını lüğətdən tapıb dəftərinizə qeyd edin və mətn sonundakı 5 suala yazılı cavab hazırlayın.',
    group: 'B1',
    dueDate: '2026-11-20',
    resourceName: 'Reading_Passage_Digital_Era.pdf',
    resourceUrl: '#'
  },
  {
    id: 'hw-3',
    title: 'Modal Verbs A2 Practice Sheet (Can, Must, Should)',
    description: 'Qaydaları təkrar edin və 20 cümlədə boşluqları uyğun modal feillərlə doldurun.',
    group: 'A2',
    dueDate: '2026-11-19',
    resourceName: 'Modal_Verbs_Practice_A2.pdf',
    resourceUrl: '#'
  }
];
