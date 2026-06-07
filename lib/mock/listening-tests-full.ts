import type { FullListeningTest } from '@/lib/types/ielts'

export const mockFullListeningTests: FullListeningTest[] = [
  {
    id: 'lt-1',
    title: 'Listening Practice Test 1',
    sectionCount: 4,
    questionCount: 20,
    durationMinutes: 30,
    audioUrl: '/audio/lt-1-combined.mp3',
    status: 'published',
    createdAt: '2025-08-15',
    sections: [
      {
        id: 'lt-1-s1',
        sectionNumber: 1,
        audioUrl: '/audio/lt-1-section-1.mp3',
        audioDurationSeconds: 420,
        transcript: `Receptionist: Good morning, City Sports Centre. How can I help you?

Caller: Hi, I'd like to enquire about joining the centre and the classes available.

Receptionist: Of course. We have memberships starting from £35 per month for basic access, which includes use of the gym and swimming pool. Full membership at £55 per month also covers all group fitness classes.

Caller: That sounds good. What classes do you run?

Receptionist: We have yoga on Monday and Wednesday evenings at 7pm, a spinning class on Tuesday and Thursday mornings at 6:30am, a Pilates class on Saturday at 10am, and a high-intensity interval training class — we call it HIIT — on Friday lunchtime at 12:30.

Caller: I'm particularly interested in yoga. Is it suitable for beginners?

Receptionist: Yes, absolutely. The Monday class is specifically for beginners, while the Wednesday class is for intermediate and advanced practitioners.

Caller: Perfect. And what do I need to bring?

Receptionist: For yoga you'll need comfortable clothing and we recommend bringing your own mat, although we do hire them out for £2 per session if you don't have one yet. You'll also need to bring a small towel and a water bottle.

Caller: Great. Can I register online?

Receptionist: Yes, you can register and pay for membership on our website at www.citysportscentre.co.uk. Or you can come in person — we're open from 6am to 10pm Monday to Friday, and 8am to 8pm on weekends.`,
        questions: [
          {
            id: 'lt-1-s1-q1',
            type: 'fill-blank',
            questionNumber: 1,
            stem: 'The basic monthly membership costs £________ and includes gym and swimming pool access.',
            correctAnswer: '35',
          },
          {
            id: 'lt-1-s1-q2',
            type: 'fill-blank',
            questionNumber: 2,
            stem: 'The yoga class for beginners is held on ________ evenings.',
            correctAnswer: 'Monday',
          },
          {
            id: 'lt-1-s1-q3',
            type: 'mcq',
            questionNumber: 3,
            stem: 'How much does it cost to hire a yoga mat per session?',
            options: [
              { label: 'A', text: '£1' },
              { label: 'B', text: '£2' },
              { label: 'C', text: '£3' },
              { label: 'D', text: '£5' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'lt-1-s1-q4',
            type: 'fill-blank',
            questionNumber: 4,
            stem: 'The sports centre website address is www.________.co.uk.',
            correctAnswer: 'citysportscentre',
          },
          {
            id: 'lt-1-s1-q5',
            type: 'mcq',
            questionNumber: 5,
            stem: 'What are the weekend opening hours?',
            options: [
              { label: 'A', text: '6am to 10pm' },
              { label: 'B', text: '7am to 9pm' },
              { label: 'C', text: '8am to 8pm' },
              { label: 'D', text: '9am to 7pm' },
            ],
            correctAnswer: 'C',
          },
        ],
      },
      {
        id: 'lt-1-s2',
        sectionNumber: 2,
        audioUrl: '/audio/lt-1-section-2.mp3',
        audioDurationSeconds: 390,
        transcript: `Tour guide: Welcome everyone to the Greenfield Nature Reserve. My name is David and I'll be your guide today. Before we set off, let me give you some important information about the reserve and today's tour.

The reserve covers 450 hectares and is home to over 200 species of bird, as well as populations of red deer, otters, and rare bat species. We have three walking trails of different lengths. The Blue Trail is 2.5 kilometres and takes approximately one hour — this is the route we'll be taking today. The Red Trail is 5 kilometres and takes two to three hours, and the Gold Trail is 8 kilometres and is a full-day hike.

During the tour, please stay on the marked paths at all times to protect the habitat. Photography is welcome, but please do not use flash near wildlife as it can disturb the animals. We ask that you keep voices low, particularly when we're near the bird hides.

We have two rest stops today. The first is at the Kingfisher Hide at approximately the halfway point, where you may be lucky enough to spot kingfishers along the river. The second stop will be at the Deer Meadow viewing platform, where we often see red deer grazing in the early evening.

The visitor centre, which you can see behind you, contains an exhibition about the local ecology, a café serving hot drinks and light meals, and a gift shop. The centre closes at 5:30pm. Any questions before we begin?`,
        questions: [
          {
            id: 'lt-1-s2-q1',
            type: 'fill-blank',
            questionNumber: 6,
            stem: 'The Greenfield Nature Reserve covers ________ hectares.',
            correctAnswer: '450',
          },
          {
            id: 'lt-1-s2-q2',
            type: 'mcq',
            questionNumber: 7,
            stem: 'Which trail will the group be taking today?',
            options: [
              { label: 'A', text: 'The Gold Trail' },
              { label: 'B', text: 'The Red Trail' },
              { label: 'C', text: 'The Blue Trail' },
              { label: 'D', text: 'The Green Trail' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-1-s2-q3',
            type: 'fill-blank',
            questionNumber: 8,
            stem: 'Photography is allowed but visitors should not use ________ near wildlife.',
            correctAnswer: 'flash',
          },
          {
            id: 'lt-1-s2-q4',
            type: 'mcq',
            questionNumber: 9,
            stem: 'What is the first rest stop on today\'s tour?',
            options: [
              { label: 'A', text: 'The Deer Meadow viewing platform' },
              { label: 'B', text: 'The visitor centre café' },
              { label: 'C', text: 'The Kingfisher Hide' },
              { label: 'D', text: 'The river bank' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-1-s2-q5',
            type: 'fill-blank',
            questionNumber: 10,
            stem: 'The visitor centre closes at ________ pm.',
            correctAnswer: '5:30',
          },
        ],
      },
      {
        id: 'lt-1-s3',
        sectionNumber: 3,
        audioUrl: '/audio/lt-1-section-3.mp3',
        audioDurationSeconds: 450,
        transcript: `Tutor: Right, so let's talk about your group project. You've got about three weeks left. How are you getting on?

Student A — Maria: We've done most of the background reading and we've divided up the sections between us. I'm doing the literature review, Jamie is doing the methodology, and Priya is working on the data analysis.

Student B — Jamie: The main thing we're struggling with is integrating our sections. They feel a bit disjointed at the moment.

Tutor: That's very common with group projects. The key is to establish a consistent argument that runs through all your sections. Have you agreed on a central thesis yet?

Maria: Sort of. We've all been approaching it slightly differently.

Tutor: I'd suggest having a meeting this week specifically to agree on your central argument. Write it down as a single sentence and make sure everyone understands how their section connects to it.

Priya: Should we all write our sections independently and then combine them, or should we be checking in with each other as we go?

Tutor: Definitely the latter. I'd recommend sharing drafts at least twice a week so you can give each other feedback and make sure things are aligned. Also, make sure someone takes responsibility for the final edit — the overall style and referencing needs to be consistent.

Jamie: How long should the final report be?

Tutor: The guidelines say 5,000 words, not including references and appendices. And make sure you use the Harvard referencing system, which is the departmental standard.`,
        questions: [
          {
            id: 'lt-1-s3-q1',
            type: 'matching',
            questionNumber: 11,
            stem: 'Match each student to the section they are responsible for.',
            options: [
              { key: 'Maria', text: 'Literature review' },
              { key: 'Jamie', text: 'Methodology' },
              { key: 'Priya', text: 'Data analysis' },
            ],
            correctAnswer: 'Maria-literature review',
          },
          {
            id: 'lt-1-s3-q2',
            type: 'mcq',
            questionNumber: 12,
            stem: 'What does the tutor recommend the students do this week?',
            options: [
              { label: 'A', text: 'Submit a draft to the tutor for feedback' },
              { label: 'B', text: 'Hold a meeting to agree on a central thesis' },
              { label: 'C', text: 'Complete all individual sections independently' },
              { label: 'D', text: 'Extend their literature search' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'lt-1-s3-q3',
            type: 'fill-blank',
            questionNumber: 13,
            stem: 'The tutor recommends sharing drafts at least ________ times a week.',
            correctAnswer: 'twice',
          },
          {
            id: 'lt-1-s3-q4',
            type: 'fill-blank',
            questionNumber: 14,
            stem: 'The final report should be ________ words, not including references and appendices.',
            correctAnswer: '5,000',
          },
          {
            id: 'lt-1-s3-q5',
            type: 'mcq',
            questionNumber: 15,
            stem: 'Which referencing system should the students use?',
            options: [
              { label: 'A', text: 'APA' },
              { label: 'B', text: 'Chicago' },
              { label: 'C', text: 'MLA' },
              { label: 'D', text: 'Harvard' },
            ],
            correctAnswer: 'D',
          },
        ],
      },
      {
        id: 'lt-1-s4',
        sectionNumber: 4,
        audioUrl: '/audio/lt-1-section-4.mp3',
        audioDurationSeconds: 480,
        transcript: `Lecturer: Today I want to talk about the concept of deep time — a term coined by the writer John McPhee to describe the vast timescales of geological and cosmic history. To understand deep time, we need to confront the fact that the human lifespan is almost incomprehensibly short compared to the age of the universe, the Earth, or even the history of life.

The universe is approximately 13.8 billion years old. The Earth formed around 4.5 billion years ago, and the oldest known rocks on Earth date to about 4 billion years. The first evidence of life — simple single-celled organisms — appears in the fossil record about 3.5 billion years ago. By contrast, complex multicellular life didn't emerge until about 600 million years ago, and the dinosaurs, which we often think of as ancient, only appeared around 240 million years ago and went extinct 66 million years ago.

Hominins — the group that includes modern humans and our closest ancestors — have only been around for about 6 million years. Anatomically modern Homo sapiens appeared roughly 300,000 years ago. Written history spans only about 5,000 years. If the entire history of the Earth were compressed into a single 24-hour day, humans would appear in the final two seconds before midnight.

Understanding deep time has profound implications for how we think about environmental change. The climate shifts and extinction events we are currently causing will leave traces in the geological record for millions of years — a sobering thought for our species.`,
        questions: [
          {
            id: 'lt-1-s4-q1',
            type: 'fill-blank',
            questionNumber: 16,
            stem: 'The term "deep time" was coined by the writer ________.',
            correctAnswer: 'John McPhee',
          },
          {
            id: 'lt-1-s4-q2',
            type: 'mcq',
            questionNumber: 17,
            stem: 'Approximately how old is the Earth?',
            options: [
              { label: 'A', text: '13.8 billion years' },
              { label: 'B', text: '4.5 billion years' },
              { label: 'C', text: '3.5 billion years' },
              { label: 'D', text: '600 million years' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'lt-1-s4-q3',
            type: 'fill-blank',
            questionNumber: 18,
            stem: 'Dinosaurs went extinct approximately ________ million years ago.',
            correctAnswer: '66',
          },
          {
            id: 'lt-1-s4-q4',
            type: 'mcq',
            questionNumber: 19,
            stem: 'When did anatomically modern Homo sapiens first appear?',
            options: [
              { label: 'A', text: '6 million years ago' },
              { label: 'B', text: '1 million years ago' },
              { label: 'C', text: '300,000 years ago' },
              { label: 'D', text: '5,000 years ago' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-1-s4-q5',
            type: 'fill-blank',
            questionNumber: 20,
            stem: 'Written history spans approximately ________ years.',
            correctAnswer: '5,000',
          },
        ],
      },
    ],
  },
  {
    id: 'lt-2',
    title: 'Listening Practice Test 2',
    sectionCount: 4,
    questionCount: 20,
    durationMinutes: 30,
    audioUrl: '/audio/lt-2-combined.mp3',
    status: 'published',
    createdAt: '2025-09-18',
    sections: [
      {
        id: 'lt-2-s1',
        sectionNumber: 1,
        audioUrl: '/audio/lt-2-section-1.mp3',
        audioDurationSeconds: 400,
        transcript: `Agent: Good afternoon, Sunrise Travel Agency. How can I assist you?

Customer: Hi, I'm planning a trip to New Zealand and I'd like some help with booking a package.

Agent: Wonderful choice. When are you thinking of travelling, and for how long?

Customer: I'm looking at late February, for about two weeks — maybe 14 nights.

Agent: Perfect. We have an excellent two-week New Zealand highlights package. It covers both the North and South Islands, with guided tours and accommodation included. The price starts from £3,200 per person including flights from London.

Customer: That sounds good. What accommodation is included?

Agent: The package uses a mix of three-star and four-star hotels. In Auckland and Queenstown you'll be in four-star hotels, and in the smaller towns it's three-star.

Customer: What about activities? I'm particularly keen on adventure sports.

Agent: Queenstown is the adventure capital of the world — you'd have options for bungee jumping, white-water rafting, and skydiving. These are not included in the package price but we can pre-book them for you at a discount.

Customer: And what's the deposit to secure the booking?

Agent: We require a £400 deposit per person to confirm the booking, with the balance due eight weeks before departure.`,
        questions: [
          {
            id: 'lt-2-s1-q1',
            type: 'fill-blank',
            questionNumber: 1,
            stem: 'The two-week New Zealand package starts from £________ per person including flights.',
            correctAnswer: '3,200',
          },
          {
            id: 'lt-2-s1-q2',
            type: 'mcq',
            questionNumber: 2,
            stem: 'What star rating are the hotels in Auckland and Queenstown?',
            options: [
              { label: 'A', text: 'Three-star' },
              { label: 'B', text: 'Four-star' },
              { label: 'C', text: 'Five-star' },
              { label: 'D', text: 'Varies' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'lt-2-s1-q3',
            type: 'fill-blank',
            questionNumber: 3,
            stem: 'The deposit required to confirm the booking is £________ per person.',
            correctAnswer: '400',
          },
          {
            id: 'lt-2-s1-q4',
            type: 'mcq',
            questionNumber: 4,
            stem: 'When is the balance payment due?',
            options: [
              { label: 'A', text: 'At the time of booking' },
              { label: 'B', text: 'Four weeks before departure' },
              { label: 'C', text: 'Eight weeks before departure' },
              { label: 'D', text: 'On arrival' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-2-s1-q5',
            type: 'fill-blank',
            questionNumber: 5,
            stem: 'Adventure activities in Queenstown are not included in the package but can be pre-booked at a ________.',
            correctAnswer: 'discount',
          },
        ],
      },
      {
        id: 'lt-2-s2',
        sectionNumber: 2,
        audioUrl: '/audio/lt-2-section-2.mp3',
        audioDurationSeconds: 410,
        transcript: `Museum guide: Welcome to the City Museum. I'm going to give you a quick overview of the museum's layout and today's special events. The museum has four floors. On the ground floor you'll find the welcome hall, the museum shop, and the café. The café is open until 5pm and serves hot lunches until 2pm.

The first floor houses our permanent collections: Ancient Egypt in Gallery 1A, the Roman Empire in Gallery 1B, and Medieval Europe in Gallery 1C. The second floor is dedicated to natural history, including our famous dinosaur skeleton collection and a new exhibition on deep sea creatures that opened last month.

The third floor contains our contemporary art gallery and a rotating programme of temporary exhibitions. At the moment we have an exhibition of photographs from the Arctic, which runs until the end of next month.

Today we have two special events. At 2pm in the lecture theatre on the second floor, Dr Sarah Chen will give a talk on recent fossil discoveries in South America — admission is free but you need to collect a ticket from the information desk. At 4pm, we have a children's craft workshop in the education room on the ground floor — this costs £3 per child and booking is required.

If you need any assistance during your visit, staff members are identifiable by their blue lanyards. Enjoy your visit!`,
        questions: [
          {
            id: 'lt-2-s2-q1',
            type: 'mcq',
            questionNumber: 6,
            stem: 'Until what time does the café serve hot lunches?',
            options: [
              { label: 'A', text: '1pm' },
              { label: 'B', text: '2pm' },
              { label: 'C', text: '4pm' },
              { label: 'D', text: '5pm' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'lt-2-s2-q2',
            type: 'fill-blank',
            questionNumber: 7,
            stem: 'The exhibition on deep sea creatures is located on the ________ floor.',
            correctAnswer: 'second',
          },
          {
            id: 'lt-2-s2-q3',
            type: 'fill-blank',
            questionNumber: 8,
            stem: 'The Arctic photography exhibition runs until the end of ________.',
            correctAnswer: 'next month',
          },
          {
            id: 'lt-2-s2-q4',
            type: 'mcq',
            questionNumber: 9,
            stem: 'How much does the children\'s craft workshop cost?',
            options: [
              { label: 'A', text: 'Free' },
              { label: 'B', text: '£2 per child' },
              { label: 'C', text: '£3 per child' },
              { label: 'D', text: '£5 per child' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-2-s2-q5',
            type: 'fill-blank',
            questionNumber: 10,
            stem: 'Museum staff can be identified by their ________ lanyards.',
            correctAnswer: 'blue',
          },
        ],
      },
      {
        id: 'lt-2-s3',
        sectionNumber: 3,
        audioUrl: '/audio/lt-2-section-3.mp3',
        audioDurationSeconds: 445,
        transcript: `Placeholder transcript for Section 3 of Listening Test 2. This section covers a discussion between students about a research assignment on sustainable architecture.`,
        questions: [
          {
            id: 'lt-2-s3-q1',
            type: 'mcq',
            questionNumber: 11,
            stem: 'What is the main topic of the students\' research assignment?',
            options: [
              { label: 'A', text: 'Urban planning' },
              { label: 'B', text: 'Sustainable architecture' },
              { label: 'C', text: 'Building materials' },
              { label: 'D', text: 'Interior design' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'lt-2-s3-q2',
            type: 'fill-blank',
            questionNumber: 12,
            stem: 'The assignment is due in ________ weeks.',
            correctAnswer: 'four',
          },
          {
            id: 'lt-2-s3-q3',
            type: 'fill-blank',
            questionNumber: 13,
            stem: 'The students plan to interview a local ________ for primary research.',
            correctAnswer: 'architect',
          },
          {
            id: 'lt-2-s3-q4',
            type: 'mcq',
            questionNumber: 14,
            stem: 'What aspect of sustainable architecture will the students focus on?',
            options: [
              { label: 'A', text: 'Cost effectiveness' },
              { label: 'B', text: 'Aesthetic appeal' },
              { label: 'C', text: 'Energy efficiency' },
              { label: 'D', text: 'Historical precedents' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-2-s3-q5',
            type: 'fill-blank',
            questionNumber: 15,
            stem: 'The minimum word count for the assignment is ________.',
            correctAnswer: '3,000',
          },
        ],
      },
      {
        id: 'lt-2-s4',
        sectionNumber: 4,
        audioUrl: '/audio/lt-2-section-4.mp3',
        audioDurationSeconds: 460,
        transcript: `Placeholder transcript for Section 4 of Listening Test 2. A lecture on the history and science of vaccination.`,
        questions: [
          {
            id: 'lt-2-s4-q1',
            type: 'fill-blank',
            questionNumber: 16,
            stem: 'Edward Jenner developed the first smallpox vaccine in ________.',
            correctAnswer: '1796',
          },
          {
            id: 'lt-2-s4-q2',
            type: 'mcq',
            questionNumber: 17,
            stem: 'What percentage of the population needs to be immune to achieve herd immunity for measles?',
            options: [
              { label: 'A', text: '60 percent' },
              { label: 'B', text: '75 percent' },
              { label: 'C', text: '85 percent' },
              { label: 'D', text: '95 percent' },
            ],
            correctAnswer: 'D',
          },
          {
            id: 'lt-2-s4-q3',
            type: 'fill-blank',
            questionNumber: 18,
            stem: 'Smallpox was officially declared eradicated by the WHO in ________.',
            correctAnswer: '1980',
          },
          {
            id: 'lt-2-s4-q4',
            type: 'mcq',
            questionNumber: 19,
            stem: 'What type of immunity do mRNA vaccines stimulate?',
            options: [
              { label: 'A', text: 'Passive immunity' },
              { label: 'B', text: 'Natural immunity' },
              { label: 'C', text: 'Active immunity' },
              { label: 'D', text: 'Innate immunity' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'lt-2-s4-q5',
            type: 'fill-blank',
            questionNumber: 20,
            stem: 'The lecturer states that vaccine hesitancy is considered one of the top ten threats to ________ health.',
            correctAnswer: 'global',
          },
        ],
      },
    ],
  },
  {
    id: 'lt-3',
    title: 'Listening Practice Test 3',
    sectionCount: 4,
    questionCount: 40,
    durationMinutes: 30,
    audioUrl: null,
    status: 'draft',
    createdAt: '2025-10-10',
    sections: [],
  },
  {
    id: 'lt-4',
    title: 'Listening Practice Test 4',
    sectionCount: 4,
    questionCount: 40,
    durationMinutes: 30,
    audioUrl: null,
    status: 'draft',
    createdAt: '2025-11-20',
    sections: [],
  },
  {
    id: 'lt-5',
    title: 'Listening Practice Test 5',
    sectionCount: 4,
    questionCount: 40,
    durationMinutes: 30,
    audioUrl: null,
    status: 'draft',
    createdAt: '2026-01-15',
    sections: [],
  },
]
