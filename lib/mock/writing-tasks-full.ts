import type { FullWritingTask } from '@/lib/types/ielts'

export const mockFullWritingTasks: FullWritingTask[] = [
  {
    id: 'wt-1',
    title: 'Task 1 — Bar Chart: Internet Usage',
    type: 'task1',
    prompt: `The bar chart below shows the percentage of households in five countries that had access to the internet in 2005, 2010, and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
    wordMinimum: 150,
    timeMinutes: 20,
    status: 'published',
    createdAt: '2025-08-20',
    imageUrl: '/images/writing/wt-1-chart.png',
    sampleAnswer: `The bar chart illustrates the proportion of households with internet access in five countries — the UK, Germany, South Korea, Brazil, and India — at three points in time: 2005, 2010, and 2020.

Overall, internet access increased substantially in all five countries over the 15-year period. While the UK, Germany, and South Korea were already highly connected by 2005, Brazil and India began from much lower bases but showed significant growth, particularly between 2010 and 2020.

In 2005, South Korea had the highest household internet penetration at approximately 70%, closely followed by the UK at 65% and Germany at 60%. By 2020, all three had reached or exceeded 90%, with South Korea leading at around 95%.

Brazil and India showed more dramatic increases from lower starting points. Brazil's household internet access rose from roughly 15% in 2005 to approximately 30% in 2010 and surged to nearly 75% by 2020. India recorded the lowest figures throughout, starting at around 5% in 2005 and reaching approximately 45% in 2020 — a ninefold increase, though still the lowest among the five countries.

In summary, the data reveals a clear convergence in internet access rates, with developing economies closing the gap with more developed nations, though significant disparities remained in 2020.`,
  },
  {
    id: 'wt-2',
    title: 'Task 1 — Line Graph: Global Temperature',
    type: 'task1',
    prompt: `The line graph below shows changes in average global surface temperature relative to the 1951–1980 average, from 1880 to 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
    wordMinimum: 150,
    timeMinutes: 20,
    status: 'published',
    createdAt: '2025-08-25',
    imageUrl: '/images/writing/wt-2-chart.png',
    sampleAnswer: `The line graph depicts fluctuations in average global surface temperature from 1880 to 2020, expressed as deviations from the 1951–1980 average baseline.

Overall, the data reveals a clear long-term warming trend, particularly pronounced from the mid-20th century onwards, interspersed with short-term fluctuations and a notable period of cooling in the mid-20th century.

Between 1880 and 1940, global temperatures fluctuated around the baseline but showed a gradual upward trend, peaking at approximately +0.2°C around 1940. A period of relative cooling followed between roughly 1945 and 1970, with temperatures dropping to approximately -0.1°C.

From approximately 1975, temperatures began rising sharply and consistently. By 2000, global temperatures had exceeded the baseline by around +0.4°C, and by 2020, the anomaly had reached approximately +1.0°C above the reference period — representing a warming of over one degree in just 45 years.

The most striking feature of the graph is the accelerating rate of warming in recent decades. The period from 2000 to 2020 shows the steepest and most sustained increase in the entire dataset, highlighting the intensification of global warming in the 21st century.`,
  },
  {
    id: 'wt-3',
    title: 'Task 2 — Education: Technology in Classrooms',
    type: 'task2',
    prompt: `Some people believe that technology, such as tablets and laptops, should be used extensively in school classrooms. Others argue that traditional teaching methods are more effective.

Discuss both views and give your own opinion.`,
    wordMinimum: 250,
    timeMinutes: 40,
    status: 'published',
    createdAt: '2025-09-01',
    sampleAnswer: `The integration of digital technology into educational settings has generated considerable debate among educators, parents, and policymakers. Proponents argue that devices such as tablets and laptops enhance engagement and prepare students for the modern workforce, while sceptics maintain that traditional, teacher-led instruction produces deeper and more durable learning. In my view, a balanced approach that combines both methods is most effective.

Advocates of technology in the classroom point to several compelling benefits. Digital devices give students immediate access to vast amounts of information, enabling self-directed learning and exploration beyond the confines of textbooks. Interactive software and multimedia content can make abstract concepts more tangible and accommodate different learning styles. Furthermore, familiarity with digital tools is increasingly essential in virtually every professional field, making early exposure a practical necessity.

However, the case for traditional teaching methods should not be dismissed. Face-to-face instruction fosters the social and communicative skills that technology cannot replicate. Students develop the capacity to listen carefully, articulate ideas verbally, and engage in collaborative problem-solving through structured classroom discussion. Research also suggests that handwriting notes leads to better retention of information compared to typing, as it encourages students to process and synthesise material rather than transcribing it verbatim. Moreover, excessive screen time has been linked to reduced attention spans and disrupted sleep patterns among young people.

In conclusion, rather than viewing technology and traditional methods as mutually exclusive, schools should integrate both thoughtfully. Technology should complement skilled teaching, not replace it. When used purposefully and in moderation, digital tools can enrich the learning experience while preserving the irreplaceable benefits of human interaction and guidance.`,
  },
  {
    id: 'wt-4',
    title: 'Task 2 — Society: Government Spending Priorities',
    type: 'task2',
    prompt: `In many countries, governments spend large amounts of money on arts and culture, such as museums, galleries, and theatres. Some people think this money would be better spent on other public services.

To what extent do you agree or disagree?`,
    wordMinimum: 250,
    timeMinutes: 40,
    status: 'published',
    createdAt: '2025-09-15',
    sampleAnswer: `The question of whether government funding for arts and culture represents an appropriate use of public money is a contentious one. While I acknowledge that certain public services arguably have greater urgency, I largely disagree with the view that arts funding should be reduced, as it delivers benefits that extend well beyond mere entertainment.

Those who argue against public arts spending typically point to more pressing needs. Healthcare systems in many countries are underfunded, with long waiting lists and ageing infrastructure. Public transport networks require substantial investment to reduce congestion and carbon emissions. Spending limited tax revenue on opera houses or contemporary art exhibitions, the argument goes, is a luxury that cannot be justified when basic services are struggling.

However, this framing overlooks the multiple functions of arts and cultural institutions. Museums and galleries preserve collective memory and cultural identity, providing citizens with a sense of shared history that underpins social cohesion. Access to the arts has also been linked to measurable improvements in mental well-being, a factor with direct implications for the healthcare costs governments are trying to contain. Economically, cultural institutions attract tourism, stimulate urban regeneration, and support creative industries that generate significant employment and export earnings.

Furthermore, restricting arts funding risks deepening inequality. When governments withdraw public subsidy, cultural institutions become dependent on wealthy private patrons or high ticket prices, effectively excluding lower-income citizens from cultural life.

In conclusion, while governments must prioritise essential services, cutting arts funding is a false economy. A thriving cultural sector is not a luxury — it is an investment in social well-being, identity, and economic vitality.`,
  },
  {
    id: 'wt-5',
    title: 'Task 2 — Environment: Individual vs Government Responsibility',
    type: 'task2',
    prompt: `Some people think that environmental problems such as pollution and climate change are best addressed by governments and large organisations. Others believe that individual action is the most important factor.

Discuss both views and give your own opinion.`,
    wordMinimum: 250,
    timeMinutes: 40,
    status: 'draft',
    createdAt: '2025-10-20',
    sampleAnswer: `Environmental degradation poses one of the gravest challenges of our time, and debate continues over whether the primary responsibility for addressing it lies with governments and corporations, or with individual citizens making conscious lifestyle choices. In my opinion, while individual action has a valuable role, structural change driven by governments and large organisations is indispensable.

Proponents of individual responsibility argue that collective behaviour change can have a substantial cumulative effect. Decisions about diet, travel, energy use, and consumption patterns aggregate across millions of households to produce significant emissions reductions. Moreover, consumer choices send market signals that incentivise businesses to develop greener products and services. Individual action also carries a moral dimension — living in accordance with one's environmental values promotes a culture of responsibility that can influence others.

Nevertheless, the scale and urgency of environmental challenges arguably exceeds what voluntary individual action alone can deliver. Climate change and pollution are driven primarily by industrial processes, energy systems, and infrastructure that lie beyond the direct control of private citizens. Governments possess unique tools — legislation, taxation, international treaties, and public investment — that can reshape these systems at scale. Carbon pricing mechanisms, renewable energy mandates, and efficiency standards for vehicles and buildings can achieve emissions reductions that individual lifestyle choices cannot match.

Relying predominantly on individual responsibility also carries a risk of disproportionately burdening those with fewer choices. People on lower incomes cannot always afford electric vehicles or sustainably sourced food, making personal virtue an inadequate substitute for structural reform.

In conclusion, individual and governmental action are complementary rather than competing. However, solving environmental problems at the required scale and pace demands leadership from governments and institutions, with individuals playing a supportive rather than primary role.`,
  },
  {
    id: 'wt-6',
    title: 'Task 1 — Process Diagram: Water Treatment',
    type: 'task1',
    prompt: `The diagram below shows the process of treating drinking water in an urban water treatment plant.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
    wordMinimum: 150,
    timeMinutes: 20,
    status: 'draft',
    createdAt: '2025-11-05',
    imageUrl: '/images/writing/wt-6-diagram.png',
    sampleAnswer: `The diagram illustrates the sequential stages by which raw water is converted into safe drinking water at an urban treatment facility.

Overall, the process involves six distinct stages, beginning with the collection of raw water and ending with the distribution of treated water to consumers. Each stage progressively removes contaminants and improves water quality.

In the first stage, raw water is extracted from a river or reservoir by intake pumps and channelled into a screening chamber, where large debris such as leaves, branches, and fish are filtered out by metal screens. The screened water then enters a coagulation tank, where chemicals — typically aluminium sulphate — are added to cause suspended particles to clump together into larger masses called floc.

This floc subsequently settles to the bottom of a sedimentation tank in the third stage, leaving clearer water above. The water then passes through a filtration stage, moving through beds of sand and gravel that remove remaining fine particles, bacteria, and some dissolved contaminants.

In the fifth stage, chlorine or ozone is added to disinfect the water, killing any remaining pathogens. Finally, the treated water is stored in a covered reservoir before being pumped through the distribution network to homes, businesses, and public facilities.

In summary, the treatment process is a systematic progression from raw, potentially contaminated water to clean, safe drinking water through mechanical, chemical, and biological treatment methods.`,
  },
]
