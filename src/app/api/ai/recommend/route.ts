import { NextResponse } from 'next/server';
import { QuizSubmission, RecommendationResult, SegmentName } from '@/types/growth';
import OpenAI from 'openai';

// Fallback deterministic system if AI fails or key missing
function getDeterministicRecommendation(quiz: QuizSubmission): RecommendationResult {
  const { skill_level, interest, goal } = quiz;

  let segment: SegmentName = 'Beginner AI Career Builder';
  let recommended_project = 'AI Resume Assistant';
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  let learning_path = [
    'AI Fundamentals & Prompt Setup',
    'Design Resume Input Interface',
    'Integrate OpenAI API Route',
    'Implement Dynamic Parsing & Feedback',
    'Polish UX & Export Features',
    'Testing & Edge Case Handling',
    'Deploy to Vercel & Share Portfolio',
  ];

  if (skill_level === 'Advanced' || interest.toLowerCase().includes('machine learning')) {
    segment = 'Advanced ML Engineer';
    recommended_project = 'Full-Stack RAG Knowledge Agent';
    difficulty = 'Advanced';
    learning_path = [
      'Vector DB & Embedding Architecture',
      'Ingest & Tokenize Custom Documents',
      'Build Hybrid Retrieval Pipeline',
      'Integrate Contextual LLM Generator',
      'Optimize Query Latency & Memory',
      'Evaluation & Benchmark Testing',
      'Deploy Production API & Frontend',
    ];
  } else if (skill_level === 'Intermediate' || interest.toLowerCase().includes('automation')) {
    segment = 'Intermediate App Builder';
    recommended_project = 'Autonomous AI Agent Workflow';
    difficulty = 'Intermediate';
    learning_path = [
      'Agentic Architecture & Tool Schemas',
      'Build User Goal Input Dashboard',
      'Configure Function Calling APIs',
      'Implement Execution Loop & Safety',
      'UI Progress Visualization',
      'Integration & Error Handling',
      'Production Deployment',
    ];
  } else if (interest.toLowerCase().includes('chatbot')) {
    segment = 'Portfolio Builder';
    recommended_project = 'Conversational Portfolio Bot';
    difficulty = 'Beginner';
  } else if (goal === 'Hackathon') {
    segment = 'Hackathon Builder';
    recommended_project = 'Multimodal AI Creative Studio';
    difficulty = 'Intermediate';
  }

  return {
    segment,
    recommended_project,
    difficulty,
    estimated_days: 7,
    reason: `This project directly matches your ${skill_level.toLowerCase()} technical background, target focus on ${interest}, and your ${goal.toLowerCase()} objective.`,
    learning_path,
  };
}

export async function POST(req: Request) {
  try {
    const body: QuizSubmission = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      console.log('OpenAI API key missing. Using deterministic recommendation engine fallback.');
      return NextResponse.json(getDeterministicRecommendation(body));
    }

    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    const prompt = `
You are an expert AI growth engineer and career mentor.
Given a student's quiz answers, generate a personalized 7-day AI project recommendation.

Input:
${JSON.stringify(body, null, 2)}

Return strictly a single JSON object (no markdown wrappers, no extra text) with this exact schema:
{
  "segment": "Beginner AI Career Builder" | "Intermediate App Builder" | "Advanced ML Engineer" | "Career Seeker" | "Portfolio Builder" | "Hackathon Builder" | "AI Explorer",
  "recommended_project": "String title",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estimated_days": 7,
  "reason": "Clear explanation linking their skill, time commitment, and goal",
  "learning_path": ["Day 1 task summary", "Day 2 task summary", "Day 3 task summary", "Day 4 task summary", "Day 5 task summary", "Day 6 task summary", "Day 7 task summary"]
}
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You format output strictly as JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const rawText = response.choices[0]?.message?.content || '';
    const parsed: RecommendationResult = JSON.parse(rawText);

    // Schema validation checks
    if (!parsed.recommended_project || !parsed.segment || !Array.isArray(parsed.learning_path)) {
      throw new Error('Invalid JSON structure returned by OpenAI');
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    // Fallback to deterministic recommendation if anything fails
    try {
      const body: QuizSubmission = await req.json();
      return NextResponse.json(getDeterministicRecommendation(body));
    } catch {
      return NextResponse.json(
        getDeterministicRecommendation({
          skill_level: 'Beginner',
          interest: 'AI Chatbot',
          daily_time: '30-60 minutes',
          goal: 'Internship',
          technologies: ['React', 'JavaScript'],
        })
      );
    }
  }
}
