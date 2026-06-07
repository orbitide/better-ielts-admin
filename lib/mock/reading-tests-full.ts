import type { FullReadingTest } from '@/lib/types/ielts'

export const mockFullReadingTests: FullReadingTest[] = [
  {
    id: 'rt-1',
    title: 'Academic Reading Practice 1',
    type: 'academic',
    passageCount: 3,
    questionCount: 15,
    durationMinutes: 60,
    status: 'published',
    createdAt: '2025-08-10',
    sections: [
      {
        id: 'rt-1-s1',
        passageIndex: 0,
        passage: {
          id: 'rt-1-p1',
          title: 'The History of Urban Planning',
          body: `Urban planning as a formal discipline emerged in the late 19th century, driven by the rapid industrialisation of cities across Europe and North America. Prior to this period, city growth was largely organic and unregulated, resulting in overcrowded tenements, inadequate sanitation, and widespread disease. The work of pioneers such as Ebenezer Howard, who proposed the concept of the "garden city," fundamentally changed how planners thought about the relationship between urban density, green space, and human well-being. Howard's vision influenced the development of Letchworth and Welwyn Garden City in England, which served as prototypes for planned communities worldwide.

In the 20th century, urban planning became increasingly scientific in its approach. The introduction of zoning laws in New York City in 1916 set a precedent that spread across the United States and later to other countries. These laws separated residential, commercial, and industrial land uses, aiming to reduce conflict between incompatible activities. However, critics argued that rigid zoning contributed to urban sprawl, increased car dependency, and the segregation of income groups.

The latter half of the 20th century saw a reaction against large-scale, top-down planning in the form of community-led initiatives and mixed-use development. Jane Jacobs, in her influential 1961 work "The Death and Life of Great American Cities," argued that urban vitality depended on diverse, mixed-use neighbourhoods rather than the sterile towers-in-a-park schemes promoted by modernist planners. Her ideas helped shift the focus of planning towards human-scale design and community participation.`,
          wordCount: 248,
        },
        questions: [
          {
            id: 'rt-1-s1-q1',
            type: 'mcq',
            questionNumber: 1,
            stem: 'What was the primary cause of the emergence of formal urban planning in the late 19th century?',
            options: [
              { label: 'A', text: 'Government legislation requiring city improvements' },
              { label: 'B', text: 'Rapid industrialisation creating overcrowded, unsanitary cities' },
              { label: 'C', text: 'The influence of European architectural movements' },
              { label: 'D', text: 'Demand from wealthy citizens for planned suburbs' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'rt-1-s1-q2',
            type: 'mcq',
            questionNumber: 2,
            stem: 'Which of the following best describes Ebenezer Howard\'s contribution to urban planning?',
            options: [
              { label: 'A', text: 'He introduced zoning laws in New York City' },
              { label: 'B', text: 'He designed the city of Paris' },
              { label: 'C', text: 'He proposed the "garden city" concept combining urban and rural elements' },
              { label: 'D', text: 'He wrote "The Death and Life of Great American Cities"' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'rt-1-s1-q3',
            type: 'tfng',
            questionNumber: 3,
            statement: 'New York City\'s 1916 zoning laws were adopted immediately by all major European cities.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-1-s1-q4',
            type: 'tfng',
            questionNumber: 4,
            statement: 'Jane Jacobs believed that mixed-use neighbourhoods contributed to urban vitality.',
            correctAnswer: 'TRUE',
          },
          {
            id: 'rt-1-s1-q5',
            type: 'fill-blank',
            questionNumber: 5,
            stem: 'Letchworth and Welwyn Garden City in England served as ________ for planned communities worldwide.',
            correctAnswer: 'prototypes',
            wordLimit: 1,
          },
        ],
      },
      {
        id: 'rt-1-s2',
        passageIndex: 1,
        passage: {
          id: 'rt-1-p2',
          title: 'Coral Reef Ecosystems Under Threat',
          body: `Coral reefs are among the most biologically diverse ecosystems on Earth, covering less than one percent of the ocean floor yet supporting approximately 25 percent of all marine species. They provide critical services to human societies, including coastal protection, fisheries, and tourism revenue estimated at hundreds of billions of dollars annually. Despite their importance, coral reefs are under severe threat from a combination of human activities and climate change.

Rising ocean temperatures caused by climate change trigger a phenomenon known as coral bleaching. When water temperatures rise even slightly above the normal range, corals expel the symbiotic algae that live within their tissues and provide them with up to 90 percent of their energy. Without these algae, corals turn white and become vulnerable to disease and death. Mass bleaching events have increased dramatically in frequency and severity since the 1980s.

Ocean acidification, another consequence of elevated atmospheric carbon dioxide, poses an additional threat. As oceans absorb more CO2, the water becomes more acidic, reducing the availability of carbonate ions that corals need to build their calcium carbonate skeletons. Research suggests that if current emissions trajectories continue, ocean acidity could increase by 150 percent by the end of the century, making large areas of the ocean inhospitable for coral growth.

Local stressors compound these global threats. Agricultural runoff introduces excess nutrients and sediment that smother corals and promote algal overgrowth. Overfishing removes the herbivorous fish that control algae, disrupting the delicate balance of reef ecosystems. Physical damage from destructive fishing practices, boat anchors, and recreational activities further degrades reef structure.`,
          wordCount: 256,
        },
        questions: [
          {
            id: 'rt-1-s2-q1',
            type: 'tfng',
            questionNumber: 6,
            statement: 'Coral reefs cover more than 10 percent of the ocean floor.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-1-s2-q2',
            type: 'tfng',
            questionNumber: 7,
            statement: 'Coral bleaching occurs when corals absorb too much sunlight.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-1-s2-q3',
            type: 'mcq',
            questionNumber: 8,
            stem: 'What percentage of their energy do corals typically receive from symbiotic algae?',
            options: [
              { label: 'A', text: '25 percent' },
              { label: 'B', text: '50 percent' },
              { label: 'C', text: '75 percent' },
              { label: 'D', text: '90 percent' },
            ],
            correctAnswer: 'D',
          },
          {
            id: 'rt-1-s2-q4',
            type: 'fill-blank',
            questionNumber: 9,
            stem: 'Ocean acidification reduces the availability of ________ ions that corals need to build their skeletons.',
            correctAnswer: 'carbonate',
            wordLimit: 1,
          },
          {
            id: 'rt-1-s2-q5',
            type: 'matching',
            questionNumber: 10,
            stem: 'Match each threat to coral reefs with its primary cause.',
            options: [
              { key: 'i', text: 'Coral bleaching' },
              { key: 'ii', text: 'Ocean acidification' },
              { key: 'iii', text: 'Algal overgrowth' },
              { key: 'iv', text: 'Physical structural damage' },
            ],
            correctAnswer: 'i-rising ocean temperatures',
          },
        ],
      },
      {
        id: 'rt-1-s3',
        passageIndex: 2,
        passage: {
          id: 'rt-1-p3',
          title: 'The Psychology of Decision Making',
          body: `For much of the 20th century, economists assumed that human beings were fundamentally rational actors who made decisions by carefully weighing costs and benefits to maximise their utility. This model, known as rational choice theory, underpinned much of classical economics and provided the theoretical foundation for public policy in areas ranging from taxation to healthcare. However, decades of psychological research have challenged this assumption, revealing systematic patterns of irrational behaviour that persist even among educated and informed individuals.

Daniel Kahneman and Amos Tversky, whose work was recognised with the Nobel Prize in Economics in 2002, identified numerous cognitive biases that distort human judgment. Their prospect theory demonstrated that people evaluate outcomes relative to a reference point and that losses feel psychologically larger than equivalent gains — a phenomenon they called loss aversion. This helps explain why investors hold on to losing stocks longer than is rational, or why homeowners resist selling properties at a loss even when the market dictates otherwise.

The concept of cognitive ease also plays a significant role in decision making. People tend to favour information that is easy to process, a tendency Kahneman termed "System 1" thinking. This fast, intuitive mode of cognition is contrasted with "System 2" thinking, which is slower, more deliberate, and more analytically rigorous. While System 2 produces better decisions in complex situations, it requires significant mental effort and is therefore often bypassed in favour of the faster, less accurate System 1.`,
          wordCount: 236,
        },
        questions: [
          {
            id: 'rt-1-s3-q1',
            type: 'mcq',
            questionNumber: 11,
            stem: 'What was the main assumption of rational choice theory?',
            options: [
              { label: 'A', text: 'Humans are primarily emotional in their decision-making' },
              { label: 'B', text: 'Humans carefully weigh costs and benefits to maximise utility' },
              { label: 'C', text: 'Humans are influenced mainly by social pressure' },
              { label: 'D', text: 'Humans rely on intuition rather than logic' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'rt-1-s3-q2',
            type: 'tfng',
            questionNumber: 12,
            statement: 'Daniel Kahneman won the Nobel Prize in Economics in 2002.',
            correctAnswer: 'TRUE',
          },
          {
            id: 'rt-1-s3-q3',
            type: 'tfng',
            questionNumber: 13,
            statement: 'According to prospect theory, people perceive gains as psychologically larger than equivalent losses.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-1-s3-q4',
            type: 'fill-blank',
            questionNumber: 14,
            stem: '"System 1" thinking is described as fast and ________, contrasted with the slower, more analytical "System 2".',
            correctAnswer: 'intuitive',
            wordLimit: 1,
          },
          {
            id: 'rt-1-s3-q5',
            type: 'fill-blank',
            questionNumber: 15,
            stem: 'The tendency to hold on to losing stocks longer than is rational is an example of ________ aversion.',
            correctAnswer: 'loss',
            wordLimit: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'rt-2',
    title: 'Academic Reading Practice 2',
    type: 'academic',
    passageCount: 3,
    questionCount: 15,
    durationMinutes: 60,
    status: 'published',
    createdAt: '2025-09-05',
    sections: [
      {
        id: 'rt-2-s1',
        passageIndex: 0,
        passage: {
          id: 'rt-2-p1',
          title: 'The Domestication of Animals',
          body: `The domestication of animals represents one of the most transformative events in human history, fundamentally altering the trajectory of civilisation. Beginning approximately 15,000 years ago with the domestication of wolves into dogs in East Asia, the process gradually expanded to include a wide range of species over the following millennia. Sheep, goats, pigs, and cattle were domesticated in the Fertile Crescent around 10,000 years ago, while horses were tamed on the Eurasian steppes around 5,500 years ago. Each domestication event had profound consequences for human societies, enabling new forms of food production, transportation, and labour.

The biological changes associated with domestication are well documented. Compared to their wild ancestors, domesticated animals typically exhibit reduced brain size, shorter faces, floppy ears, and a tendency towards paedomorphism — the retention of juvenile characteristics into adulthood. These changes are thought to result from selection for tameness, which inadvertently selects for the same genetic pathways that control the development of juvenile traits. This phenomenon, known as the domestication syndrome, has been observed across diverse species from dogs and foxes to pigs and cattle.

Recent genetic research has complicated the traditional picture of domestication as a single, discrete event in a specific location. Studies of modern cattle genomes suggest that domestication occurred independently at least twice, in different parts of the world. Similarly, the ancestry of modern dogs appears to derive from multiple wolf populations that were domesticated in different regions. This growing evidence suggests that domestication was a more complex, geographically dispersed process than previously assumed.`,
          wordCount: 244,
        },
        questions: [
          {
            id: 'rt-2-s1-q1',
            type: 'mcq',
            questionNumber: 1,
            stem: 'Where and when were wolves first domesticated into dogs?',
            options: [
              { label: 'A', text: 'Fertile Crescent, 10,000 years ago' },
              { label: 'B', text: 'East Asia, approximately 15,000 years ago' },
              { label: 'C', text: 'Eurasian steppes, 5,500 years ago' },
              { label: 'D', text: 'Western Europe, 12,000 years ago' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'rt-2-s1-q2',
            type: 'tfng',
            questionNumber: 2,
            statement: 'Domesticated animals typically have larger brains than their wild ancestors.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-2-s1-q3',
            type: 'tfng',
            questionNumber: 3,
            statement: 'The domestication syndrome has only been observed in dogs and foxes.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-2-s1-q4',
            type: 'fill-blank',
            questionNumber: 4,
            stem: 'The retention of juvenile characteristics into adulthood in domesticated animals is called ________.',
            correctAnswer: 'paedomorphism',
            wordLimit: 1,
          },
          {
            id: 'rt-2-s1-q5',
            type: 'mcq',
            questionNumber: 5,
            stem: 'What does recent genetic research suggest about the domestication of cattle?',
            options: [
              { label: 'A', text: 'It occurred only once, in the Fertile Crescent' },
              { label: 'B', text: 'It occurred at least twice, independently, in different parts of the world' },
              { label: 'C', text: 'It began on the Eurasian steppes' },
              { label: 'D', text: 'It predates the domestication of dogs' },
            ],
            correctAnswer: 'B',
          },
        ],
      },
      {
        id: 'rt-2-s2',
        passageIndex: 1,
        passage: {
          id: 'rt-2-p2',
          title: 'Renewable Energy Transitions',
          body: `The global transition to renewable energy sources represents one of the defining challenges of the 21st century. As concerns about climate change intensify and the costs of solar and wind power continue to fall dramatically, governments, businesses, and investors worldwide are accelerating their commitments to decarbonise energy systems. The International Energy Agency has projected that renewables could account for nearly 90 percent of global electricity capacity additions over the next decade, signalling a fundamental shift in the energy landscape.

Solar photovoltaic technology has experienced the most dramatic cost reductions of any energy technology in history. The cost of utility-scale solar has fallen by more than 89 percent since 2010, making it the cheapest source of new electricity generation in most of the world. Wind power has similarly benefited from technological improvements and economies of scale, with offshore wind costs falling particularly rapidly in recent years. These cost reductions have been driven by improvements in manufacturing efficiency, better materials science, and the cumulative learning effects of a rapidly expanding global industry.

Despite this progress, the transition to a fully renewable energy system faces significant technical and economic challenges. The intermittent nature of solar and wind power creates grid management challenges that require investment in energy storage, smart grid technologies, and flexible backup capacity. The integration of high levels of variable renewables into existing electricity grids requires new approaches to grid operation, investment in transmission infrastructure, and market reforms that reward flexibility rather than merely capacity.`,
          wordCount: 243,
        },
        questions: [
          {
            id: 'rt-2-s2-q1',
            type: 'mcq',
            questionNumber: 6,
            stem: 'By how much has the cost of utility-scale solar fallen since 2010?',
            options: [
              { label: 'A', text: 'More than 50 percent' },
              { label: 'B', text: 'More than 70 percent' },
              { label: 'C', text: 'More than 89 percent' },
              { label: 'D', text: 'More than 95 percent' },
            ],
            correctAnswer: 'C',
          },
          {
            id: 'rt-2-s2-q2',
            type: 'tfng',
            questionNumber: 7,
            statement: 'Offshore wind costs have remained stable in recent years.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-2-s2-q3',
            type: 'tfng',
            questionNumber: 8,
            statement: 'The IEA projects that renewables could account for nearly 90 percent of global electricity capacity additions over the next decade.',
            correctAnswer: 'TRUE',
          },
          {
            id: 'rt-2-s2-q4',
            type: 'fill-blank',
            questionNumber: 9,
            stem: 'The ________ nature of solar and wind power creates grid management challenges.',
            correctAnswer: 'intermittent',
            wordLimit: 1,
          },
          {
            id: 'rt-2-s2-q5',
            type: 'matching',
            questionNumber: 10,
            stem: 'Match each technology to its primary challenge or advantage described in the passage.',
            options: [
              { key: 'i', text: 'Solar PV' },
              { key: 'ii', text: 'Offshore wind' },
              { key: 'iii', text: 'Energy storage' },
              { key: 'iv', text: 'Smart grid' },
            ],
            correctAnswer: 'i-greatest historical cost reduction',
          },
        ],
      },
      {
        id: 'rt-2-s3',
        passageIndex: 2,
        passage: {
          id: 'rt-2-p3',
          title: 'Language Acquisition in Early Childhood',
          body: `Children acquire language with remarkable speed and efficiency, mastering the complex grammatical rules of their native tongue within the first few years of life without formal instruction. This process, which linguists describe as first language acquisition, has fascinated researchers for decades and given rise to competing theoretical frameworks. The debate between nativist and empiricist accounts of language acquisition remains one of the most productive controversies in cognitive science.

The nativist position, associated most prominently with Noam Chomsky, holds that children are born with an innate language acquisition device — a set of universal grammatical principles that constrain the possible structures of all human languages. This view received strong support from observations that children produce novel grammatical sentences they have never heard, and that they rarely make certain types of errors that would be expected if they were learning purely by imitation. The existence of a critical period for language acquisition, during which language learning is especially rapid and efficient, is also cited as evidence for a biological basis.

Empiricist accounts, by contrast, emphasise the role of environmental input in shaping language development. Research in usage-based linguistics has shown that children's early language closely mirrors the statistical patterns of the language they hear, suggesting that general learning mechanisms rather than domain-specific innate structures may be sufficient to explain language acquisition. Studies using large corpora of child-directed speech have demonstrated that the frequency with which grammatical constructions appear in the input predicts the order in which children acquire them.`,
          wordCount: 238,
        },
        questions: [
          {
            id: 'rt-2-s3-q1',
            type: 'mcq',
            questionNumber: 11,
            stem: 'What does the nativist position, associated with Noam Chomsky, propose?',
            options: [
              { label: 'A', text: 'Children learn language entirely through imitation' },
              { label: 'B', text: 'Children are born with an innate language acquisition device' },
              { label: 'C', text: 'Language is learned through statistical pattern recognition' },
              { label: 'D', text: 'Formal instruction is essential for language development' },
            ],
            correctAnswer: 'B',
          },
          {
            id: 'rt-2-s3-q2',
            type: 'tfng',
            questionNumber: 12,
            statement: 'Children frequently make the types of errors that would be expected if they were learning purely by imitation.',
            correctAnswer: 'FALSE',
          },
          {
            id: 'rt-2-s3-q3',
            type: 'tfng',
            questionNumber: 13,
            statement: 'Usage-based linguistics emphasises environmental input over innate structures.',
            correctAnswer: 'TRUE',
          },
          {
            id: 'rt-2-s3-q4',
            type: 'fill-blank',
            questionNumber: 14,
            stem: 'The ________ period for language acquisition is cited as evidence for a biological basis of language learning.',
            correctAnswer: 'critical',
            wordLimit: 1,
          },
          {
            id: 'rt-2-s3-q5',
            type: 'fill-blank',
            questionNumber: 15,
            stem: 'Studies using large corpora of child-directed speech show that the ________ of grammatical constructions in input predicts acquisition order.',
            correctAnswer: 'frequency',
            wordLimit: 1,
          },
        ],
      },
    ],
  },
  // Stubbed entries — sections will be populated later
  {
    id: 'rt-3',
    title: 'General Training Reading 1',
    type: 'general',
    passageCount: 3,
    questionCount: 40,
    durationMinutes: 60,
    status: 'published',
    createdAt: '2025-09-20',
    sections: [],
  },
  {
    id: 'rt-4',
    title: 'Academic Reading Practice 3 — Science Focus',
    type: 'academic',
    passageCount: 3,
    questionCount: 40,
    durationMinutes: 60,
    status: 'published',
    createdAt: '2025-10-15',
    sections: [],
  },
  {
    id: 'rt-5',
    title: 'General Training Reading 2',
    type: 'general',
    passageCount: 3,
    questionCount: 40,
    durationMinutes: 60,
    status: 'draft',
    createdAt: '2025-11-01',
    sections: [],
  },
  {
    id: 'rt-6',
    title: 'Academic Reading Practice 4 — Technology',
    type: 'academic',
    passageCount: 3,
    questionCount: 40,
    durationMinutes: 60,
    status: 'draft',
    createdAt: '2026-01-08',
    sections: [],
  },
]
