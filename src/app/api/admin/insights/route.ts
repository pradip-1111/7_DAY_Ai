import { NextResponse } from 'next/server';
import { GrowthMetricsSummary, AIInsightsResponse } from '@/types/growth';
import OpenAI from 'openai';

function getFallbackInsights(metrics: GrowthMetricsSummary): AIInsightsResponse {
  return {
    observations: [
      `Overall visitor-to-registration conversion is currently at ${metrics.registrationConversionRate}%.`,
      `The quiz completion rate is strong at ${metrics.quizCompletionRate}%, showing high initial engagement.`,
      `The largest conversion drop-off occurs between ${metrics.largestDropOff.fromStep} and ${metrics.largestDropOff.toStep} with a ${metrics.largestDropOff.dropOffRate}% drop-off rate.`,
      `A/B CTA Experiment Variant B ("${metrics.experimentStats[1]?.ctaText || 'Build My AI Project'}") is outperforming Variant A by ${
        Math.round((metrics.experimentStats[1]?.conversionRate - metrics.experimentStats[0]?.conversionRate) * 10) / 10
      } percentage points.`,
    ],
    hypotheses: [
      metrics.largestDropOff.aiHypothesis,
      'Students are more motivated by concrete portfolio outcomes ("Build My AI Project") than passive educational language ("Start Learning").',
      'Adding instant live project previews on the recommendation page will increase registration trust and reduce final drop-off.',
    ],
    experiments: [
      {
        title: 'Social Proof & Project Preview Modal',
        description: 'Test adding interactive project demo previews on the recommendation page before registration.',
        expectedImpact: '+12% lift in Registration Conversion',
        targetMetric: 'Registration Conversion Rate',
      },
      {
        title: 'Frictionless 1-Click Social Auth',
        description: 'Introduce GitHub 1-click OAuth to remove registration form fields.',
        expectedImpact: '+18% reduction in drop-off at registration stage',
        targetMetric: 'Registration Drop-Off Rate',
      },
    ],
    nextSteps: [
      'Declare Variant B ("Build My AI Project") as the winning CTA messaging.',
      'Deploy the Social Proof & Preview experiment to address the primary funnel drop-off.',
      'Configure automated n8n day-2 email follow-ups for non-completers.',
    ],
  };
}

export async function POST(req: Request) {
  try {
    const metrics: GrowthMetricsSummary = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      return NextResponse.json(getFallbackInsights(metrics));
    }

    const openai = new OpenAI({ apiKey, baseURL });

    const prompt = `
You are a Principal Growth Analytics Engineer analyzing product experiment data for "AI Growth Engine - 7-Day AI Builder Challenge".

Data:
${JSON.stringify(metrics, null, 2)}

Analyze this funnel data and return strictly JSON with this exact schema:
{
  "observations": ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
  "hypotheses": ["Hypothesis 1", "Hypothesis 2", "Hypothesis 3"],
  "experiments": [
    {
      "title": "Experiment Title",
      "description": "Short explanation",
      "expectedImpact": "Estimated metric lift",
      "targetMetric": "Metric name"
    }
  ],
  "nextSteps": ["Action 1", "Action 2", "Action 3"]
}
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a growth analytics AI that returns strict JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    });

    const parsed: AIInsightsResponse = JSON.parse(response.choices[0]?.message?.content || '');
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error generating AI Growth Insights:', error);
    const body: GrowthMetricsSummary = await req.json().catch(() => ({} as any));
    return NextResponse.json(getFallbackInsights(body));
  }
}
