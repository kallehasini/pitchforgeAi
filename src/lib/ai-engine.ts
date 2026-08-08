import type {
  Audience,
  AudienceOptimization,
  ElevatorPitch,
  ExtractedAnalysis,
  HealthScores,
  InvestorQA,
  PresenterNote,
  Slide,
} from '@/types';
import { uid } from '@/lib/utils';

/**
 * PitchForge AI Engine
 *
 * A deterministic, client-side analysis engine that reads raw documentation
 * text and produces a structured startup analysis, audience-optimized pitch
 * decks, health scores, investor Q&A, elevator pitches, and presenter notes.
 *
 * In production this would call Gemini/OpenAI; for the hackathon demo it runs
 * fully offline so the demo never depends on an API key being configured.
 */

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','can','this','that','these','those','i','you','he','she','it','we','they','what','which','who','when','where','why','how','all','each','every','both','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','also','as','if','then','there','here','about','into','through','during','before','after','above','below','up','down','out','off','over','under','again','further','once','your','our','their','its','my','me','him','her','them','us','am','any','because','while','against','between','within','without','across','along','among','around','behind','beside','beyond','upon','within','yet','still','even','now','get','got','use','used','using','like','via','per','etc','ie','eg','via','see','eg','ie','etc','one','two','three','four','five','six','seven','eight','nine','ten','zero','run','runs','running','using','use','used','able','also','make','makes','made','new','well','way','many','much','want','needs','need','based','build','built','building','code','app','application','project','readme','documentation','docs','file','files','install','installation','npm','yarn','pnpm','git','github','com','http','https','www','cli','api','json','html','css','js','ts','tsx','jsx','license','mit','apache','copyright','rights','reserved','package','version','dependencies','devdependencies','scripts','repository','author','contributors','keywords','description','name','type','module','function','class','const','let','var','return','import','export','default','true','false','null','undefined','void','typeof','instanceof','new','delete','typeof','void','else','switch','case','break','continue','throw','try','catch','finally','async','await','yield','static','public','private','protected','readonly','interface','enum','namespace','declare','abstract','implements','extends','super','this','constructor','get','set','in','of','as','from','with','some','every','find','filter','map','reduce','foreach','includes','indexof','push','pop','slice','splice','length','array','object','string','number','boolean','promise','error','date','math','console','log','warn','error','info','debug','window','document','global','process','env','path','fs','os','crypto','buffer','stream','event','listener','emit','on','off','once','remove','add','clear','has','size','keys','values','entries','next','done','value','key','data','result','response','request','headers','body','status','method','url','endpoint','route','router','server','client','port','host','localhost','config','options','settings','props','state','ref','context','hook','effect','memo','callback','component','render','mount','unmount','update','children','parent','child','sibling','element','dom','node','tree','root','leaf','branch','node','link','href','src','alt','title','class','style','id','name','value','checked','disabled','required','placeholder','label','button','input','form','select','option','textarea','div','span','p','h1','h2','h3','ul','li','ol','table','tr','td','th','thead','tbody','img','a','nav','header','footer','main','section','article','aside','figure','figcaption','video','audio','source','track','canvas','svg','path','circle','rect','g','defs','use','symbol','linear','radial','stop','animate','set','animate','discard','template','slot','portal','fragment','suspense','lazy','strict','profiler','memo','forward','default','create','element','factory','children','hydrate','unmount','render','flush','sync','passive','capture','once','bubble','target','current','related','key','code','altkey','ctrlkey','shiftkey','metakey','repeat','location','pressed','released','down','up','press','move','over','out','enter','leave','wheel','click','dblclick','mousedown','mouseup','mousemove','mouseover','mouseout','mouseenter','mouseleave','focus','blur','submit','reset','change','input','select','scroll','resize','load','unload','abort','error','load','unload','beforeunload','hashchange','popstate','storage','message','messageerror','open','close','connecting','connect','disconnect','retry','reconnect','ping','pong','send','receive','emit','on','off','once','remove','add','clear','has','size','keys','values','entries','next','done','value','key','data','result','response','request','headers','body','status','method','url','endpoint','route','router','server','client','port','host','localhost','config','options','settings','props','state','ref','context','hook','effect','memo','callback','component','render','mount','unmount','update','children','parent','child','sibling','element','dom','node','tree','root','leaf','branch','node','link','href','src','alt','title','class','style','id','name','value','checked','disabled','required','placeholder','label','button','input','form','select','option','textarea','div','span','p','h1','h2','h3','ul','li','ol','table','tr','td','th','thead','tbody','img','a','nav','header','footer','main','section','article','aside','figure','figcaption','video','audio','source','track','canvas','svg','path','circle','rect','g','defs','use','symbol','linear','radial','stop','animate','set','animate','discard','template','slot','portal','fragment','suspense','lazy','strict','profiler','memo','forward','default','create','element','factory','children','hydrate','unmount','render','flush','sync','passive','capture','once','bubble','target','current','related','key','code','altkey','ctrlkey','shiftkey','metakey','repeat','location','pressed','released','down','up','press','move','over','out','enter','leave','wheel','click','dblclick','mousedown','mouseup','mousemove','mouseover','mouseout','mouseenter','mouseleave','focus','blur','submit','reset','change','input','select','scroll','resize','load','unload','abort','error','load','unload','beforeunload','hashchange','popstate','storage','message','messageerror','open','close','connecting','connect','disconnect','retry','reconnect','ping','pong','send','receive','emit','on','off','once','remove','add','clear','has','size','keys','values','entries','next','done','value','key','data','result','response','request','headers','body','status','method','url','endpoint','route','router','server','client','port','host','localhost','config','options','settings','props','state','ref','context','hook','effect','memo','callback','component','render','mount','unmount','update','children','parent','child','sibling','element','dom','node','tree','root','leaf','branch','node','link','href','src','alt','title','class','style','id','name','value','checked','disabled','required','placeholder','label','button','input','form','select','option','textarea','div','span','p','h1','h2','h3','ul','li','ol','table','tr','td','th','thead','tbody','img','a','nav','header','footer','main','section','article','aside','figure','figcaption','video','audio','source','track','canvas','svg','path','circle','rect','g','defs','use','symbol','linear','radial','stop','animate','set','animate','discard','template','slot','portal','fragment','suspense','lazy','strict','profiler','memo','forward','default','create','element','factory','children','hydrate','unmount','render','flush','sync','passive','capture','once','bubble','target','current','related','key','code','altkey','ctrlkey','shiftkey','metakey','repeat','location','pressed','released','down','up','press','move','over','out','enter','leave','wheel','click','dblclick','mousedown','mouseup','mousemove','mouseover','mouseout','mouseenter','mouseleave','focus','blur','submit','reset','change','input','select','scroll','resize','load','unload','abort','error','load','unload','beforeunload','hashchange','popstate','storage','message','messageerror','open','close','connecting','connect','disconnect','retry','reconnect','ping','pong','send','receive',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>~|=-]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function topKeywords(text: string, limit: number): string[] {
  const freq = new Map<string, number>();
  for (const word of tokenize(text)) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function extractSection(text: string, ...headings: string[]): string | null {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    for (const h of headings) {
      if (line.trim().startsWith(h)) {
        const collected: string[] = [];
        for (let j = i + 1; j < lines.length; j++) {
          const l = lines[j];
          if (/^#{1,6}\s/.test(l) && !l.toLowerCase().includes(h)) break;
          if (l.trim()) collected.push(l.trim());
          if (collected.length >= 6) break;
        }
        if (collected.length) return collected.join(' ');
      }
    }
  }
  return null;
}

function cleanMd(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function detectTechStack(text: string): string[] {
  const lower = text.toLowerCase();
  const stack: string[] = [];
  const techMap: Record<string, string[]> = {
    React: ['react', 'jsx', 'tsx', 'next.js', 'nextjs'],
    'Node.js': ['node', 'express', 'npm', 'yarn', 'pnpm'],
    TypeScript: ['typescript', 'tsc', '.ts'],
    Python: ['python', 'pip', 'django', 'flask', 'fastapi'],
    'Tailwind CSS': ['tailwind'],
    Supabase: ['supabase'],
    PostgreSQL: ['postgres', 'postgresql'],
    MongoDB: ['mongodb', 'mongoose'],
    Algorand: ['algorand', 'algokit', 'pyteal'],
    Stripe: ['stripe'],
    OpenAI: ['openai', 'gpt-'],
    Gemini: ['gemini', 'google ai'],
    Vite: ['vite'],
    Docker: ['docker', 'dockerfile', 'containerize'],
    GraphQL: ['graphql', 'apollo'],
    Redis: ['redis'],
    Firebase: ['firebase', 'firestore'],
    AWS: ['aws', 's3', 'lambda', 'ec2'],
    Solidity: ['solidity', 'ethereum', 'web3'],
    Rust: ['rust', 'cargo'],
    Go: ['golang', 'go '],
  };
  for (const [tech, keys] of Object.entries(techMap)) {
    if (keys.some((k) => lower.includes(k))) stack.push(tech);
  }
  return stack.length ? stack : ['Custom stack'];
}

function detectFeatures(text: string): string[] {
  const features: string[] = [];
  const featureSection = extractSection(text, 'features', 'key features', 'what it does', 'capabilities');
  if (featureSection) {
    const parts = featureSection.split(/[,;.]|\s-\s/).map((s) => s.trim()).filter((s) => s.length > 3);
    features.push(...parts.slice(0, 8));
  }
  if (features.length < 3) {
    const bullets = text
      .split('\n')
      .filter((l) => /^\s*[-*+]\s+/.test(l))
      .map((l) => cleanMd(l.replace(/^\s*[-*+]\s+/, '')))
      .filter((l) => l.length > 8 && l.length < 120)
      .slice(0, 8);
    features.push(...bullets);
  }
  if (features.length < 3) {
    const keywords = topKeywords(text, 6);
    return keywords.map((k) => k.charAt(0).toUpperCase() + k.slice(1) + ' support');
  }
  return features.slice(0, 8);
}

function detectProjectName(text: string): string {
  const h1 = text.match(/^#\s+(.+)$/m);
  if (h1) {
    const name = h1[1].trim();
    if (name.length < 60) return name.replace(/\s+/g, ' ');
  }
  const titleTag = text.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleTag) return titleTag[1].trim();
  const firstLine = text.split('\n').find((l) => l.trim().length > 0);
  if (firstLine && firstLine.length < 60) return cleanMd(firstLine);
  return 'Untitled Project';
}

function detectFundingAsk(text: string): string {
  const match = text.match(/\$[\d,]+\s*(?:k|m|million|thousand)?/i);
  if (match) return `${match[0]} to accelerate development and go-to-market`;
  return 'Seeking $250K pre-seed to reach product-market fit and first 1,000 customers';
}

export function analyzeDocument(rawText: string): ExtractedAnalysis {
  const clean = cleanMd(rawText);
  const name = detectProjectName(rawText);
  const keywords = topKeywords(clean, 5);

  const problem =
    extractSection(rawText, 'problem', 'problem statement', 'challenge', 'pain point') ??
    `Existing solutions for ${keywords[0] ?? 'this space'} are fragmented, slow, and fail to serve modern users who expect real-time, intelligent experiences. Teams waste hours on manual work that should be automated.`;

  const solution =
    extractSection(rawText, 'solution', 'how it works', 'overview', 'what it does') ??
    `${name} provides an end-to-end platform that automates the entire workflow — from input to output — using AI. It integrates seamlessly with existing tools and requires no setup, so teams can go live in minutes instead of weeks.`;

  const targetUsersRaw =
    extractSection(rawText, 'target', 'audience', 'users', 'who is this for', 'use cases') ??
    `Developers, startup founders, and product teams building ${keywords[0] ?? 'modern applications'} who need to ship faster without compromising quality.`;
  const targetUsers = targetUsersRaw
    .split(/[,;]|\s-\s/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2)
    .slice(0, 5);
  if (targetUsers.length < 2) targetUsers.push('Startup founders', 'Product teams');

  const features = detectFeatures(rawText);
  const techStack = detectTechStack(rawText);

  const market =
    extractSection(rawText, 'market', 'market size', 'opportunity', 'tam') ??
    `The global market for this category is projected to reach $50B by 2028, growing at 18% CAGR. The underserved SMB and developer segments represent a $12B serviceable opportunity today.`;

  const businessModel =
    extractSection(rawText, 'business model', 'model', 'how we make money') ??
    `Freemium SaaS with tiered subscriptions. Free tier drives adoption; Pro and Team tiers convert power users. Enterprise contracts for large organizations.`;

  const revenueModel =
    extractSection(rawText, 'revenue', 'revenue model', 'pricing', 'monetization') ??
    `Monthly recurring revenue via subscriptions ($19 Pro, $49 Team, custom Enterprise). Usage-based add-ons for heavy consumers. Targeting $5K MRR in 6 months.`;

  const competition =
    extractSection(rawText, 'competition', 'competitors', 'alternatives', 'competitive landscape') ??
    `Incumbents rely on legacy architectures and slow release cycles. New entrants lack AI capabilities. No competitor combines ${techStack.slice(0, 2).join(' and ')} with the automation depth we offer.`;

  const uniqueSellingPoint =
    extractSection(rawText, 'unique', 'usp', 'differentiator', 'why us', 'advantage') ??
    `Purpose-built AI engine, ${techStack[0] ?? 'modern'}-native architecture, and a UX that requires zero onboarding. We ship in minutes what competitors take weeks to deliver.`;

  const futureScope =
    extractSection(rawText, 'roadmap', 'future', 'next steps', 'planned') ??
    `Q1: Launch public beta. Q2: Enterprise SSO and audit logs. Q3: Marketplace for extensions. Q4: International expansion and on-prem deployment option.`;

  const fundingAsk = detectFundingAsk(rawText);

  const tagline = `${keywords[0] ?? 'Intelligent'} ${keywords[1] ?? 'automation'} for modern teams`;

  return {
    projectName: name,
    tagline,
    problem,
    solution,
    targetUsers,
    features,
    techStack,
    market,
    businessModel,
    revenueModel,
    competition,
    uniqueSellingPoint,
    futureScope,
    fundingAsk,
  };
}

const AUDIENCE_PROFILES: Record<
  Audience,
  { focus: string[]; tone: string; slideOrder: string[]; technicalDepth: string; businessFocus: string; language: string; investorPsychology: string }
> = {
  hackathon_judge: {
    focus: ['Innovation', 'Architecture', 'Feasibility', 'Demo', 'AI', 'Blockchain'],
    tone: 'Energetic, technical, demo-driven',
    slideOrder: ['title', 'problem', 'solution', 'demo', 'technology', 'architecture', 'innovation', 'market', 'competition', 'advantage', 'roadmap', 'team', 'funding', 'closing'],
    technicalDepth: 'High — show the stack, architecture decisions, and clever engineering',
    businessFocus: 'Secondary — judges care about what you built, not just the business',
    language: 'Technical but accessible; lead with the "wow"',
    investorPsychology: 'Judges want to see ambition, technical rigor, and a working demo',
  },
  angel_investor: {
    focus: ['Founder', 'Vision', 'Early Growth', 'Story', 'Traction'],
    tone: 'Warm, personal, vision-led',
    slideOrder: ['title', 'problem', 'solution', 'team', 'vision', 'market', 'traction', 'business', 'revenue', 'competition', 'advantage', 'roadmap', 'funding', 'closing'],
    technicalDepth: 'Low — focus on the story and why this team wins',
    businessFocus: 'High — but framed around founder-market fit and early signal',
    language: 'Conversational and personal; angels back founders, not slides',
    investorPsychology: 'Angels invest in people and momentum before product-market fit',
  },
  vc: {
    focus: ['Market', 'Revenue', 'Growth', 'Scalability', 'Unit Economics'],
    tone: 'Data-driven, ambitious, metrics-led',
    slideOrder: ['title', 'problem', 'market', 'solution', 'business', 'revenue', 'competition', 'advantage', 'go-to-market', 'scalability', 'traction', 'roadmap', 'team', 'funding', 'closing'],
    technicalDepth: 'Medium — enough to prove defensibility, not so much it loses the partner',
    businessFocus: 'Primary — market size, unit economics, and growth engine',
    language: 'Crisp, metrics-first; every slide should answer "how big can this get"',
    investorPsychology: 'VCs need a $1B+ outcome — show the path to scale',
  },
  government: {
    focus: ['Impact', 'Society', 'Sustainability', 'Employment', 'Compliance'],
    tone: 'Formal, impact-led, accountable',
    slideOrder: ['title', 'problem', 'impact', 'solution', 'beneficiaries', 'sustainability', 'employment', 'market', 'roadmap', 'team', 'partnerships', 'budget', 'funding', 'closing'],
    technicalDepth: 'Low — emphasize outcomes and accountability over engineering',
    businessFocus: 'Framed as public value and economic development, not profit',
    language: 'Formal and measured; align with policy goals and measurable outcomes',
    investorPsychology: 'Committees want measurable impact, jobs, and long-term sustainability',
  },
};

export function getAudienceOptimization(audience: Audience): AudienceOptimization {
  const p = AUDIENCE_PROFILES[audience];
  return { audience, ...p };
}

export function getAllAudienceOptimizations(): AudienceOptimization[] {
  return (['hackathon_judge', 'angel_investor', 'vc', 'government'] as Audience[]).map(getAudienceOptimization);
}

export function scoreHealth(analysis: ExtractedAnalysis): HealthScores {
  const text = [analysis.problem, analysis.solution, analysis.market, analysis.businessModel, analysis.revenueModel, analysis.competition, analysis.uniqueSellingPoint].join(' ');
  const len = text.length;
  const keywordCount = topKeywords(text, 50).length;

  const innovation = clamp(60 + (analysis.techStack.length * 4) + (analysis.features.length * 2) + (analysis.techStack.includes('Algorand') ? 8 : 0));
  const market = clamp(55 + (len > 400 ? 15 : len > 200 ? 8 : 0) + (keywordCount > 10 ? 10 : 0));
  const business = clamp(50 + (analysis.businessModel.length > 60 ? 15 : 5) + (analysis.revenueModel.length > 60 ? 12 : 4) + (analysis.fundingAsk.length > 20 ? 8 : 0));
  const scalability = clamp(58 + (analysis.techStack.length * 3) + (analysis.futureScope.length > 60 ? 12 : 4));
  const presentation = clamp(65 + (analysis.features.length * 2) + (analysis.targetUsers.length * 3) + (analysis.uniqueSellingPoint.length > 60 ? 8 : 0));
  const investmentReadiness = Math.round((business * 0.3 + market * 0.25 + scalability * 0.2 + innovation * 0.15 + presentation * 0.1));
  const overall = Math.round((innovation + market + business + scalability + presentation + investmentReadiness) / 6);

  const suggestions: string[] = [];
  if (business < 75) suggestions.push('Weak Revenue Model — clarify pricing tiers and unit economics');
  if (market < 75) suggestions.push('Improve Market Validation — add TAM/SAM/SOM with cited sources');
  if (scalability < 75) suggestions.push('Need Better Customer Acquisition — define your go-to-market channel');
  if (analysis.revenueModel.length < 80) suggestions.push('Explain Pricing — show exact plans, conversion rates, and CAC/LTV');
  if (analysis.competition.length < 80) suggestions.push('Deepen Competitive Analysis — include a feature comparison matrix');
  if (suggestions.length === 0) suggestions.push('Strong overall — refine the narrative and practice your delivery');

  return { innovation, market, business, scalability, presentation, investmentReadiness, overall, suggestions };
}

function clamp(n: number) {
  return Math.max(35, Math.min(98, Math.round(n)));
}

const SLIDE_TEMPLATES: Record<string, (a: ExtractedAnalysis, opt: AudienceOptimization) => Omit<Slide, 'id'>> = {
  title: (a, opt) => ({
    type: 'title',
    title: a.projectName,
    subtitle: a.tagline,
    highlight: `Pitch tuned for ${audienceLabel(opt.audience)}`,
  }),
  problem: (a) => ({
    type: 'problem',
    title: 'The Problem',
    body: a.problem,
    bullets: a.targetUsers.map((u) => `${u} feel this pain acutely`),
  }),
  'current-pain': (a) => ({
    type: 'current-pain',
    title: 'Current Market Pain',
    body: `Today, teams patch together ${a.techStack[0] ?? 'existing tools'} with manual processes. The result: wasted time, errors, and frustration.`,
    bullets: ['Slow, repetitive manual work', 'No intelligent automation', 'Fragmented tooling', 'Poor developer experience'],
  }),
  solution: (a) => ({
    type: 'solution',
    title: 'Our Solution',
    body: a.solution,
    bullets: a.features.slice(0, 4),
  }),
  demo: (a) => ({
    type: 'demo',
    title: 'Product Demo',
    body: `A live walkthrough of ${a.projectName} in action — from input to intelligent output in under 60 seconds.`,
    highlight: 'See it live',
  }),
  technology: (a) => ({
    type: 'technology',
    title: 'Technology Stack',
    bullets: a.techStack,
    body: `Built on a modern, scalable foundation combining ${a.techStack.slice(0, 2).join(' and ')}.`,
  }),
  architecture: (a) => ({
    type: 'architecture',
    title: 'Architecture',
    body: `A clean, layered architecture: AI engine at the core, ${a.techStack[0] ?? 'modern'} services, and a thin client layer. Designed for scale from day one.`,
    bullets: ['AI analysis engine', 'Modular service layer', 'Real-time data pipeline', 'Secure by design'],
  }),
  innovation: (a) => ({
    type: 'innovation',
    title: 'What Makes It Innovative',
    body: a.uniqueSellingPoint,
    bullets: ['First-of-its-kind AI approach', 'Zero-setup onboarding', `${a.techStack[0] ?? 'Modern'}-native performance`],
  }),
  market: (a) => ({
    type: 'market',
    title: 'Market Opportunity',
    body: a.market,
    highlight: '$50B TAM by 2028',
  }),
  business: (a) => ({
    type: 'business',
    title: 'Business Model',
    body: a.businessModel,
    bullets: ['Freemium acquisition', 'Tiered SaaS subscriptions', 'Enterprise contracts'],
  }),
  revenue: (a) => ({
    type: 'revenue',
    title: 'Revenue Model',
    body: a.revenueModel,
    highlight: 'Targeting $5K MRR in 6 months',
  }),
  competition: (a) => ({
    type: 'competition',
    title: 'Competitive Landscape',
    body: a.competition,
  }),
  advantage: (a) => ({
    type: 'advantage',
    title: 'Competitive Advantage',
    body: a.uniqueSellingPoint,
    bullets: ['AI-native from day one', 'Faster time-to-value', 'Deep integration ecosystem'],
  }),
  'go-to-market': (a) => ({
    type: 'go-to-market',
    title: 'Go To Market',
    body: `We acquire users through developer communities, open-source distribution, and content marketing — then convert power users to paid plans.`,
    bullets: ['Open-source community flywheel', 'Developer content & SEO', 'Product-led growth', 'Strategic partnerships'],
  }),
  scalability: (a) => ({
    type: 'scalability',
    title: 'Scalability',
    body: `${a.projectName} is architected to scale horizontally. ${a.techStack[0] ?? 'The stack'} supports 10x growth without re-architecture.`,
    bullets: ['Stateless services', 'Horizontal scaling', 'Multi-region ready', 'Usage-based cost control'],
  }),
  traction: (a) => ({
    type: 'traction',
    title: 'Early Traction',
    body: `Beta users are already using ${a.projectName} weekly. Early signal: strong retention and organic word-of-mouth.`,
    bullets: ['500+ beta signups', '40% weekly retention', 'Organic referrals growing'],
  }),
  impact: (a) => ({
    type: 'impact',
    title: 'Social Impact',
    body: `${a.projectName} creates measurable public value: skills development, employment enablement, and sustainable operations.`,
    bullets: ['Workforce upskilling', 'Sustainable infrastructure', 'Community-first design'],
  }),
  beneficiaries: (a) => ({
    type: 'beneficiaries',
    title: 'Beneficiaries',
    bullets: a.targetUsers,
    body: 'Our primary beneficiaries span multiple stakeholder groups aligned with public policy goals.',
  }),
  sustainability: (a) => ({
    type: 'sustainability',
    title: 'Sustainability Plan',
    body: `A blended revenue model ensures long-term viability without sole dependence on grant funding.`,
    bullets: ['Mixed revenue streams', 'Lean operating model', 'Path to self-sufficiency'],
  }),
  employment: (a) => ({
    type: 'employment',
    title: 'Employment Impact',
    body: `${a.projectName} will create skilled jobs across engineering, operations, and community management within 18 months.`,
    bullets: ['12+ skilled roles in year 1', 'Local hiring commitment', 'Apprenticeship pipeline'],
  }),
  partnerships: (a) => ({
    type: 'partnerships',
    title: 'Strategic Partnerships',
    body: 'We partner with educational institutions, developer communities, and public-sector bodies to maximize reach.',
    bullets: ['Academic partnerships', 'Developer community alliances', 'Public-sector pilots'],
  }),
  budget: (a) => ({
    type: 'budget',
    title: 'Budget Allocation',
    body: a.fundingAsk,
    bullets: ['40% engineering', '30% community & impact', '20% operations', '10% contingency'],
  }),
  roadmap: (a) => ({
    type: 'roadmap',
    title: 'Roadmap',
    bullets: a.futureScope.split(/[.]/).map((s) => s.trim()).filter(Boolean).slice(0, 4),
  }),
  team: (a) => ({
    type: 'team',
    title: 'Team',
    body: `The ${a.projectName} team combines deep technical expertise with a passion for ${a.targetUsers[0] ?? 'the problem space'}.`,
    bullets: ['Founding team with domain expertise', 'Full-stack engineering capability', 'Advisors from target industry'],
  }),
  vision: (a) => ({
    type: 'vision',
    title: 'Our Vision',
    body: `We envision a world where ${a.targetUsers[0] ?? 'every team'} can leverage intelligent automation without complexity. ${a.projectName} is the bridge.`,
  }),
  funding: (a) => ({
    type: 'funding',
    title: 'Funding Ask',
    body: a.fundingAsk,
    highlight: a.fundingAsk.match(/\$[\d,]+[km]?/i)?.[0] ?? '$250K',
  }),
  closing: (a) => ({
    type: 'closing',
    title: `Let's build the future of ${a.projectName}`,
    subtitle: 'Thank you',
    highlight: 'Contact us to continue the conversation',
  }),
};

function audienceLabel(a: Audience) {
  return { hackathon_judge: 'Hackathon Judges', angel_investor: 'Angel Investors', vc: 'Venture Capitalists', government: 'Grant Committees' }[a];
}

export function generateSlides(analysis: ExtractedAnalysis, opt: AudienceOptimization): Slide[] {
  const order = opt.slideOrder;
  const slides: Slide[] = order
    .map((type) => {
      const tpl = SLIDE_TEMPLATES[type];
      if (!tpl) return null;
      return { id: uid('slide'), ...tpl(analysis, opt) } as Slide;
    })
    .filter((s): s is Slide => s !== null);
  return slides;
}

export function generatePresenterNotes(slides: Slide[], opt: AudienceOptimization): PresenterNote[] {
  const intros: Record<string, string> = {
    title: `Open with energy. Introduce ${'${projectName}'} and the tagline. Set the stakes for this ${audienceLabel(opt.audience)} audience.`,
    problem: 'Make the pain visceral. Use a concrete example the audience will recognize. Pause after the key line.',
    solution: 'Now the relief. Be concrete about what the product does — avoid jargon unless the audience is technical.',
    demo: 'This is the moment. Show the happy path in under 60 seconds. Narrate what is happening, not what you clicked.',
    technology: 'Name the stack with confidence. Explain why each choice matters for scalability and defensibility.',
    market: 'Anchor the number. Cite the source. Then translate the TAM into the slice you can realistically capture.',
    business: 'Be crisp: how do you make money, and who pays. Avoid hedging.',
    revenue: 'Show the math. MRR target, conversion assumption, and the path to get there.',
    competition: 'Acknowledge competitors honestly. Then draw the line that separates you.',
    advantage: 'This is your moat. Say it plainly — if you cannot explain it in one sentence, the audience will not believe it.',
    funding: 'State the ask, the use of funds, and the milestone it buys. Then stop talking.',
    closing: 'Close with confidence. Do not trail off. Invite the next conversation explicitly.',
  };

  return slides.map((slide) => ({
    slideId: slide.id,
    text:
      intros[slide.type]?.replace('${projectName}', slide.title) ??
      `Walk through "${slide.title}" clearly. ${slide.body ? 'Key point: ' + slide.body.slice(0, 120) : 'Deliver the bullets with conviction.'} Keep it under 45 seconds.`,
  }));
}

export function generateElevatorPitches(analysis: ExtractedAnalysis): ElevatorPitch {
  const { projectName, problem, solution, targetUsers, uniqueSellingPoint } = analysis;
  return {
    thirtySeconds: `${projectName} helps ${targetUsers[0] ?? 'teams'} ${solution.split('.')[0].toLowerCase()}. ${uniqueSellingPoint.split('.')[0]}.`,
    sixtySeconds: `Most ${targetUsers[0] ?? 'teams'} struggle with ${problem.split('.')[0].toLowerCase()}. ${projectName} solves this by ${solution.split('.')[0].toLowerCase()}. What makes us different: ${uniqueSellingPoint.split('.')[0]}. We're raising to accelerate growth.`,
    threeMinutes: `Let me tell you about ${projectName}.\n\nThe problem: ${problem}\n\nOur solution: ${solution}\n\nWho it's for: ${targetUsers.join(', ')}.\n\nWhy we win: ${uniqueSellingPoint}\n\nThe market is large and growing. Our model is proven. We're raising to scale. Here's the plan, and here's where we'll be in 12 months.`,
  };
}

export function generateInvestorQuestions(analysis: ExtractedAnalysis): InvestorQA[] {
  const { projectName, targetUsers, revenueModel, businessModel, market, competition, techStack, features, fundingAsk } = analysis;
  const qs: InvestorQA[] = [
    { question: `What is the core problem ${projectName} solves?`, answer: analysis.problem },
    { question: `How does ${projectName} actually work?`, answer: analysis.solution },
    { question: 'Who is your target customer?', answer: `Our primary users are ${targetUsers.join(', ')}.` },
    { question: 'How do you make money?', answer: businessModel + ' ' + revenueModel },
    { question: 'What is the market size?', answer: market },
    { question: 'Who are your competitors?', answer: competition },
    { question: 'What is your competitive advantage?', answer: analysis.uniqueSellingPoint },
    { question: 'Why now? Why didn\'t this exist before?', answer: `Recent advances in ${techStack[0] ?? 'AI'} and shifting user expectations make this the right moment. The infrastructure and demand are finally aligned.` },
    { question: 'What is your customer acquisition strategy?', answer: 'We use a product-led growth motion: a generous free tier drives adoption, and power users convert to paid plans. Content, community, and partnerships amplify organic reach.' },
    { question: 'What are your unit economics?', answer: 'Blended CAC under $40, LTV projected at $600+, with a 15x payback within 12 months at current conversion rates.' },
    { question: 'How will you use the funding?', answer: fundingAsk + ' The capital is allocated across engineering, go-to-market, and key hires to hit our next inflection point.' },
    { question: 'What is your traction so far?', answer: 'We have a working product, early beta users, and validated demand. The next 6 months focus on conversion and retention.' },
    { question: 'What are the biggest risks?', answer: 'The main risks are adoption velocity and competitive response. We mitigate by shipping fast, building community, and deepening our AI moat.' },
    { question: 'What is your moat?', answer: analysis.uniqueSellingPoint + ' Our AI engine and data network effects compound over time.' },
    { question: 'Why is your team the right one to build this?', answer: `We combine deep ${techStack[0] ?? 'technical'} expertise with first-hand experience of the problem. We have shipped to production and know the domain.` },
    { question: 'What is your 12-month roadmap?', answer: analysis.futureScope },
    { question: 'How do you handle data privacy and security?', answer: 'We follow industry best practices: encryption at rest and in transit, least-privilege access, and SOC2-ready architecture from day one.' },
    { question: 'What happens if a big player enters your space?', answer: 'We move faster and deeper. Our focused scope and AI-native architecture let us ship in days what incumbents take quarters to build.' },
    { question: 'How scalable is the technology?', answer: `Built on ${techStack.slice(0, 2).join(' and ')}, the architecture scales horizontally with no re-platforming needed through 10x growth.` },
    { question: 'What does success look like in 2 years?', answer: `${projectName} is the default tool for ${targetUsers[0] ?? 'our users'}, with ${features.length}+ core capabilities, strong recurring revenue, and a thriving ecosystem.` },
  ];
  return qs;
}
