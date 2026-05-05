/**
 * Claude AI Client Wrapper
 * Provides a unified interface for Claude API calls with fallback support
 */

import Anthropic from '@anthropic-ai/sdk';
import { generateProfileContent } from '@/lib/aiProfileGenerator';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const HAS_API_KEY = !!process.env.ANTHROPIC_API_KEY;

/**
 * Generate AI content for a business profile using Claude
 * Falls back to template-based generation if API key not configured
 */
export async function generateProfileContentAI({
  businessName,
  category = 'general',
  keywords = [],
}) {
  // Fallback to templates if no API key
  if (!HAS_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set, using template-based generation');
    return generateProfileContent({ businessName, category, keywords });
  }

  try {
    const keywordsStr =
      keywords.length > 0
        ? keywords.slice(0, 5).join(', ')
        : 'quality services';

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a professional copywriter creating marketing content for businesses.

Generate professional content for this business profile:
- Business Name: ${businessName}
- Category: ${category}
- Keywords/Specialties: ${keywordsStr}

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "taglines": [
    "3 short, catchy, professional taglines (max 15 words each)"
  ],
  "about": "A compelling 80-120 word about section that highlights the business, its values, and what makes it special",
  "services": [
    { "title": "Service 1", "description": "Brief description" },
    { "title": "Service 2", "description": "Brief description" },
    { "title": "Service 3", "description": "Brief description" }
  ],
  "seoKeywords": ["5-7 SEO keywords", "for the business"]
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const parsed = JSON.parse(content.text);

    return {
      taglines: parsed.taglines?.slice(0, 3) || [],
      about: parsed.about || '',
      services: (parsed.services || []).map((s, i) => ({
        title: s.title || `Service ${i + 1}`,
        description: s.description || '',
        price: '',
        currency: 'INR',
        imageUrl: '',
        order: i,
      })),
      keywords: parsed.seoKeywords || [],
    };
  } catch (error) {
    console.error('Claude API error, falling back to templates:', error);
    // Fallback to template-based generation on any error
    return generateProfileContent({ businessName, category, keywords });
  }
}

/**
 * Generate AI suggestions to improve an existing business profile
 */
export async function improveProfileAI(profile) {
  if (!HAS_API_KEY) {
    return {
      suggestions: [
        'Add more details to your about section',
        'Include high-quality business photos',
        'Add your complete business hours',
        'Link all your social media profiles',
      ],
    };
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a business optimization expert. Analyze this business profile and suggest improvements:

Business Name: ${profile.businessName}
Category: ${profile.category}
About: ${profile.about || '(empty)'}
Contact: ${profile.contact?.phone ? 'Phone provided' : 'No phone'}
Address: ${profile.address?.addressLine1 ? 'Address provided' : 'No address'}
Gallery: ${profile.gallery?.length || 0} images
Social Links: ${profile.socialLinks?.length || 0} links
Services: ${profile.services?.length || 0} services

Respond with only JSON:
{
  "suggestions": [
    { "field": "about", "current": "issue", "improvement": "what to do" },
    ...
  ],
  "priority": "high/medium/low",
  "estimatedImpact": "description of business impact"
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const parsed = JSON.parse(content.text);
    return parsed;
  } catch (error) {
    console.error('Claude improvement API error:', error);
    return {
      suggestions: [
        'Add more details to your about section',
        'Include high-quality business photos',
        'Add your complete business hours',
      ],
    };
  }
}

/**
 * Generate AI analytics insights from scan data
 */
export async function generateAnalyticsInsightsAI(analyticsData) {
  if (!HAS_API_KEY) {
    return {
      insights: [
        {
          title: 'QR Code Performance',
          description: 'Your most popular QR code',
          action: 'Share it more widely',
          priority: 'high',
        },
      ],
    };
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a business analytics expert. Analyze this business performance data and provide actionable insights:

${JSON.stringify(analyticsData, null, 2)}

Respond with ONLY valid JSON:
{
  "insights": [
    {
      "title": "Insight title",
      "description": "What this means for the business",
      "action": "Specific action to take",
      "priority": "high/medium/low"
    }
  ],
  "summary": "Overall performance summary"
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const parsed = JSON.parse(content.text);
    return parsed;
  } catch (error) {
    console.error('Claude analytics API error:', error);
    return {
      insights: [
        {
          title: 'Keep Growing',
          description: 'More data will unlock better insights',
          action: 'Continue tracking and sharing your QR codes',
          priority: 'medium',
        },
      ],
    };
  }
}

export default client;
