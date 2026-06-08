import type { BlogPost } from '@/lib/types/content'

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'bp-1',
    title: '10 Proven Strategies to Boost Your IELTS Band Score',
    slug: '10-strategies-boost-ielts-band',
    category: 'Study Tips',
    tags: ['band score', 'strategy', 'study plan', 'tips'],
    author: 'Sarah Mitchell',
    status: 'published',
    publishedAt: '2025-09-10',
    updatedAt: '2025-09-10',
    coverImageUrl: 'https://placehold.co/1200x480/1e3a5f/ffffff?text=10+Strategies+to+Boost+Your+IELTS+Band',
    excerpt: 'Discover the most effective strategies that have helped thousands of students achieve their target band score.',
    seo: {
      metaTitle: '10 Proven IELTS Strategies for Band 7+ in 2025',
      metaDescription: 'Struggling to hit your target IELTS band? These 10 examiner-approved strategies cover all four skills and will help you score higher on test day.',
      focusKeyword: 'IELTS strategies band score',
    },
    content: `<img src="https://placehold.co/1200x480/1e3a5f/ffffff?text=10+Strategies+to+Boost+Your+IELTS+Band" alt="IELTS Study Strategies" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Why Strategy Matters as Much as Skill</h2>
<p>Many IELTS candidates spend months improving their English but still fall short of their target band. The missing ingredient is often <strong>strategy</strong> — knowing <em>how</em> to approach the test, not just knowing the language.</p>

<blockquote>
  <p>"Candidates who understand the marking criteria score, on average, 0.5 bands higher than those who don't — without any additional language improvement." — Cambridge IELTS Research, 2023</p>
</blockquote>

<h2>Where Most Candidates Lose Marks</h2>
<p>Before diving into strategies, understand the scoring distribution. Each of the four skills contributes equally to your overall band:</p>

<table>
  <thead>
    <tr><th>Skill</th><th>Weight</th><th>Duration</th><th>Most Common Weak Area</th></tr>
  </thead>
  <tbody>
    <tr><td>Listening</td><td>25%</td><td>30 min + 10 min transfer</td><td>Spelling errors on answer sheet</td></tr>
    <tr><td>Reading</td><td>25%</td><td>60 min</td><td>Running out of time on Passage 3</td></tr>
    <tr><td>Writing</td><td>25%</td><td>60 min (20 + 40)</td><td>Insufficient Task Achievement</td></tr>
    <tr><td>Speaking</td><td>25%</td><td>11–14 min</td><td>Lack of fluency under pressure</td></tr>
  </tbody>
</table>

<h2>Strategy 1: Know the Marking Criteria Inside Out</h2>
<p>Writing Task 2 is assessed on four equally weighted criteria. Understanding each one tells you exactly where to focus your energy:</p>

<img src="https://placehold.co/900x320/0f4c75/ffffff?text=Writing+Marking+Criteria+Breakdown" alt="Writing Criteria" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Criterion</th><th>Weight</th><th>Band 6 Indicator</th><th>Band 7+ Indicator</th></tr>
  </thead>
  <tbody>
    <tr><td>Task Achievement</td><td>25%</td><td>Relevant ideas, some development</td><td>Fully addresses all parts, well-extended</td></tr>
    <tr><td>Coherence &amp; Cohesion</td><td>25%</td><td>Organised but inconsistent linking</td><td>Logical progression, flexible cohesion</td></tr>
    <tr><td>Lexical Resource</td><td>25%</td><td>Adequate range, some errors</td><td>Precision, collocation awareness</td></tr>
    <tr><td>Grammatical Range &amp; Accuracy</td><td>25%</td><td>Mix of structures, errors present</td><td>Variety of complex structures, few errors</td></tr>
  </tbody>
</table>

<h2>Strategy 2: Build a Timed Practice Habit from Day One</h2>
<p>Doing practice tests without a stopwatch is counterproductive. Simulate real exam conditions every time you practice. Here is the exact time allocation:</p>

<ul>
  <li><strong>Listening:</strong> 30 minutes audio + 10 minutes to transfer answers</li>
  <li><strong>Reading:</strong> 60 minutes for all 3 passages (aim for 20 min per passage)</li>
  <li><strong>Writing:</strong> 20 minutes for Task 1, 40 minutes for Task 2</li>
  <li><strong>Speaking:</strong> 4–5 min Part 1, 3–4 min Part 2 (including 1 min prep), 4–5 min Part 3</li>
</ul>

<h2>Strategy 3: Target Your Weakest Skill First</h2>
<p>Your overall band is the mean of your four section scores, rounded to the nearest 0.5. A single weak skill has a disproportionate drag effect. The chart below shows how a single Band 5.5 section pulls down an otherwise Band 7 profile:</p>

<table>
  <thead>
    <tr><th>Scenario</th><th>L</th><th>R</th><th>W</th><th>S</th><th>Overall</th></tr>
  </thead>
  <tbody>
    <tr><td>Balanced Band 7</td><td>7.0</td><td>7.0</td><td>7.0</td><td>7.0</td><td><strong>7.0</strong></td></tr>
    <tr><td>One weak skill</td><td>7.0</td><td>7.5</td><td>5.5</td><td>7.5</td><td><strong>6.5</strong></td></tr>
    <tr><td>Two strong, two weak</td><td>8.0</td><td>8.0</td><td>6.0</td><td>6.0</td><td><strong>7.0</strong></td></tr>
  </tbody>
</table>

<blockquote>
  <p>Dedicate <strong>50% of your study time</strong> to your weakest skill, 30% to your second weakest, and 20% to maintenance of your strongest skills.</p>
</blockquote>

<h2>Strategies 4–7: The Core Four Skills</h2>

<img src="https://placehold.co/1000x360/155e35/ffffff?text=Core+Skills+Development+Framework" alt="Core Skills Framework" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h3>Strategy 4: Read Widely and Actively</h3>
<p>Build comfort with complex vocabulary by reading from these sources daily:</p>
<ul>
  <li>Broadsheet newspapers — The Guardian, The Economist, BBC News</li>
  <li>Science magazines — New Scientist, National Geographic, Scientific American</li>
  <li>Academic abstracts on Google Scholar (practice skimming dense academic prose)</li>
  <li>Annual reports and government publications (formal register practice)</li>
</ul>

<h3>Strategy 5: Expand Your Collocation Bank</h3>
<p>Single-word vocabulary is insufficient. Examiners reward <em>natural-sounding</em> language built from collocations:</p>
<table>
  <thead>
    <tr><th>Weak (single word)</th><th>Strong (collocation)</th></tr>
  </thead>
  <tbody>
    <tr><td>big increase</td><td>substantial / dramatic / sharp increase</td></tr>
    <tr><td>do research</td><td>conduct / carry out / undertake research</td></tr>
    <tr><td>solve a problem</td><td>address / tackle / mitigate a problem</td></tr>
    <tr><td>good result</td><td>encouraging / significant / measurable result</td></tr>
    <tr><td>use resources</td><td>allocate / conserve / deplete / harness resources</td></tr>
  </tbody>
</table>

<h3>Strategy 6: Master Paraphrasing</h3>
<p>IELTS questions rarely repeat the exact words of source texts. Practise identifying synonyms and structural paraphrases. In Writing and Speaking, paraphrasing the question in your introduction immediately demonstrates lexical range.</p>

<h3>Strategy 7: Listen Once — Always</h3>
<p>The real exam audio plays <strong>only once</strong>. Train yourself from day one to answer on the first listen. Candidates who practise with the "replay" option develop a catastrophically bad habit. If you miss an answer, write your best guess and move on.</p>

<h2>Strategies 8–10: Exam Execution</h2>

<h3>Strategy 8: Plan Before You Write</h3>
<p>Spend 3–5 minutes planning Task 2 before writing a single word. A clear plan prevents mid-essay direction changes that destroy coherence. Your plan should capture:</p>
<ol>
  <li>Your position (for opinion essays)</li>
  <li>Two body paragraph topics with one key argument each</li>
  <li>One specific example per paragraph</li>
  <li>A one-sentence conclusion restatement</li>
</ol>

<h3>Strategy 9: Record and Review Your Speaking</h3>
<p>Use your phone to record practice Speaking sessions. When reviewing, assess each of these dimensions:</p>
<ul>
  <li><strong>Fluency:</strong> Are there long, unnatural pauses? Do you repeat the same phrase while thinking?</li>
  <li><strong>Vocabulary:</strong> Are you using the same 50 words repeatedly, or demonstrating range?</li>
  <li><strong>Grammar:</strong> Are complex structures appearing — or only simple sentences?</li>
  <li><strong>Pronunciation:</strong> Are key words clear? Is your word stress natural?</li>
</ul>

<h3>Strategy 10: Simulate Complete Exam Days</h3>
<p>At least twice before your real exam, sit all four sections in a single sitting (Listening, Reading, Writing — then schedule a mock Speaking immediately after). This builds stamina and reveals exactly how fatigue affects your accuracy.</p>

<img src="https://placehold.co/900x280/4c1d95/ffffff?text=Band+Score+Progression+Over+8+Weeks" alt="Band Score Progress" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Expected Improvement Timeline</h2>
<table>
  <thead>
    <tr><th>Starting Band</th><th>Target Band</th><th>Realistic Timeframe</th><th>Hours/Week Required</th></tr>
  </thead>
  <tbody>
    <tr><td>5.0</td><td>6.0</td><td>8–12 weeks</td><td>15–20 hrs</td></tr>
    <tr><td>5.5</td><td>6.5</td><td>6–10 weeks</td><td>12–18 hrs</td></tr>
    <tr><td>6.0</td><td>7.0</td><td>6–8 weeks</td><td>10–15 hrs</td></tr>
    <tr><td>6.5</td><td>7.5</td><td>8–12 weeks</td><td>12–18 hrs</td></tr>
    <tr><td>7.0</td><td>8.0</td><td>12–20 weeks</td><td>15–25 hrs</td></tr>
  </tbody>
</table>

<blockquote>
  <p>Consistent, strategic practice over 6–8 weeks beats last-minute cramming every time. Start with the criteria, target your weaknesses, simulate real conditions — your band score will follow.</p>
</blockquote>`,
  },
  {
    id: 'bp-2',
    title: 'Understanding IELTS Writing Task 2: A Complete Guide',
    slug: 'ielts-writing-task-2-complete-guide',
    category: 'Writing',
    tags: ['writing task 2', 'essay structure', 'band 7', 'academic'],
    author: 'James Harper',
    status: 'published',
    publishedAt: '2025-09-25',
    updatedAt: '2025-10-01',
    coverImageUrl: 'https://placehold.co/1200x480/0f4c75/ffffff?text=IELTS+Writing+Task+2+Complete+Guide',
    excerpt: 'Master the essay structure, vocabulary, and argumentation techniques needed for a Band 7+ writing score.',
    seo: {
      metaTitle: 'IELTS Writing Task 2: Complete Band 7 Essay Guide',
      metaDescription: 'Master essay structure, academic vocabulary, and grammar for IELTS Writing Task 2. Includes the exact 40-minute timing plan used by Band 7+ candidates.',
      focusKeyword: 'IELTS Writing Task 2 guide',
    },
    content: `<img src="https://placehold.co/1200x480/0f4c75/ffffff?text=IELTS+Writing+Task+2+%E2%80%94+Complete+Guide" alt="Writing Task 2 Guide" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>What Is Writing Task 2?</h2>
<p>Writing Task 2 requires you to write an essay of at least 250 words in response to a point of view, argument, or problem. It is worth <strong>twice as many marks</strong> as Task 1, making it the most important part of the Writing paper. You have approximately 40 minutes to plan, write, and review your response.</p>

<blockquote>
  <p>Task 2 carries <strong>two-thirds</strong> of the Writing score. If you only have time to improve one Writing skill, make it Task 2.</p>
</blockquote>

<h2>The Five Question Types</h2>
<p>Identifying the question type before writing is the single most important pre-writing step. Each type demands a specific structure and stance:</p>

<img src="https://placehold.co/900x300/7c3aed/ffffff?text=5+IELTS+Writing+Task+2+Question+Types" alt="Question Types" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Type</th><th>Key Signal Words</th><th>Structure</th><th>Personal Opinion?</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Opinion (Agree/Disagree)</strong></td><td>"To what extent do you agree…"</td><td>State + defend one position throughout</td><td>Required</td></tr>
    <tr><td><strong>Discussion (Both Views)</strong></td><td>"Discuss both views and give your opinion"</td><td>View A → View B → Your position</td><td>Required at end</td></tr>
    <tr><td><strong>Advantages &amp; Disadvantages</strong></td><td>"Discuss the advantages and disadvantages"</td><td>Balanced Pros + Cons</td><td>Only if asked</td></tr>
    <tr><td><strong>Problem &amp; Solution</strong></td><td>"What are the problems? What solutions?"</td><td>Causes/Problems → Realistic Solutions</td><td>Not required</td></tr>
    <tr><td><strong>Two-Part Question</strong></td><td>"Why is this? / What can be done?"</td><td>Answer both parts with equal depth</td><td>Only if asked</td></tr>
  </tbody>
</table>

<h2>The Band 7+ Essay Structure</h2>
<p>A clear four-paragraph structure consistently earns high Coherence &amp; Cohesion scores. Here is the exact template used by Band 7 and above candidates:</p>

<img src="https://placehold.co/900x360/065f46/ffffff?text=Essay+Structure%3A+Introduction+%7C+Body+1+%7C+Body+2+%7C+Conclusion" alt="Essay Structure" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Paragraph</th><th>Word Count</th><th>Content</th><th>Time</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Introduction</strong></td><td>40–60 words</td><td>Paraphrase topic + state your position/outline</td><td>4 min</td></tr>
    <tr><td><strong>Body Paragraph 1</strong></td><td>80–100 words</td><td>Topic sentence → Explanation → Example → Link</td><td>10 min</td></tr>
    <tr><td><strong>Body Paragraph 2</strong></td><td>80–100 words</td><td>Topic sentence → Explanation → Example → Link</td><td>10 min</td></tr>
    <tr><td><strong>Conclusion</strong></td><td>30–50 words</td><td>Restate position + key points, no new ideas</td><td>4 min</td></tr>
  </tbody>
</table>

<h2>Task Achievement: The Most Common Failure Point</h2>
<p>The most common reason for a Band 5 or 6 Task Achievement score is <em>vagueness</em>. Every claim needs support. Compare these two responses to the same prompt:</p>

<blockquote>
  <p><strong>Prompt:</strong> "Social media has a negative impact on young people. To what extent do you agree?"</p>
</blockquote>

<table>
  <thead>
    <tr><th>Band 5–6 Response</th><th>Band 7–8 Response</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>"Social media has many negative effects on young people, such as addiction and health problems."</td>
      <td>"Prolonged social media use correlates with increased anxiety among adolescents. A 2023 meta-analysis of 14 studies found that teenagers spending over four hours daily on platforms reported 40% higher stress scores — a finding consistent across cultural contexts."</td>
    </tr>
  </tbody>
</table>

<p>You do not need real statistics — plausible, specific examples are fully acceptable in IELTS.</p>

<h2>Lexical Resource: Academic Phrases That Impress</h2>
<p>Band 7+ candidates use a varied range of academic phrases naturally. The following are examiner-favourites — use them in context, not as templates:</p>
<ul>
  <li>It is widely acknowledged that…</li>
  <li>Critics argue that… / Proponents contend that…</li>
  <li>This is largely attributable to…</li>
  <li>The ramifications of this extend beyond…</li>
  <li>While this view has merit, it overlooks the fact that…</li>
  <li>A compelling case can be made for…</li>
  <li>The evidence overwhelmingly suggests that…</li>
</ul>

<h2>Grammatical Range: Complex Structures to Target</h2>

<img src="https://placehold.co/900x260/9a3412/ffffff?text=Grammar+Structures+for+Band+7%2B" alt="Grammar Structures" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Structure</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td>Relative clause</td><td>"Governments, <em>which bear primary responsibility</em> for infrastructure, must…"</td></tr>
    <tr><td>Passive voice</td><td>"It has been demonstrated that access to education reduces inequality."</td></tr>
    <tr><td>Second conditional</td><td>"Were stricter regulations introduced, pollution levels would decline significantly."</td></tr>
    <tr><td>Participle clause</td><td>"Having considered both perspectives, I believe the benefits outweigh the costs."</td></tr>
    <tr><td>Concession clause</td><td>"Although proponents argue X, the evidence suggests that…"</td></tr>
    <tr><td>Cleft sentence</td><td>"It is the long-term consequences that concern researchers most."</td></tr>
  </tbody>
</table>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>Writing fewer than 250 words — automatic Band penalty for Task Achievement</li>
  <li>Using bullet points or numbered lists in the essay body</li>
  <li>Memorised "template" phrases that don't fit the specific question</li>
  <li>Changing your stated position mid-essay</li>
  <li>Spending more than 22 minutes on Task 1 (leaves insufficient time for Task 2)</li>
  <li>Copying the question verbatim in the introduction rather than paraphrasing</li>
</ul>

<h2>Timing Strategy: 40 Minutes, Used Precisely</h2>
<table>
  <thead>
    <tr><th>Activity</th><th>Time</th><th>Goal</th></tr>
  </thead>
  <tbody>
    <tr><td>Read and identify question type</td><td>1 min</td><td>Understand what is being asked</td></tr>
    <tr><td>Plan essay (position + 2 arguments + examples)</td><td>3–4 min</td><td>Direction and coherence</td></tr>
    <tr><td>Write introduction</td><td>4 min</td><td>Clear paraphrase + position</td></tr>
    <tr><td>Write Body 1</td><td>10 min</td><td>Topic sentence, explain, example, link</td></tr>
    <tr><td>Write Body 2</td><td>10 min</td><td>Topic sentence, explain, example, link</td></tr>
    <tr><td>Write conclusion</td><td>4 min</td><td>Restate, no new ideas</td></tr>
    <tr><td>Proofread (grammar + spelling only)</td><td>3 min</td><td>Fix subject-verb agreement, articles</td></tr>
  </tbody>
</table>`,
  },
  {
    id: 'bp-3',
    title: 'IELTS Listening: How to Handle Different Accents',
    slug: 'ielts-listening-different-accents',
    category: 'Listening',
    tags: ['accents', 'listening skills', 'british english', 'australian english'],
    author: 'Emma Clarke',
    status: 'published',
    publishedAt: '2025-10-08',
    updatedAt: '2025-10-08',
    coverImageUrl: 'https://placehold.co/1200x480/7c3aed/ffffff?text=IELTS+Listening+%E2%80%94+Mastering+Different+Accents',
    excerpt: 'Tips and exercises for improving your ability to understand British, Australian, and American accents.',
    content: `<img src="https://placehold.co/1200x480/7c3aed/ffffff?text=IELTS+Listening+%E2%80%94+Mastering+Different+Accents" alt="Accent Training" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Why Accents Are a Core IELTS Challenge</h2>
<p>The IELTS Listening test deliberately uses speakers from a range of English-speaking countries. For candidates who have trained primarily with one variety of English, an unfamiliar accent in Section 3 or 4 can cause a cascade of missed answers.</p>

<blockquote>
  <p>Accent comprehension is a <strong>trainable skill</strong>, not an innate talent. Targeted 4-week exposure programmes reliably improve accent comprehension by 15–25% in controlled studies.</p>
</blockquote>

<h2>Accent Distribution in the IELTS Listening Test</h2>
<table>
  <thead>
    <tr><th>Section</th><th>Context</th><th>Typical Accents</th><th>Difficulty</th></tr>
  </thead>
  <tbody>
    <tr><td>Section 1</td><td>Everyday social situation (2 speakers)</td><td>British, Australian</td><td>★☆☆☆</td></tr>
    <tr><td>Section 2</td><td>Monologue on a general topic</td><td>British, New Zealand</td><td>★★☆☆</td></tr>
    <tr><td>Section 3</td><td>Academic discussion (2–4 speakers)</td><td>British + American mix</td><td>★★★☆</td></tr>
    <tr><td>Section 4</td><td>Academic lecture (1 speaker)</td><td>British, Australian, American</td><td>★★★★</td></tr>
  </tbody>
</table>

<h2>Key Accent Features That Confuse Listeners</h2>

<img src="https://placehold.co/900x300/0369a1/ffffff?text=British+vs+Australian+vs+American+Key+Differences" alt="Accent Comparison" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Feature</th><th>British (RP)</th><th>Australian</th><th>American</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Rhoticity (/r/ sound)</strong></td><td>Non-rhotic — "car" = "cah"</td><td>Non-rhotic — similar to British</td><td>Rhotic — /r/ always pronounced</td></tr>
    <tr><td><strong>Vowel in "bath/dance"</strong></td><td>Long /ɑː/ ("baaath")</td><td>Long /ɑː/ similar</td><td>Short /æ/ ("baath")</td></tr>
    <tr><td><strong>Vowel shifts</strong></td><td>Stable, RP standard</td><td>"today" sounds like "to-die"</td><td>/t/ between vowels → /d/ ("wader")</td></tr>
    <tr><td><strong>Intonation</strong></td><td>Falling statements, formal</td><td>Rising intonation at end of statements</td><td>Variable, often rising-falling</td></tr>
    <tr><td><strong>Common challenge</strong></td><td>Regional accents (Cockney, Scottish)</td><td>Shortened words ("arvo", "rego")</td><td>Vowel mergers ("cot" = "caught")</td></tr>
  </tbody>
</table>

<h2>A 4-Week Accent Training Plan</h2>

<img src="https://placehold.co/900x260/155e35/ffffff?text=4-Week+Accent+Training+Programme" alt="Training Plan" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Week</th><th>Focus</th><th>Daily Activity</th><th>Resource</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Week 1</strong></td><td>Diagnosis</td><td>Full IELTS Listening test; identify which section/accent caused most errors</td><td>Cambridge IELTS 15 or 16</td></tr>
    <tr><td><strong>Week 2</strong></td><td>Targeted exposure</td><td>20 min of native content in your weakest accent daily</td><td>BBC R4 (British), ABC RN (Australian), NPR (American)</td></tr>
    <tr><td><strong>Week 3</strong></td><td>Shadowing</td><td>Choose a 2-min clip and shadow the speaker simultaneously</td><td>Any native podcast or YouTube lecture</td></tr>
    <tr><td><strong>Week 4</strong></td><td>Mixed practice</td><td>IELTS practice tests targeting the hardest accent; aim for 85%+ accuracy</td><td>Official IELTS practice tests</td></tr>
  </tbody>
</table>

<h2>In-Exam Survival Techniques</h2>
<p>When you encounter a difficult accent during the live test:</p>
<ul>
  <li><strong>Anchor to the question text:</strong> Even if you miss words, stay focused on the answer <em>type</em> — a name, a number, a location.</li>
  <li><strong>Do not chase a missed answer:</strong> Spending 10 seconds recovering one answer typically costs you the next 2–3.</li>
  <li><strong>Use contextual logic:</strong> A form-filling exercise signals a number is coming — you don't need to decode every word to capture it.</li>
  <li><strong>Write during the audio:</strong> Don't wait for a "convenient moment" — write your answer immediately when you hear it.</li>
</ul>

<h2>Recommended Resources by Accent</h2>
<table>
  <thead>
    <tr><th>Accent</th><th>Free Resource</th><th>Content Type</th><th>Speed Level</th></tr>
  </thead>
  <tbody>
    <tr><td>British</td><td>BBC Sounds / BBC World Service</td><td>News, documentaries, drama</td><td>Native speed</td></tr>
    <tr><td>Australian</td><td>ABC Radio National</td><td>Interviews, current affairs</td><td>Native speed</td></tr>
    <tr><td>American</td><td>NPR / TED Talks</td><td>News, lectures, talks</td><td>Slightly slower for TED</td></tr>
    <tr><td>Mixed</td><td>Elllo.org</td><td>IELTS-style listening exercises with transcripts</td><td>Graded</td></tr>
    <tr><td>Academic</td><td>Coursera / edX lectures</td><td>University lectures, international speakers</td><td>Native speed</td></tr>
  </tbody>
</table>

<blockquote>
  <p>Passive background listening helps, but <strong>deliberate practice with immediate transcript feedback</strong> is what moves your score. Listen → transcribe → check → repeat.</p>
</blockquote>`,
  },
  {
    id: 'bp-4',
    title: 'The Ultimate IELTS Reading Vocabulary List',
    slug: 'ultimate-ielts-reading-vocabulary',
    category: 'Reading',
    tags: ['vocabulary', 'word list', 'academic words', 'reading'],
    author: 'Sarah Mitchell',
    status: 'published',
    publishedAt: '2025-10-22',
    updatedAt: '2025-11-05',
    coverImageUrl: 'https://placehold.co/1200x480/064e3b/ffffff?text=Ultimate+IELTS+Vocabulary+List',
    excerpt: 'A curated list of 500+ words that appear most frequently in IELTS reading passages.',
    content: `<img src="https://placehold.co/1200x480/064e3b/ffffff?text=Ultimate+IELTS+Reading+Vocabulary+Guide" alt="Vocabulary Guide" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Why Vocabulary Is the Bottleneck in IELTS Reading</h2>
<p>IELTS Reading texts are drawn from academic books, journals, and quality newspapers. Candidates with a reading vocabulary below roughly <strong>6,000 word families</strong> encounter multiple unknown words per passage, forcing repeated guess-from-context under time pressure.</p>

<blockquote>
  <p>Nation (2001) estimates that you need to know <strong>95–98% of words in a text</strong> to read it comfortably without a dictionary. Most IELTS Band 6 candidates know roughly 90% — that gap of 5–8% creates enormous comprehension load under exam pressure.</p>
</blockquote>

<h2>Word Frequency in IELTS Passages: What You Actually Need</h2>
<table>
  <thead>
    <tr><th>Vocabulary Tier</th><th>Word Families</th><th>Text Coverage</th><th>Priority</th></tr>
  </thead>
  <tbody>
    <tr><td>General Service List (most common words)</td><td>~2,000</td><td>~80% of any text</td><td>Must know all</td></tr>
    <tr><td>Academic Word List (AWL)</td><td>570</td><td>~10% of academic texts</td><td>High priority</td></tr>
    <tr><td>Topic-specific vocabulary</td><td>~1,000–2,000</td><td>~4–5% of IELTS texts</td><td>Medium priority</td></tr>
    <tr><td>Low-frequency / rare words</td><td>Thousands</td><td>~5% of any text</td><td>Context-guess only</td></tr>
  </tbody>
</table>

<h2>How to Learn Word Families, Not Just Words</h2>
<p>Learning "vary" as a standalone word is inefficient. Learning the full word family multiplies your recognition with the same study effort:</p>

<img src="https://placehold.co/900x280/1e40af/ffffff?text=Word+Family+Learning+Framework" alt="Word Family Framework" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Root</th><th>Verb</th><th>Noun</th><th>Adjective</th><th>Adverb</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>vary</strong></td><td>vary / varies / varied</td><td>variation / variety</td><td>variable / various</td><td>variably</td></tr>
    <tr><td><strong>analyse</strong></td><td>analyse / analyzed</td><td>analysis / analyst</td><td>analytical</td><td>analytically</td></tr>
    <tr><td><strong>establish</strong></td><td>establish / established</td><td>establishment</td><td>established / well-established</td><td>—</td></tr>
    <tr><td><strong>indicate</strong></td><td>indicate / indicated</td><td>indication / indicator</td><td>indicative</td><td>indicatively</td></tr>
    <tr><td><strong>significant</strong></td><td>signify</td><td>significance</td><td>significant / insignificant</td><td>significantly</td></tr>
  </tbody>
</table>

<h2>Tier 1: Academic Word List Essentials (Top 30)</h2>
<p>The Academic Word List covers approximately 10% of academic texts. Master these 30 word families first — they appear in nearly every IELTS Reading passage:</p>
<table>
  <thead>
    <tr><th>Word Family</th><th>Core Meaning</th><th>IELTS Context Example</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>analyse / analysis</strong></td><td>Systematic examination of data or concepts</td><td>"The analysis revealed a correlation between…"</td></tr>
    <tr><td><strong>approach</strong></td><td>Method or way of handling something</td><td>"A new approach to environmental management…"</td></tr>
    <tr><td><strong>assess / assessment</strong></td><td>To evaluate or judge</td><td>"Researchers assessed the long-term impact of…"</td></tr>
    <tr><td><strong>assume / assumption</strong></td><td>To accept as true without proof</td><td>"The study rests on the assumption that…"</td></tr>
    <tr><td><strong>concept / conceptual</strong></td><td>Abstract idea or principle</td><td>"The concept of sustainable development…"</td></tr>
    <tr><td><strong>constitute</strong></td><td>To make up or form</td><td>"These factors constitute a major risk…"</td></tr>
    <tr><td><strong>context / contextual</strong></td><td>Circumstances surrounding something</td><td>"Viewed in its historical context, the decision…"</td></tr>
    <tr><td><strong>derive</strong></td><td>To obtain from a source</td><td>"Benefits derived from renewable energy include…"</td></tr>
    <tr><td><strong>establish</strong></td><td>To set up or prove conclusively</td><td>"Scientists established a clear causal link…"</td></tr>
    <tr><td><strong>function</strong></td><td>Purpose, role, or to operate</td><td>"The brain functions as the body's control centre."</td></tr>
  </tbody>
</table>

<h2>Tier 2: High-Frequency Passage Vocabulary</h2>
<p>These words appear repeatedly across IELTS Reading passages on all topics. Master their precise usage, not just their general meaning:</p>

<img src="https://placehold.co/900x260/701a75/ffffff?text=High-Frequency+IELTS+Academic+Vocabulary" alt="High Frequency Vocabulary" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Word</th><th>Precise Meaning</th><th>Common Paraphrase In Passages</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>albeit</strong></td><td>Although / even though</td><td>"positive, albeit modest, results"</td></tr>
    <tr><td><strong>attribute (v)</strong></td><td>To credit to a cause</td><td>"The decline is attributed to overfishing."</td></tr>
    <tr><td><strong>compound (v)</strong></td><td>To make a problem worse</td><td>"High temperatures compound the drought effect."</td></tr>
    <tr><td><strong>contend</strong></td><td>To argue or claim strongly</td><td>"Critics contend that the policy is misguided."</td></tr>
    <tr><td><strong>disparity</strong></td><td>Inequality, especially in scale</td><td>"income disparities between urban and rural areas"</td></tr>
    <tr><td><strong>elicit</strong></td><td>To draw out a response</td><td>"designed to elicit a measurable response"</td></tr>
    <tr><td><strong>exacerbate</strong></td><td>To make considerably worse</td><td>"Pollution exacerbates respiratory conditions."</td></tr>
    <tr><td><strong>mitigate</strong></td><td>To reduce the severity of</td><td>"Wetlands mitigate flood risk."</td></tr>
    <tr><td><strong>paradigm</strong></td><td>A dominant model or framework</td><td>"a paradigm shift in scientific thinking"</td></tr>
    <tr><td><strong>proliferate</strong></td><td>To increase rapidly in number</td><td>"Social media platforms have proliferated."</td></tr>
  </tbody>
</table>

<h2>Topic-Specific Vocabulary Banks</h2>
<p>IELTS passages cluster around six recurring themes. Build a dedicated vocabulary bank for each:</p>
<table>
  <thead>
    <tr><th>Topic</th><th>Key Vocabulary</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Environment</strong></td><td>biodiversity, deforestation, carbon sequestration, ecosystem services, sustainability, habitat degradation</td></tr>
    <tr><td><strong>Technology</strong></td><td>automation, artificial intelligence, algorithm, disruption, innovation, digital infrastructure</td></tr>
    <tr><td><strong>Society &amp; Demographics</strong></td><td>urbanisation, demographic shift, social cohesion, marginalisation, inequality, ageing population</td></tr>
    <tr><td><strong>Health &amp; Science</strong></td><td>pathogen, mortality rate, clinical trial, sedentary lifestyle, chronic disease, placebo effect</td></tr>
    <tr><td><strong>Economy</strong></td><td>fiscal policy, GDP, trade deficit, monetary policy, supply chain, austerity measures</td></tr>
    <tr><td><strong>Education</strong></td><td>pedagogy, curriculum, attainment gap, vocational training, lifelong learning, cognitive development</td></tr>
  </tbody>
</table>

<h2>Effective Learning Method: 5-Step Vocabulary Acquisition</h2>
<ol>
  <li><strong>Encounter in context:</strong> Read the word in a full sentence from an authentic source — not an isolated definition.</li>
  <li><strong>Map the word family:</strong> Note all related forms (noun, verb, adjective, adverb).</li>
  <li><strong>Learn its collocations:</strong> What words typically appear before and after it?</li>
  <li><strong>Add to spaced repetition:</strong> Anki (free) with sentence-level cards, not definition cards.</li>
  <li><strong>Produce it actively:</strong> Use the word in three original sentences within 24 hours of learning it.</li>
</ol>

<blockquote>
  <p>Spaced repetition + contextual production is <strong>3× more effective</strong> for long-term retention than passive re-reading, according to Ebbinghaus forgetting curve research. Spend 15 minutes per day on vocabulary review and compound the gains over 8 weeks.</p>
</blockquote>`,
  },
  {
    id: 'bp-5',
    title: 'Speaking Part 2: How to Speak for 2 Minutes Confidently',
    slug: 'ielts-speaking-part-2-tips',
    category: 'Speaking',
    tags: ['speaking part 2', 'long turn', 'fluency', 'cue card'],
    author: 'Daniel Wong',
    status: 'published',
    publishedAt: '2025-11-15',
    updatedAt: '2025-11-15',
    coverImageUrl: 'https://placehold.co/1200x480/7c2d12/ffffff?text=IELTS+Speaking+Part+2+%E2%80%94+Long+Turn+Masterclass',
    excerpt: 'Learn how to structure your long turn response and fill the 2-minute speaking requirement confidently.',
    content: `<img src="https://placehold.co/1200x480/7c2d12/ffffff?text=IELTS+Speaking+Part+2+%E2%80%94+Long+Turn+Masterclass" alt="Speaking Part 2" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>What Speaking Part 2 Actually Tests</h2>
<p>Part 2, the <em>Long Turn</em>, is the most intimidating section for most candidates. You are given a cue card with a topic and four prompts, then have one minute to prepare and one to two minutes to speak without interruption.</p>

<table>
  <thead>
    <tr><th>Part</th><th>Duration</th><th>Format</th><th>What Is Being Assessed</th></tr>
  </thead>
  <tbody>
    <tr><td>Part 1</td><td>4–5 min</td><td>Short questions on familiar topics</td><td>Comfortable fluency, basic range</td></tr>
    <tr><td><strong>Part 2</strong></td><td>3–4 min total</td><td>Cue card + 1 min prep + 1–2 min talk</td><td><strong>Extended discourse, organisation, range</strong></td></tr>
    <tr><td>Part 3</td><td>4–5 min</td><td>Abstract discussion linked to Part 2 topic</td><td>Complex reasoning, argumentation</td></tr>
  </tbody>
</table>

<h2>The PEEL Framework for Extended Speech</h2>
<p>Structure each major point using PEEL to automatically generate 20–30 seconds of fluent content per point:</p>

<img src="https://placehold.co/900x300/1e40af/ffffff?text=PEEL+Framework%3A+Point+%E2%80%94+Explain+%E2%80%94+Example+%E2%80%94+Link" alt="PEEL Framework" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Element</th><th>Content</th><th>Example (on "a skill you learned")</th><th>Time</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>P – Point</strong></td><td>State your main idea clearly</td><td>"The skill I learned is cooking Thai food from scratch."</td><td>~5 sec</td></tr>
    <tr><td><strong>E – Explain</strong></td><td>Say why or how</td><td>"I was living alone during the pandemic and delivery services were unavailable."</td><td>~10 sec</td></tr>
    <tr><td><strong>E – Example</strong></td><td>Specific, vivid detail or memory</td><td>"I remember burning the first batch of pad kra pao and having to start over at midnight."</td><td>~10 sec</td></tr>
    <tr><td><strong>L – Link</strong></td><td>Connect back or bridge forward</td><td>"This not only solved a practical problem, but it also sparked a lasting passion for cooking."</td><td>~5 sec</td></tr>
  </tbody>
</table>

<p>Four PEEL points × 30 seconds = 120 seconds, plus your opening and closing = consistently hitting the 2-minute target.</p>

<h2>Using Your Preparation Minute Wisely</h2>
<p>You have exactly 60 seconds before speaking. Use them with precision:</p>

<table>
  <thead>
    <tr><th>Seconds</th><th>Activity</th><th>Goal</th></tr>
  </thead>
  <tbody>
    <tr><td>0–10</td><td>Choose your angle</td><td>Pick the topic, person, or event that gives you the <em>most to say</em>, not the "best" option</td></tr>
    <tr><td>10–45</td><td>Jot 4 bullet notes</td><td>One memory-anchor word per cue card prompt — not full sentences</td></tr>
    <tr><td>45–60</td><td>Prepare your opener</td><td>Decide your first sentence — starting confidently sets the tone for 2 full minutes</td></tr>
  </tbody>
</table>

<blockquote>
  <p>The cue card prompts are <strong>suggestions, not a script</strong>. You can reorder them, combine two into one, or spend extra time on the point you can speak about most fluently. Examiners do not penalise you for this.</p>
</blockquote>

<h2>Sample Opening Sentences That Work</h2>
<p>Your opening sentence should announce the topic and set up your first point. Avoid "Uh, I think I will talk about…" — it wastes precious seconds and signals nervousness:</p>
<ul>
  <li>"I'd like to talk about a skill I learned during the pandemic — cooking Thai food from scratch."</li>
  <li>"The person I'm going to describe is my university professor, Dr. Patel, who had a profound influence on my career direction."</li>
  <li>"I'm going to talk about a trip I took to Kyoto three years ago — without question one of my most vivid travel memories."</li>
  <li>"The most useful skill I've ever learned is time management — something I picked up during my final year of university."</li>
</ul>

<h2>Extension Techniques for Extra Time</h2>
<p>If you approach the end of your planned points before two minutes are up, extend naturally — never trail off or repeat yourself:</p>

<img src="https://placehold.co/900x240/065f46/ffffff?text=Natural+Extension+Strategies+for+Speaking+Part+2" alt="Extension Strategies" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Technique</th><th>Phrase to Use</th></tr>
  </thead>
  <tbody>
    <tr><td>Contrast with the past</td><td>"Before I learned this, I used to… but now I…"</td></tr>
    <tr><td>Hypothetical extension</td><td>"If I had more time, I would probably also…"</td></tr>
    <tr><td>Emotional reflection</td><td>"Looking back, what surprised me most was…"</td></tr>
    <tr><td>Future relevance</td><td>"I think this will continue to influence me because…"</td></tr>
    <tr><td>Comparison</td><td>"Compared to other experiences I've had, this was unique because…"</td></tr>
  </tbody>
</table>

<h2>Vocabulary and Grammar to Target in Part 2</h2>
<ul>
  <li><strong>Narrative tenses:</strong> "I had been trying for months when I finally succeeded…"</li>
  <li><strong>Discourse markers:</strong> "In terms of…", "What really stood out was…", "Having said that…"</li>
  <li><strong>Descriptive adjectives:</strong> "breathtaking", "formidable", "unexpectedly rewarding", "profoundly moving"</li>
  <li><strong>Hedging language:</strong> "As far as I can recall…", "It seemed to me that…", "Looking back, I'd say…"</li>
</ul>`,
  },
  {
    id: 'bp-6',
    title: 'IELTS vs TOEFL: Which Test Should You Take?',
    slug: 'ielts-vs-toefl-comparison',
    category: 'General',
    tags: ['ielts vs toefl', 'test comparison', 'beginner', 'test choice'],
    author: 'James Harper',
    status: 'published',
    publishedAt: '2025-12-03',
    updatedAt: '2025-12-03',
    coverImageUrl: 'https://placehold.co/1200x480/1e3a5f/ffffff?text=IELTS+vs+TOEFL+%E2%80%94+Complete+Comparison+2025',
    excerpt: 'A comprehensive comparison of IELTS and TOEFL to help you decide which test suits your goals.',
    seo: {
      metaTitle: 'IELTS vs TOEFL 2025: Which Test Should You Take?',
      metaDescription: 'Detailed comparison of IELTS and TOEFL covering format, score equivalence, country acceptance, and a decision framework to help you choose.',
      focusKeyword: 'IELTS vs TOEFL comparison',
      ogImage: 'https://placehold.co/1200x630/1e3a5f/ffffff?text=IELTS+vs+TOEFL+2025',
    },
    content: `<img src="https://placehold.co/1200x480/1e3a5f/ffffff?text=IELTS+vs+TOEFL+%E2%80%94+Which+Test+Is+Right+for+You%3F" alt="IELTS vs TOEFL" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>The Short Answer</h2>
<p>Both IELTS and TOEFL are globally recognised English proficiency tests accepted by universities in most English-speaking countries. The choice is less about which is "easier" and more about <strong>which format suits your strengths</strong> and which institutions you are applying to.</p>

<blockquote>
  <p>Over <strong>11,500 universities and institutions</strong> accept IELTS. TOEFL is accepted by over <strong>12,000</strong>. For most applicants, both are valid — the decision comes down to format preference and destination country.</p>
</blockquote>

<h2>Format Comparison at a Glance</h2>
<table>
  <thead>
    <tr><th>Component</th><th>IELTS Academic</th><th>TOEFL iBT</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Total duration</strong></td><td>2 hr 45 min</td><td>~2 hr (shortened format since 2023)</td></tr>
    <tr><td><strong>Listening</strong></td><td>4 sections, 40 questions, 30 min + 10 min transfer</td><td>3 lectures + 2 conversations, 28 questions, 36 min</td></tr>
    <tr><td><strong>Reading</strong></td><td>3 passages, 40 questions, 60 min</td><td>2 passages, 20 questions, 35 min</td></tr>
    <tr><td><strong>Writing</strong></td><td>Task 1 (chart/diagram, 20 min) + Task 2 (essay, 40 min)</td><td>Integrated task (25 min) + Academic discussion (10 min)</td></tr>
    <tr><td><strong>Speaking</strong></td><td>Face-to-face interview with a certified examiner, 11–14 min</td><td>4 tasks recorded into a microphone, ~17 min</td></tr>
    <tr><td><strong>Accents</strong></td><td>British, Australian, New Zealand, North American</td><td>Primarily North American</td></tr>
    <tr><td><strong>Score scale</strong></td><td>0–9 bands, 0.5 increments</td><td>0–120 total (0–30 per section)</td></tr>
    <tr><td><strong>Result delivery</strong></td><td>13 days (paper) / 3–5 days (computer)</td><td>4–8 days</td></tr>
    <tr><td><strong>Validity</strong></td><td>2 years</td><td>2 years</td></tr>
    <tr><td><strong>Approximate cost</strong></td><td>USD 215–245</td><td>USD 185–245</td></tr>
  </tbody>
</table>

<h2>Score Equivalence</h2>
<img src="https://placehold.co/900x280/0369a1/ffffff?text=IELTS+%E2%86%94+TOEFL+Score+Equivalence+Chart" alt="Score Equivalence" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>IELTS Band</th><th>TOEFL iBT Score</th><th>Typical Requirement For</th></tr>
  </thead>
  <tbody>
    <tr><td>5.5</td><td>46–59</td><td>English language support programs</td></tr>
    <tr><td>6.0</td><td>60–78</td><td>Foundation / pathway programs</td></tr>
    <tr><td>6.5</td><td>79–93</td><td>Most undergraduate programs</td></tr>
    <tr><td>7.0</td><td>94–101</td><td>Competitive universities, most postgraduate</td></tr>
    <tr><td>7.5</td><td>102–109</td><td>Top-ranked universities, law &amp; medicine</td></tr>
    <tr><td>8.0</td><td>110–120</td><td>Oxbridge, Ivy League, elite doctoral programs</td></tr>
  </tbody>
</table>

<h2>Which Countries Accept Which Test?</h2>
<table>
  <thead>
    <tr><th>Country / Purpose</th><th>IELTS</th><th>TOEFL</th><th>Verdict</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>UK Universities</strong></td><td>Widely accepted, often preferred</td><td>Accepted at most</td><td>Either, slight edge to IELTS</td></tr>
    <tr><td><strong>Australia / NZ</strong></td><td>Standard choice</td><td>Accepted at most</td><td>IELTS strongly preferred</td></tr>
    <tr><td><strong>Canada</strong></td><td>Widely accepted</td><td>Accepted at most</td><td>Either</td></tr>
    <tr><td><strong>USA</strong></td><td>Accepted at nearly all universities</td><td>Historically dominant</td><td>Either</td></tr>
    <tr><td><strong>UK / Australian Visas</strong></td><td>Required</td><td>Not accepted</td><td><strong>IELTS only</strong></td></tr>
    <tr><td><strong>Canadian Immigration (IRCC)</strong></td><td>Accepted</td><td>Not typically accepted</td><td><strong>IELTS strongly preferred</strong></td></tr>
  </tbody>
</table>

<h2>How to Choose: Decision Framework</h2>

<img src="https://placehold.co/900x260/701a75/ffffff?text=IELTS+vs+TOEFL+Decision+Framework" alt="Decision Framework" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>If this describes you…</th><th>Choose</th><th>Reason</th></tr>
  </thead>
  <tbody>
    <tr><td>Applying to UK / Australian / NZ institutions</td><td><strong>IELTS</strong></td><td>Preferred or required by most institutions</td></tr>
    <tr><td>Applying for immigration (UK, Australia, Canada)</td><td><strong>IELTS</strong></td><td>TOEFL not accepted for visa purposes</td></tr>
    <tr><td>Applying primarily to US universities</td><td>Either</td><td>Both widely accepted; choose by format preference</td></tr>
    <tr><td>Strong spoken English, comfortable with people</td><td><strong>IELTS</strong></td><td>Face-to-face Speaking feels more natural</td></tr>
    <tr><td>Prefer no human interaction in Speaking</td><td><strong>TOEFL</strong></td><td>All Speaking tasks recorded into a microphone</td></tr>
    <tr><td>Slower reader under time pressure</td><td><strong>TOEFL</strong></td><td>Shorter passages, more time per question in Reading</td></tr>
    <tr><td>Trained mainly on American English</td><td><strong>TOEFL</strong></td><td>Listening uses predominantly American English</td></tr>
    <tr><td>Familiar with chart/data description writing</td><td><strong>IELTS</strong></td><td>Task 1 Academic plays directly to this strength</td></tr>
  </tbody>
</table>

<blockquote>
  <p><strong>Our recommendation:</strong> If both tests are accepted by your target institution, take a free diagnostic practice test for each format and go with whichever feels more comfortable. The format you're more comfortable with almost always yields a higher score than the "objectively easier" test on paper.</p>
</blockquote>`,
  },
  {
    id: 'bp-7',
    title: 'How to Prepare for IELTS in 30 Days',
    slug: 'prepare-ielts-30-days',
    category: 'Study Tips',
    tags: ['30 day plan', 'study schedule', 'preparation', 'beginner'],
    author: 'Sarah Mitchell',
    status: 'published',
    publishedAt: '2026-01-10',
    updatedAt: '2026-01-10',
    coverImageUrl: 'https://placehold.co/1200x480/134e4a/ffffff?text=30-Day+IELTS+Preparation+Plan',
    excerpt: 'A structured 30-day study plan to help you prepare efficiently for the IELTS exam.',
    content: `<img src="https://placehold.co/1200x480/134e4a/ffffff?text=30-Day+IELTS+Preparation+Plan" alt="30 Day Plan" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Is 30 Days Enough?</h2>
<p>Thirty days is enough to <em>meaningfully improve</em> your band score — if your English level is already at or near your target and you can study consistently. This plan assumes 2–3 hours of daily study and a starting point of approximately Band 5.5–6.5.</p>

<table>
  <thead>
    <tr><th>Starting Band</th><th>Target Band</th><th>Is 30 Days Realistic?</th></tr>
  </thead>
  <tbody>
    <tr><td>5.0–5.5</td><td>6.5+</td><td>Unlikely — language development takes longer</td></tr>
    <tr><td>5.5–6.0</td><td>6.5</td><td>Possible with intensive effort</td></tr>
    <tr><td>6.0–6.5</td><td>7.0</td><td>Realistic with structured test-skills focus</td></tr>
    <tr><td>6.5–7.0</td><td>7.5</td><td>Realistic with precise criteria targeting</td></tr>
    <tr><td>7.0+</td><td>7.5–8.0</td><td>Requires longer for marginal language gains</td></tr>
  </tbody>
</table>

<h2>The 4-Week Framework</h2>

<img src="https://placehold.co/1000x320/0f4c75/ffffff?text=Week+1%3A+Diagnose+%7C+Week+2%3A+Build+%7C+Week+3%3A+Strategy+%7C+Week+4%3A+Simulate" alt="4 Week Framework" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Week 1: Diagnostic and Foundations (Days 1–7)</h2>
<p>The goal of Week 1 is to understand exactly where you stand and to build the habits that underpin strong performance in every section:</p>
<ol>
  <li><strong>Day 1:</strong> Complete a full diagnostic test under timed conditions (Cambridge IELTS 15 or 16). Score each section.</li>
  <li><strong>Day 2:</strong> Review every incorrect answer. Categorise errors: vocabulary gap, attention slip, or strategy failure?</li>
  <li><strong>Day 3–4:</strong> Read the public band descriptors for all four skills (free on British Council website). Understand what Band 7 looks like.</li>
  <li><strong>Day 5:</strong> Begin daily vocabulary work — 15 new words per day in Anki using sentence-level cards.</li>
  <li><strong>Day 6–7:</strong> Write 5 Task 2 essay <em>plans only</em> (no full essays yet). 3 minutes each. Practice identifying question type before planning.</li>
</ol>

<h2>Weekly Study Hours Allocation</h2>
<table>
  <thead>
    <tr><th>Week</th><th>Focus Theme</th><th>Reading</th><th>Listening</th><th>Writing</th><th>Speaking</th><th>Total</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Week 1</strong></td><td>Diagnose &amp; Foundations</td><td>30 min</td><td>30 min</td><td>20 min</td><td>20 min</td><td>~7 hrs</td></tr>
    <tr><td><strong>Week 2</strong></td><td>Skill Building</td><td>45 min</td><td>45 min</td><td>45 min</td><td>30 min</td><td>~12 hrs</td></tr>
    <tr><td><strong>Week 3</strong></td><td>Strategy &amp; Speed</td><td>40 min</td><td>40 min</td><td>50 min</td><td>40 min</td><td>~12 hrs</td></tr>
    <tr><td><strong>Week 4</strong></td><td>Mock Tests &amp; Consolidation</td><td>60 min</td><td>60 min</td><td>60 min</td><td>30 min</td><td>~14 hrs</td></tr>
  </tbody>
</table>

<h2>Week 2: Skill Building (Days 8–14)</h2>
<p>Week 2 is your highest-intensity week. You are building skills rather than just taking practice tests:</p>
<ul>
  <li><strong>Reading:</strong> One full Reading section per day. After checking answers, trace every incorrect answer back to the exact line in the text. Build location instinct.</li>
  <li><strong>Listening:</strong> One section per day with transcript available. After answering, listen again and shadow the speaker. Target your weakest accent.</li>
  <li><strong>Writing:</strong> One full Task 2 essay every two days. Self-mark against the examiner criteria. Aim for 270–290 words.</li>
  <li><strong>Speaking:</strong> Record a Part 1 + Part 2 + Part 3 session each day. Listen back and assess fluency, vocabulary range, and grammatical accuracy.</li>
</ul>

<h2>Week 3: Strategy and Speed (Days 15–21)</h2>

<img src="https://placehold.co/900x260/9a3412/ffffff?text=Week+3+Focus%3A+Test+Strategy+and+Exam+Speed" alt="Week 3 Strategy" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Skill</th><th>Strategy Focus</th><th>Key Technique</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Reading</strong></td><td>Skimming before questions</td><td>Read headings + first sentences of each paragraph before looking at questions</td></tr>
    <tr><td><strong>Listening</strong></td><td>Predicting answer types</td><td>From question text alone, predict whether the answer is a number, name, date, or phrase</td></tr>
    <tr><td><strong>Writing Task 1</strong></td><td>Overview paragraph</td><td>Practise writing a two-sentence overview that identifies the main trend — this alone is worth a full band</td></tr>
    <tr><td><strong>Speaking Part 1</strong></td><td>Two-sentence expansion rule</td><td>Every answer = direct response + one extension ("Because…" or "For example…")</td></tr>
  </tbody>
</table>

<h2>Week 4: Mock Tests and Consolidation (Days 22–30)</h2>
<ul>
  <li><strong>Days 22–25:</strong> Complete two full mock tests on separate days — all four sections in one sitting. Review errors immediately after each test.</li>
  <li><strong>Days 26–28:</strong> Focus entirely on your weakest remaining area. Targeted practice, not more full tests.</li>
  <li><strong>Day 29:</strong> Light revision only — review your vocabulary deck, re-read your best Writing essay, one Speaking Part 2 for confidence.</li>
  <li><strong>Day 30:</strong> Rest completely. Trust your preparation, sleep well, arrive at the test centre early.</li>
</ul>

<h2>Daily Non-Negotiables (Every Day, All 30 Days)</h2>

<blockquote>
  <p>These three habits take 45–60 minutes and compound dramatically over 30 days. No exceptions — not even on test week.</p>
</blockquote>

<table>
  <thead>
    <tr><th>Habit</th><th>Time</th><th>Method</th></tr>
  </thead>
  <tbody>
    <tr><td>Vocabulary review</td><td>15 min</td><td>Anki spaced repetition — new cards + review due cards</td></tr>
    <tr><td>Authentic reading</td><td>20–30 min</td><td>Quality newspaper or academic article — active reading with vocabulary notes</td></tr>
    <tr><td>Speaking practice</td><td>10–15 min</td><td>Record one Part 2 response and one Part 3 answer; listen back critically</td></tr>
  </tbody>
</table>`,
  },
  {
    id: 'bp-8',
    title: 'Common Grammar Mistakes in IELTS Writing',
    slug: 'common-grammar-mistakes-ielts-writing',
    category: 'Writing',
    tags: ['grammar', 'common mistakes', 'writing errors', 'band 6'],
    author: 'Emma Clarke',
    status: 'published',
    publishedAt: '2026-02-05',
    updatedAt: '2026-02-05',
    coverImageUrl: 'https://placehold.co/1200x480/4a1d96/ffffff?text=Grammar+Mistakes+in+IELTS+Writing',
    excerpt: 'Identify and fix the most common grammatical errors that cost students marks in the writing section.',
    content: `<img src="https://placehold.co/1200x480/4a1d96/ffffff?text=7+Grammar+Mistakes+That+Cost+You+Marks+in+IELTS+Writing" alt="Grammar Mistakes" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>Grammar in the IELTS Writing Rubric</h2>
<p>Grammatical Range and Accuracy (GRA) accounts for <strong>25% of your Writing band score</strong>. A Band 7 requires "a variety of complex structures with some flexibility and accuracy". The difference between Band 6 and Band 7 is not just avoiding mistakes — it is demonstrating <em>variety and control simultaneously</em>.</p>

<h2>Error Frequency in IELTS Writing Scripts</h2>
<table>
  <thead>
    <tr><th>Error Type</th><th>Frequency in Band 5–6 Scripts</th><th>Band Impact</th></tr>
  </thead>
  <tbody>
    <tr><td>Subject-verb agreement</td><td>Very high — present in ~70% of Band 5–6 scripts</td><td>High — repeated errors cap GRA at Band 5</td></tr>
    <tr><td>Article errors (a/the/zero)</td><td>High — particularly for Asian and Arabic speakers</td><td>Medium-high — accumulates into band drag</td></tr>
    <tr><td>Wrong verb tense</td><td>High — especially mixing present and past</td><td>Medium — affects accuracy score</td></tr>
    <tr><td>Comma splices</td><td>Medium — very common in Band 5 essays</td><td>High — signals sentence-boundary unawareness</td></tr>
    <tr><td>Passive voice overuse</td><td>Medium — common strategy misuse</td><td>Low-medium — reduces clarity more than accuracy</td></tr>
    <tr><td>Dangling modifiers</td><td>Low-medium</td><td>Medium — confuses meaning</td></tr>
    <tr><td>Wrong prepositions</td><td>Very high — idiomatic, hard to learn by rules</td><td>Medium — marks as non-native usage</td></tr>
  </tbody>
</table>

<h2>Error 1: Subject-Verb Agreement</h2>
<p>The most frequent error in IELTS Writing. It occurs most often when a complex noun phrase separates the subject from the verb:</p>

<img src="https://placehold.co/900x220/1e3a5f/ffffff?text=Subject-Verb+Agreement+Error+Examples" alt="SVA Errors" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Incorrect</th><th>Correct</th><th>Rule</th></tr>
  </thead>
  <tbody>
    <tr><td>"The <em>number</em> of students… <strong>have</strong> increased."</td><td>"The <em>number</em>… <strong>has</strong> increased."</td><td>Head noun is "number" (singular), not "students"</td></tr>
    <tr><td>"Each of the proposals <strong>were</strong> rejected."</td><td>"Each of the proposals <strong>was</strong> rejected."</td><td>"Each" is always singular</td></tr>
    <tr><td>"The data <strong>shows</strong> that…" (British)</td><td>"The data <strong>show</strong> that…" (British formal)</td><td>"Data" is plural in academic British English</td></tr>
  </tbody>
</table>

<h2>Error 2: Article Errors (a / an / the)</h2>
<p>Article usage is one of the most persistent challenges for speakers of languages without articles. The core rules:</p>
<ul>
  <li>Use <strong>a/an</strong> for first mention of a countable singular noun: "a government policy"</li>
  <li>Use <strong>the</strong> for subsequent mention or unique referents: "the policy was effective"</li>
  <li>Use <strong>no article</strong> for uncountable nouns in general statements: "Education is a human right." (not "The education")</li>
  <li>Use <strong>the</strong> with superlatives, ordinals, and unique entities: "the most effective approach", "the government"</li>
</ul>

<h2>Error 3–7: Before/After Comparison</h2>
<table>
  <thead>
    <tr><th>Error Type</th><th>Incorrect Example</th><th>Correct Rewrite</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Wrong tense</strong></td><td>"CO₂ levels <em>rise</em> since 1950."</td><td>"CO₂ levels <em>have risen</em> since 1950."</td></tr>
    <tr><td><strong>Comma splice</strong></td><td>"Online learning is convenient<em>,</em> it allows flexible scheduling."</td><td>"Online learning is convenient<em>; it</em> allows flexible scheduling."</td></tr>
    <tr><td><strong>Passive overuse</strong></td><td>"It is believed that measures should be taken and policies should be implemented."</td><td>"Governments should implement stronger environmental policies."</td></tr>
    <tr><td><strong>Dangling modifier</strong></td><td>"Having studied the data, <em>the conclusion was drawn</em>…"</td><td>"Having studied the data, <em>researchers concluded</em>…"</td></tr>
    <tr><td><strong>Wrong preposition</strong></td><td>"The outcome depends <em>of</em> government investment."</td><td>"The outcome depends <em>on</em> government investment."</td></tr>
  </tbody>
</table>

<h2>High-Priority Preposition Collocations</h2>
<table>
  <thead>
    <tr><th>Verb / Adjective</th><th>Correct Preposition</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td>depend</td><td><strong>on</strong></td><td>"The outcome depends <em>on</em> funding."</td></tr>
    <tr><td>attributed</td><td><strong>to</strong></td><td>"The rise is attributed <em>to</em> urban growth."</td></tr>
    <tr><td>responsible</td><td><strong>for</strong></td><td>"Governments are responsible <em>for</em> infrastructure."</td></tr>
    <tr><td>result in</td><td><strong>in</strong></td><td>"Tax cuts result <em>in</em> reduced public services."</td></tr>
    <tr><td>result from</td><td><strong>from</strong></td><td>"The crisis resulted <em>from</em> poor regulation."</td></tr>
    <tr><td>contribute</td><td><strong>to</strong></td><td>"This contributes <em>to</em> social inequality."</td></tr>
    <tr><td>associated</td><td><strong>with</strong></td><td>"Smoking is associated <em>with</em> cancer."</td></tr>
  </tbody>
</table>

<blockquote>
  <p><strong>Proofreading tip:</strong> Leave 3 minutes at the end of your Writing exam. Read specifically for grammar mechanics — do not re-read for content. Check subject-verb agreement on every verb, articles on every noun, and punctuation at every sentence boundary. One targeted pass catches more errors than a general re-read.</p>
</blockquote>`,
  },
  {
    id: 'bp-9',
    title: 'Skimming and Scanning Techniques for IELTS Reading',
    slug: 'skimming-scanning-ielts-reading',
    category: 'Reading',
    tags: ['skimming', 'scanning', 'reading techniques', 'time management'],
    author: 'Daniel Wong',
    status: 'draft',
    publishedAt: null,
    updatedAt: '2026-03-20',
    coverImageUrl: 'https://placehold.co/1200x480/0c4a6e/ffffff?text=Skimming+%26+Scanning+for+IELTS+Reading',
    excerpt: 'Master the essential reading techniques that will help you answer all 40 questions within the time limit.',
    content: `<img src="https://placehold.co/1200x480/0c4a6e/ffffff?text=Skimming+%26+Scanning+%E2%80%94+IELTS+Reading+Techniques" alt="Reading Techniques" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>The Time Problem in IELTS Reading</h2>
<p>The IELTS Academic Reading section contains three passages totalling approximately <strong>2,500–3,000 words</strong> and 40 questions — all to be completed in 60 minutes. That averages to 90 seconds per question, including reading time.</p>

<blockquote>
  <p>Candidates who read every word of every passage in sequence will run out of time. The solution is not to read faster — it is to read <strong>differently</strong> depending on what information you need at each moment.</p>
</blockquote>

<h2>Time Budget: How to Split 60 Minutes</h2>
<table>
  <thead>
    <tr><th>Passage</th><th>Difficulty</th><th>Questions</th><th>Recommended Time</th></tr>
  </thead>
  <tbody>
    <tr><td>Passage 1</td><td>Easiest — factual, descriptive</td><td>13–14</td><td>17–18 minutes</td></tr>
    <tr><td>Passage 2</td><td>Medium — some opinion and inference</td><td>13–14</td><td>17–18 minutes</td></tr>
    <tr><td>Passage 3</td><td>Hardest — complex argument, dense language</td><td>13–14</td><td>22–25 minutes</td></tr>
  </tbody>
</table>

<h2>Technique 1: Skimming — Building the Mental Map</h2>
<p>Skimming gives you a mental map of the passage before you look at questions. You do it once, at the start, and it pays dividends for all subsequent scanning.</p>

<img src="https://placehold.co/900x260/1e40af/ffffff?text=Skimming+Sequence%3A+Title+%E2%86%92+Subheadings+%E2%86%92+First+Sentences+%E2%86%92+Keywords" alt="Skimming Sequence" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<ol>
  <li>Read the <strong>title and any subheadings</strong> — 10 seconds</li>
  <li>Read the <strong>first sentence of every paragraph</strong> — 60–90 seconds</li>
  <li>Notice <strong>bold text, italicised terms, named entities</strong> — mark these in your mind</li>
  <li>Read the <strong>final paragraph</strong> in full — conclusions often contain key facts</li>
</ol>
<p>After 2–3 minutes of skimming, you should be able to answer: What is the main topic? How many distinct ideas are discussed? Where is numerical data located?</p>

<h2>Technique 2: Scanning — Targeted Retrieval</h2>
<p>Scanning is what you do after reading each question — you search for specific information rather than reading.</p>
<ul>
  <li>Identify the <strong>key words</strong> in the question — usually proper nouns, numbers, unusual vocabulary</li>
  <li>Move your eye down the passage rapidly, looking <em>only</em> for those words or their synonyms</li>
  <li>When you locate the section, <strong>stop scanning</strong> and read 2–3 sentences carefully</li>
  <li>Do not read surrounding context unless needed to confirm the answer type</li>
</ul>

<h2>Which Technique for Which Question Type?</h2>
<table>
  <thead>
    <tr><th>Question Type</th><th>Primary Technique</th><th>Key Approach</th></tr>
  </thead>
  <tbody>
    <tr><td>True / False / Not Given</td><td>Scan then read carefully</td><td>The passage must explicitly confirm or contradict — never assume</td></tr>
    <tr><td>Matching Headings</td><td>Skim each paragraph</td><td>Look for the <em>main idea</em> of the whole paragraph, not a supporting detail</td></tr>
    <tr><td>Multiple Choice</td><td>Scan to locate, read closely</td><td>Locate the section, then eliminate distractors one by one</td></tr>
    <tr><td>Summary / Note Completion</td><td>Scan to start point, read linearly</td><td>These usually follow passage order — find the start point and read forward</td></tr>
    <tr><td>Matching Information</td><td>Scan each paragraph</td><td>These are rarely in order — scan every paragraph for each concept</td></tr>
    <tr><td>Short Answer</td><td>Scan for key nouns, read carefully</td><td>Answer must come directly from the text — word limit strictly applies</td></tr>
  </tbody>
</table>

<h2>Common Mistakes to Avoid</h2>
<table>
  <thead>
    <tr><th>Mistake</th><th>Why It Happens</th><th>Fix</th></tr>
  </thead>
  <tbody>
    <tr><td>Subvocalising while scanning</td><td>Reading habit from school</td><td>Train yourself to move eyes without "saying" words internally — just search for shapes and patterns</td></tr>
    <tr><td>Re-reading whole passages</td><td>Anxiety and lack of trust in mental map</td><td>Trust your skim. Use targeted scanning, not re-reading from the top</td></tr>
    <tr><td>Spending too long on one question</td><td>Perfectionism or confusion</td><td>After 90 seconds, mark "?" and move on — return at the very end</td></tr>
    <tr><td>Equal time on all passages</td><td>Not accounting for difficulty gradient</td><td>Passage 3 needs 5–7 more minutes than Passages 1 and 2</td></tr>
  </tbody>
</table>

<blockquote>
  <p>These techniques take deliberate practice to internalise. Spend 10 minutes every day for two weeks skimming real articles and scanning for specific information — the improvement in your reading speed will be measurable.</p>
</blockquote>`,
  },
  {
    id: 'bp-10',
    title: 'IELTS Band Score Descriptors Explained',
    slug: 'ielts-band-score-descriptors-explained',
    category: 'General',
    tags: ['band descriptors', 'marking criteria', 'examiner', 'band 7'],
    author: 'James Harper',
    status: 'draft',
    publishedAt: null,
    updatedAt: '2026-04-15',
    coverImageUrl: 'https://placehold.co/1200x480/1c1917/ffffff?text=IELTS+Band+Score+Descriptors+Explained',
    excerpt: 'A detailed breakdown of what examiners look for at each band level across all four skills.',
    content: `<img src="https://placehold.co/1200x480/1c1917/ffffff?text=IELTS+Band+Score+Descriptors+Explained" alt="Band Descriptors" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<h2>What Are Band Descriptors?</h2>
<p>IELTS uses a <strong>9-band scale</strong> to report results, with each band representing a level of English language proficiency. For Writing and Speaking, examiners apply detailed <em>public band descriptors</em> to assign scores. Understanding what separates Band 6 from Band 7 is one of the most efficient ways to improve — because it tells you precisely what you need to demonstrate.</p>

<h2>The 9-Band Scale Overview</h2>
<table>
  <thead>
    <tr><th>Band</th><th>Label</th><th>Description</th><th>Typical Requirement</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>9</strong></td><td>Expert User</td><td>Full operational command. Appropriate, accurate, fluent, with complete understanding.</td><td>Elite academic programs, C2 English</td></tr>
    <tr><td><strong>8</strong></td><td>Very Good User</td><td>Fully operational command with only occasional, unsystematic inaccuracies.</td><td>Oxbridge, Ivy League, law and medicine</td></tr>
    <tr><td><strong>7</strong></td><td>Good User</td><td>Operational command with occasional inaccuracies. Handles complex language well.</td><td>Competitive postgraduate programs</td></tr>
    <tr><td><strong>6</strong></td><td>Competent User</td><td>Generally effective command despite some inaccuracies. Understands fairly complex language.</td><td>Most undergraduate programs</td></tr>
    <tr><td><strong>5</strong></td><td>Modest User</td><td>Partial command. Copes with overall meaning in most situations; makes many mistakes.</td><td>Foundation / pathway programs</td></tr>
    <tr><td><strong>4</strong></td><td>Limited User</td><td>Basic competence limited to familiar situations.</td><td>Pre-sessional English courses</td></tr>
    <tr><td><strong>3</strong></td><td>Extremely Limited</td><td>Conveys and understands only general meaning in very familiar situations.</td><td>—</td></tr>
  </tbody>
</table>

<h2>Writing Task 2: The Band 6 vs Band 7 Boundary</h2>
<p>This is the most critical boundary for the majority of IELTS candidates. Here is exactly what distinguishes Band 6 from Band 7 across each criterion:</p>

<img src="https://placehold.co/900x280/1e3a5f/ffffff?text=Writing+Descriptors%3A+Band+6+vs+Band+7" alt="Writing Descriptors" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<table>
  <thead>
    <tr><th>Criterion</th><th>Band 6</th><th>Band 7</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Task Achievement</strong></td><td>Addresses task; ideas relevant but may not be sufficiently developed; some repetition</td><td>Covers all requirements; ideas extended and well-supported; clear progression throughout</td></tr>
    <tr><td><strong>Coherence &amp; Cohesion</strong></td><td>Generally well-organised; cohesive devices used but with some inaccuracy or over-use; paragraphing not always logical</td><td>Well-organised with clear overall progression; variety of cohesive devices used flexibly; paragraphing logical</td></tr>
    <tr><td><strong>Lexical Resource</strong></td><td>Adequate range; attempts less common vocabulary with some errors; generally successful paraphrasing</td><td>Sufficient range for flexibility and precision; less common vocabulary with style awareness; effective paraphrasing</td></tr>
    <tr><td><strong>Grammatical Range &amp; Accuracy</strong></td><td>Mix of simple and complex sentences; errors present but rarely cause comprehension difficulties</td><td>Variety of complex structures; frequent error-free sentences; good control with few errors, rarely distorting meaning</td></tr>
  </tbody>
</table>

<h2>Speaking: The Band 6 vs Band 7 Boundary</h2>
<table>
  <thead>
    <tr><th>Criterion</th><th>Band 6</th><th>Band 7</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Fluency &amp; Coherence</strong></td><td>Maintains flow but may lose coherence occasionally; uses some connectives but not always accurately</td><td>Speaks at length without noticeable effort; uses a range of discourse markers with flexibility</td></tr>
    <tr><td><strong>Lexical Resource</strong></td><td>Generally effective; some use of less common vocabulary; some inappropriate choices and errors</td><td>Uses vocabulary with flexibility and precision; less common vocabulary used with some awareness of collocation</td></tr>
    <tr><td><strong>Grammatical Range &amp; Accuracy</strong></td><td>Mix of simple and complex structures with some errors; generally does not impede communication</td><td>Variety of complex structures; good control with few errors; errors rarely reduce communication</td></tr>
    <tr><td><strong>Pronunciation</strong></td><td>Range of features with mixed control; some mispronunciations that occasionally cause difficulty</td><td>All Band 6 features with greater consistency; mispronunciations rare with minimal impact on understanding</td></tr>
  </tbody>
</table>

<h2>How to Use Descriptors as a Self-Assessment Tool</h2>

<img src="https://placehold.co/900x240/155e35/ffffff?text=Descriptor-Led+Self-Assessment+Process" alt="Self Assessment" data-width="100%" data-align="center" style="width: 100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" />

<ol>
  <li>Complete a Writing essay or record a full Speaking session.</li>
  <li>Open the public band descriptors (freely available on British Council and IDP websites).</li>
  <li>Read each criterion for your target band.</li>
  <li>Assess your work against each criterion and assign a provisional score.</li>
  <li>Identify the criterion with the lowest score — that is your highest-impact improvement target for the next practice session.</li>
</ol>

<blockquote>
  <p>This descriptor-led self-assessment approach is what separates candidates who improve systematically from those who practise without direction and plateau at the same band.</p>
</blockquote>

<h2>Quick Reference: What Examiners Listen and Look For</h2>
<table>
  <thead>
    <tr><th>Examiner Is Looking For</th><th>Band 6 Shows</th><th>Band 7+ Shows</th></tr>
  </thead>
  <tbody>
    <tr><td>Vocabulary range</td><td>Correct common words, attempts uncommon ones</td><td>Precise uncommon words used naturally with collocation</td></tr>
    <tr><td>Sentence variety</td><td>Some complex sentences mixed with simple ones</td><td>Consistent variety — relatives, conditionals, passives — used accurately</td></tr>
    <tr><td>Organisation</td><td>Clear structure, some weak transitions</td><td>Logical flow, varied cohesive devices, clear paragraph purpose</td></tr>
    <tr><td>Content development</td><td>Main points made but not always extended</td><td>Every point explained, exemplified, and linked back</td></tr>
  </tbody>
</table>`,
  },
]
