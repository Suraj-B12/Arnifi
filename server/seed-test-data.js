import prisma from './src/lib/prisma.js';
import bcrypt from 'bcrypt';

const HASHED_PASSWORD = await bcrypt.hash('password123', 10);

// ── Helpers ──────────────────────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── 1. Test Users ────────────────────────────────────────────────────────────
const usersData = [
  {
    email: 'user1@test.com',
    name: 'Sarah Chen',
    headline: 'Full Stack Developer | React & Node.js',
    skills: 'JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker',
    phone: '+1-415-555-0101',
    bio: 'Passionate full-stack developer with 5 years of experience building scalable web applications. Love open-source and mentoring junior developers.',
    experience: 'Senior Developer at Stripe (2022-present)\nFull Stack Engineer at Shopify (2019-2022)\nJunior Developer at Accenture (2017-2019)',
    education: 'B.S. Computer Science, Stanford University (2017)',
    linkedIn: 'https://linkedin.com/in/sarahchen',
  },
  {
    email: 'user2@test.com',
    name: 'James Wilson',
    headline: 'DevOps Engineer | AWS & Kubernetes',
    skills: 'AWS, Kubernetes, Terraform, CI/CD, Python, Bash, Ansible, Prometheus',
    phone: '+1-212-555-0202',
    bio: 'Infrastructure specialist focused on cloud-native architectures. Certified AWS Solutions Architect and Kubernetes Administrator.',
    experience: 'Lead DevOps Engineer at Netflix (2021-present)\nSRE at Google Cloud (2018-2021)\nSystems Engineer at IBM (2016-2018)',
    education: 'M.S. Computer Engineering, MIT (2016)',
    linkedIn: 'https://linkedin.com/in/jameswilson',
  },
  {
    email: 'user3@test.com',
    name: 'Priya Sharma',
    headline: 'Product Designer | UX/UI Specialist',
    skills: 'Figma, Sketch, Adobe XD, User Research, Prototyping, Design Systems, HTML/CSS',
    phone: '+1-650-555-0303',
    bio: 'Design thinker who bridges the gap between user needs and business goals. 7 years of experience crafting delightful digital experiences.',
    experience: 'Senior Product Designer at Airbnb (2021-present)\nUX Designer at Spotify (2018-2021)\nUI Designer at Adobe (2016-2018)',
    education: 'B.F.A. Interaction Design, RISD (2016)\nHCI Certificate, Carnegie Mellon (2018)',
    linkedIn: 'https://linkedin.com/in/priyasharma',
  },
  {
    email: 'user4@test.com',
    name: 'Marcus Johnson',
    headline: 'Data Scientist | Machine Learning Engineer',
    skills: 'Python, TensorFlow, PyTorch, SQL, Spark, R, Tableau, MLOps',
    phone: '+1-310-555-0404',
    bio: 'Data scientist specializing in NLP and recommendation systems. Published researcher with a passion for turning data into actionable insights.',
    experience: 'ML Engineer at OpenAI (2022-present)\nData Scientist at Meta (2019-2022)\nAnalytics Engineer at Palantir (2017-2019)',
    education: 'Ph.D. Statistics, UC Berkeley (2017)\nB.S. Mathematics, UCLA (2013)',
    linkedIn: 'https://linkedin.com/in/marcusjohnson',
  },
  {
    email: 'user5@test.com',
    name: 'Emily Rodriguez',
    headline: 'Mobile Developer | iOS & Android',
    skills: 'Swift, Kotlin, React Native, Flutter, Firebase, GraphQL, REST APIs',
    phone: '+1-512-555-0505',
    bio: 'Mobile-first engineer who has shipped apps with 10M+ downloads. Advocate for accessible and performant mobile experiences.',
    experience: 'Senior Mobile Engineer at Uber (2021-present)\nMobile Developer at Twitter (2019-2021)\niOS Developer at Lyft (2017-2019)',
    education: 'B.S. Software Engineering, UT Austin (2017)',
    linkedIn: 'https://linkedin.com/in/emilyrodriguez',
  },
];

console.log('Creating test users...');
const users = [];
for (const u of usersData) {
  const user = await prisma.user.upsert({
    where: { email: u.email },
    update: { ...u, password: HASHED_PASSWORD },
    create: { ...u, password: HASHED_PASSWORD, role: 'USER' },
  });
  users.push(user);
  console.log(`  + User: ${user.name} (${user.email})`);
}

// ── 2. Companies ─────────────────────────────────────────────────────────────
const companiesData = [
  {
    name: 'TechVenture Labs',
    logo: 'https://ui-avatars.com/api/?name=TechVenture+Labs&background=6366f1&color=fff&size=128',
    about: 'TechVenture Labs is a cutting-edge technology incubator and software company building the next generation of AI-powered enterprise tools. We partner with startups and Fortune 500 companies alike.',
    website: 'https://techventurelabs.com',
    industry: 'Technology / AI',
    size: '50-200 employees',
    location: 'San Francisco, CA',
  },
  {
    name: 'CloudScale Solutions',
    logo: 'https://ui-avatars.com/api/?name=CloudScale+Solutions&background=0891b2&color=fff&size=128',
    about: 'CloudScale Solutions provides enterprise-grade cloud infrastructure and managed services. Trusted by 500+ companies to keep their applications running at scale.',
    website: 'https://cloudscale.io',
    industry: 'Cloud Infrastructure',
    size: '200-500 employees',
    location: 'Austin, TX',
  },
];

console.log('\nCreating companies...');
const companies = [];
for (const c of companiesData) {
  const company = await prisma.company.upsert({
    where: { name: c.name },
    update: c,
    create: c,
  });
  companies.push(company);
  console.log(`  + Company: ${company.name}`);
}

// ── 3. Admin user lookup ─────────────────────────────────────────────────────
const admin = await prisma.user.findUnique({ where: { email: 'testadmin@arnifi.com' } });
if (!admin) {
  console.error('\nERROR: Admin user testadmin@arnifi.com not found. Please create it first.');
  await prisma.$disconnect();
  process.exit(1);
}
console.log(`\nUsing admin: ${admin.name} (${admin.email})`);

// ── 4. Jobs ──────────────────────────────────────────────────────────────────
const jobsData = [
  {
    companyName: 'TechVenture Labs',
    position: 'Senior React Developer',
    type: 'FULL_TIME',
    location: 'San Francisco, CA',
    description: 'Join our product team to build next-gen AI dashboards using React, TypeScript, and D3.js. You will lead frontend architecture decisions and mentor junior developers.',
    salary: '$150,000 - $190,000',
    requirements: '5+ years React experience, TypeScript proficiency, experience with data visualization libraries, strong CS fundamentals',
    interviewProcess: '1. Phone screen (30 min) 2. Technical assessment (take-home) 3. Virtual onsite (4 hours) 4. Team fit chat',
    benefits: 'Health/dental/vision insurance, 401k match, unlimited PTO, $5k learning budget, stock options',
    companyId: companies[0].id,
    viewCount: 342,
    createdAt: daysAgo(2),
  },
  {
    companyName: 'CloudScale Solutions',
    position: 'DevOps Engineer',
    type: 'FULL_TIME',
    location: 'Austin, TX',
    description: 'Design, build, and maintain our cloud infrastructure on AWS. Implement CI/CD pipelines and ensure 99.99% uptime for our customers.',
    salary: '$140,000 - $175,000',
    requirements: 'AWS certifications preferred, Kubernetes expertise, Terraform experience, strong Linux skills, on-call rotation participation',
    interviewProcess: '1. Recruiter call 2. Technical screen with hiring manager 3. System design interview 4. Final round with VP of Engineering',
    benefits: 'Competitive salary, equity, remote-friendly, annual conference budget, gym membership',
    companyId: companies[1].id,
    viewCount: 218,
    createdAt: daysAgo(5),
  },
  {
    companyName: 'TechVenture Labs',
    position: 'Product Design Intern',
    type: 'INTERNSHIP',
    location: 'San Francisco, CA (Hybrid)',
    description: 'Summer internship for aspiring product designers. Work alongside senior designers on real products that ship to thousands of users.',
    salary: '$35/hour',
    requirements: 'Currently enrolled in design program, Figma proficiency, portfolio required, strong communication skills',
    interviewProcess: '1. Portfolio review 2. Design challenge (2 hours) 3. Team interview',
    benefits: 'Paid internship, mentorship program, housing stipend, networking events',
    companyId: companies[0].id,
    viewCount: 487,
    createdAt: daysAgo(8),
  },
  {
    companyName: 'Freelance Network',
    position: 'Contract Python Developer',
    type: 'CONTRACT',
    location: 'Remote',
    description: 'We need an experienced Python developer for a 6-month contract to build data pipelines and ETL workflows for our analytics platform.',
    salary: '$95 - $120/hour',
    requirements: 'Strong Python (3.10+), experience with Airflow or Prefect, SQL expertise, familiarity with dbt',
    interviewProcess: '1. Technical screen 2. Pair programming session 3. Contract negotiation',
    benefits: 'Flexible hours, fully remote, potential for extension',
    viewCount: 156,
    createdAt: daysAgo(3),
  },
  {
    companyName: 'CloudScale Solutions',
    position: 'Part-Time Technical Writer',
    type: 'PART_TIME',
    location: 'Remote',
    description: 'Create and maintain technical documentation, API guides, and tutorials for our cloud platform. 20 hours per week.',
    salary: '$50 - $65/hour',
    requirements: 'Excellent writing skills, ability to explain complex technical concepts clearly, experience with developer documentation, Markdown/MDX',
    interviewProcess: '1. Writing sample review 2. Interview with docs team lead 3. Trial assignment',
    benefits: 'Flexible schedule, remote work, access to all company learning resources',
    companyId: companies[1].id,
    viewCount: 89,
    createdAt: daysAgo(12),
  },
  {
    companyName: 'TechVenture Labs',
    position: 'Remote Machine Learning Engineer',
    type: 'REMOTE',
    location: 'Anywhere (US timezone preferred)',
    description: 'Build and deploy ML models for our AI-powered recommendation engine. Work with petabytes of data and cutting-edge transformer architectures.',
    salary: '$170,000 - $220,000',
    requirements: 'M.S. or Ph.D. in CS/ML, production ML experience, PyTorch proficiency, experience with large-scale distributed training',
    interviewProcess: '1. Phone screen 2. ML system design 3. Coding interview 4. Research presentation 5. Team match',
    benefits: 'Top-of-market comp, full remote, $10k home office budget, conference travel, publication support',
    companyId: companies[0].id,
    viewCount: 412,
    createdAt: daysAgo(1),
  },
  {
    companyName: 'GreenTech Innovations',
    position: 'Hybrid Full Stack Engineer',
    type: 'HYBRID',
    location: 'New York, NY (3 days in office)',
    description: 'Build sustainability tracking tools for enterprise customers. Full stack role using Next.js, Node.js, and PostgreSQL.',
    salary: '$130,000 - $160,000',
    requirements: 'Full stack web development experience, Next.js/React, Node.js, PostgreSQL, passion for sustainability',
    interviewProcess: '1. Intro call 2. Take-home project 3. Onsite interview day 4. Offer',
    benefits: 'Hybrid flexibility, sustainability mission, health benefits, commuter benefits, team retreats',
    viewCount: 195,
    createdAt: daysAgo(7),
  },
  {
    companyName: 'DataStream Analytics',
    position: 'Senior Data Analyst',
    type: 'FULL_TIME',
    location: 'Chicago, IL',
    description: 'Lead our business intelligence team. Build dashboards, run A/B tests, and derive insights that drive product decisions across the organization.',
    salary: '$120,000 - $145,000',
    requirements: 'SQL mastery, Python/R, Tableau or Looker, A/B testing methodology, stakeholder management skills',
    interviewProcess: '1. Phone screen 2. SQL assessment 3. Case study presentation 4. Leadership interview',
    benefits: 'Health insurance, 401k with 6% match, annual bonus, flexible PTO, professional development',
    viewCount: 267,
    createdAt: daysAgo(15),
  },
  {
    companyName: 'CloudScale Solutions',
    position: 'Security Engineer (Remote)',
    type: 'REMOTE',
    location: 'Remote (US)',
    description: 'Protect our cloud infrastructure and customer data. Conduct security audits, implement zero-trust architecture, and lead incident response.',
    salary: '$155,000 - $195,000',
    requirements: 'CISSP or equivalent, cloud security experience (AWS/GCP), penetration testing, security automation, incident response',
    interviewProcess: '1. Security knowledge screen 2. Threat modeling exercise 3. Technical deep dive 4. CISO interview',
    benefits: 'Competitive pay, full remote, security conference budget, on-call compensation, equity',
    companyId: companies[1].id,
    viewCount: 178,
    createdAt: daysAgo(10),
  },
  {
    companyName: 'TechVenture Labs',
    position: 'QA Engineer (Contract)',
    type: 'CONTRACT',
    location: 'San Francisco, CA',
    description: '3-month contract to establish automated testing practices. Write E2E tests with Playwright, set up CI testing pipelines, and document QA processes.',
    salary: '$80 - $100/hour',
    requirements: 'Test automation experience, Playwright or Cypress, CI/CD pipelines, API testing, strong attention to detail',
    interviewProcess: '1. Phone screen 2. Testing exercise 3. Hiring manager interview',
    benefits: 'Competitive contract rate, potential conversion to full-time, great team culture',
    companyId: companies[0].id,
    viewCount: 102,
    createdAt: daysAgo(20),
  },
  {
    companyName: 'MedTech Partners',
    position: 'iOS Developer (Part-Time)',
    type: 'PART_TIME',
    location: 'Boston, MA (Hybrid)',
    description: 'Build and maintain our patient-facing iOS application. 25 hours per week with flexible scheduling. HIPAA compliance experience is a plus.',
    salary: '$70 - $90/hour',
    requirements: 'Swift expertise, UIKit and SwiftUI, healthcare app experience preferred, HIPAA awareness, App Store submission experience',
    interviewProcess: '1. Technical phone screen 2. Take-home coding challenge 3. Team interview',
    benefits: 'Flexible schedule, meaningful healthcare impact, professional growth',
    viewCount: 64,
    createdAt: daysAgo(18),
  },
  {
    companyName: 'NexGen Robotics',
    position: 'Embedded Systems Intern',
    type: 'INTERNSHIP',
    location: 'Seattle, WA',
    description: 'Join our robotics team for a 12-week paid internship. Work on real-time control systems, sensor integration, and firmware development.',
    salary: '$40/hour',
    requirements: 'Pursuing CS/EE degree, C/C++ proficiency, microcontroller experience, enthusiasm for robotics',
    interviewProcess: '1. Resume review 2. Technical quiz 3. Interview with lead engineer',
    benefits: 'Paid internship, relocation assistance, mentorship, potential return offer',
    viewCount: 321,
    createdAt: daysAgo(25),
  },
];

console.log('\nCreating jobs...');
const jobs = [];
for (const j of jobsData) {
  // Use position + companyName as a unique-ish key for idempotency
  const existing = await prisma.job.findFirst({
    where: { position: j.position, companyName: j.companyName, postedById: admin.id },
  });
  if (existing) {
    await prisma.job.update({ where: { id: existing.id }, data: { ...j, postedById: admin.id } });
    jobs.push(existing);
    console.log(`  ~ Updated: ${j.position} at ${j.companyName}`);
  } else {
    const job = await prisma.job.create({ data: { ...j, postedById: admin.id } });
    jobs.push(job);
    console.log(`  + Created: ${j.position} at ${j.companyName}`);
  }
}

// ── 5. Applications ──────────────────────────────────────────────────────────
const statuses = ['PENDING', 'REVIEWED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

const applicationPlan = [
  // user index, job index, status, daysAgo, statusNote, adminNotes
  [0, 0, 'INTERVIEW', 1, 'Scheduled for technical round on Friday', 'Strong React skills, good culture fit'],
  [0, 5, 'PENDING', 2, null, null],
  [0, 7, 'REVIEWED', 5, 'Resume looks promising', 'Meets all requirements'],
  [0, 3, 'OFFER', 8, 'Offer extended at $110/hr', 'Top candidate, fast-track'],
  [0, 9, 'REJECTED', 12, 'Position filled', 'Good candidate but timing was off'],
  [0, 11, 'PENDING', 3, null, null],

  [1, 1, 'INTERVIEW', 2, 'Panel interview next Tuesday', 'AWS certified, strong background'],
  [1, 8, 'OFFER', 6, 'Offer at $180k, awaiting response', 'Excellent security background'],
  [1, 0, 'REVIEWED', 10, 'Reviewing portfolio', null],
  [1, 5, 'PENDING', 1, null, null],
  [1, 4, 'WITHDRAWN', 14, 'Accepted another role', null],
  [1, 7, 'REJECTED', 20, 'Not enough analytics experience', 'Better fit for DevOps roles'],

  [2, 2, 'INTERVIEW', 3, 'Design challenge completed, moving to team interview', 'Exceptional portfolio'],
  [2, 6, 'PENDING', 4, null, null],
  [2, 4, 'REVIEWED', 9, 'Writing samples under review', 'Good design eye for docs'],
  [2, 0, 'OFFER', 7, 'Offer extended for senior designer role', 'Overqualified for dev but great for design system work'],
  [2, 7, 'PENDING', 2, null, null],
  [2, 9, 'REJECTED', 15, 'Looking for more QA-specific experience', null],

  [3, 5, 'INTERVIEW', 1, 'Research presentation scheduled', 'PhD in ML, published papers in NLP'],
  [3, 7, 'OFFER', 4, 'Offer at $140k, negotiating', 'Perfect fit for data team lead'],
  [3, 3, 'REVIEWED', 6, 'Reviewing Python assessment', 'Strong data engineering skills'],
  [3, 0, 'PENDING', 3, null, null],
  [3, 8, 'PENDING', 5, null, null],
  [3, 11, 'WITHDRAWN', 18, 'Decided to stay at current role', null],

  [4, 10, 'INTERVIEW', 2, 'Coding challenge submitted, team interview pending', 'Excellent Swift skills'],
  [4, 0, 'REVIEWED', 8, 'Strong mobile perspective for web role', 'React Native experience relevant'],
  [4, 6, 'PENDING', 1, null, null],
  [4, 2, 'REJECTED', 11, 'Looking for candidates currently in design programs', null],
  [4, 5, 'PENDING', 6, null, null],
  [4, 1, 'WITHDRAWN', 22, 'Relocated out of Austin', null],
  [4, 9, 'INTERVIEW', 3, 'Playwright experience is exactly what we need', 'Mobile testing background is a bonus'],
];

console.log('\nCreating applications...');
let appCount = 0;
for (const [ui, ji, status, ago, statusNote, adminNotes] of applicationPlan) {
  const userId = users[ui].id;
  const jobId = jobs[ji].id;
  const createdAt = daysAgo(ago);

  const data = {
    status,
    statusNote,
    adminNotes,
    createdAt,
    reviewedAt: status !== 'PENDING' ? daysAgo(Math.max(0, ago - 1)) : null,
    withdrawnAt: status === 'WITHDRAWN' ? daysAgo(Math.max(0, ago - 1)) : null,
  };

  await prisma.application.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: data,
    create: { userId, jobId, ...data },
  });
  appCount++;
  console.log(`  + ${users[ui].name} -> ${jobs[ji].position} [${status}]`);
}

// ── 6. Summary ───────────────────────────────────────────────────────────────
const totalUsers = await prisma.user.count();
const totalCompanies = await prisma.company.count();
const totalJobs = await prisma.job.count();
const totalApps = await prisma.application.count();

console.log('\n========================================');
console.log('  Seed Summary');
console.log('========================================');
console.log(`  Users created/updated:        ${users.length}`);
console.log(`  Companies created/updated:    ${companies.length}`);
console.log(`  Jobs created/updated:         ${jobs.length}`);
console.log(`  Applications created/updated: ${appCount}`);
console.log('----------------------------------------');
console.log(`  Total users in DB:            ${totalUsers}`);
console.log(`  Total companies in DB:        ${totalCompanies}`);
console.log(`  Total jobs in DB:             ${totalJobs}`);
console.log(`  Total applications in DB:     ${totalApps}`);
console.log('========================================');

await prisma.$disconnect();
console.log('\nDone! Database seeded successfully.');
