const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AI responses based on helper personality and user input
const generateAIResponse = (helperData, userMessage, conversationHistory = []) => {
  const responses = {
    1: { // MarketingMax
      default: "Great question! Let me analyze your marketing strategy needs and provide some strategic insights...",
      campaign: "For your campaign strategy, I recommend focusing on these key elements: target audience segmentation, competitive positioning, and multi-channel approach. Here's a detailed breakdown...",
      analysis: "Based on market analysis, I see several opportunities for growth. Let me outline the key findings and actionable recommendations...",
      strategy: "Your strategic approach should consider both short-term wins and long-term brand building. Here's my recommended framework..."
    },
    2: { // SocialStevie
      default: "Awesome! Let's get creative with your social media presence. I'm buzzing with ideas for your brand!",
      content: "Here are some engaging content ideas that will make your audience stop scrolling: 1) Behind-the-scenes stories, 2) User-generated content campaigns, 3) Interactive polls and quizzes...",
      schedule: "For optimal posting times, I recommend: Monday-Wednesday 9am-11am for B2B content, Thursday-Friday 3pm-5pm for engagement posts, and weekends for lifestyle content...",
      engagement: "To boost engagement, try these proven tactics: Ask questions in your captions, use trending hashtags strategically, respond to comments within 2 hours..."
    },
    3: { // ContentCat
      default: "Purr-fect! I'm excited to help you create some amazing content. What type of writing project are we tackling today?",
      blog: "Here's a compelling blog post structure for you: Eye-catching headline, problem-focused intro, value-packed body with actionable tips, and a strong call-to-action...",
      email: "For effective email copy, let's use the AIDA framework: Attention-grabbing subject line, Interest-building opening, Desire-creating body, and Action-driving close...",
      copy: "Great copy connects emotionally with your audience. Let me craft some persuasive copy that speaks directly to your customers' needs and desires..."
    },
    4: { // EmailElla
      default: "Hello! I'm excited to help you build stronger relationships through email marketing. What's your email challenge today?",
      campaign: "For your email campaign, let's focus on personalization and value delivery. I'll create a series that nurtures leads while providing genuine value at each touchpoint...",
      automation: "Email automation is powerful! Let me design a welcome series that introduces new subscribers to your brand, builds trust, and guides them toward conversion...",
      list: "List building success comes from offering irresistible lead magnets. Here are some ideas that will attract your ideal customers..."
    },
    5: { // AdsAnnie
      default: "Ready to get some serious ROI? I'm here to help you create ads that convert! What's your advertising goal?",
      google: "For Google Ads success, keyword research is crucial. Let me identify high-intent keywords with good search volume and manageable competition...",
      facebook: "Facebook Ads excel at targeting specific audiences. I'll help you create compelling ad creative and precise targeting to reach your ideal customers...",
      copy: "Great ad copy grabs attention, creates urgency, and drives action. Here's some high-converting copy for your campaigns..."
    },
    6: { // DataDolly
      default: "Numbers tell the story! I'm here to help you make sense of your data and turn insights into action. What metrics are we analyzing?",
      analysis: "Looking at your performance data, I can see some interesting patterns. Here's what the numbers are telling us about your marketing effectiveness...",
      roi: "Let's calculate your return on investment across different channels. Based on the data, here's where you're getting the best bang for your buck...",
      reporting: "I'll create a comprehensive report that highlights key performance indicators, trends, and actionable recommendations for improvement..."
    },
    7: { // LeadLucy
      default: "Target acquired! I'm ready to help you generate and convert more qualified leads. What's your lead generation challenge?",
      generation: "For effective lead generation, we need to create multiple touchpoints and nurture sequences. Here's a comprehensive lead gen strategy...",
      qualification: "Not all leads are created equal. Let me help you develop a scoring system to identify your most promising prospects...",
      nurturing: "Lead nurturing is all about providing value at the right time. Here's a sequence that will guide prospects through your sales funnel..."
    },
    8: { // GrowthGrace
      default: "Sky's the limit! I'm here to help you scale your business strategically. What growth challenges are we tackling?",
      scaling: "Sustainable growth requires systems and processes. Let me outline a scaling strategy that maintains quality while increasing capacity...",
      partnerships: "Strategic partnerships can accelerate growth significantly. Here are some partnership opportunities worth exploring...",
      expansion: "Market expansion needs careful planning. Let's analyze potential markets and create an entry strategy that minimizes risk while maximizing opportunity..."
    }
  };

  const helperId = helperData.Id;
  const helperResponses = responses[helperId] || responses[1];
  
  // Simple keyword matching to provide more relevant responses
  const message = userMessage.toLowerCase();
  
  if (message.includes('campaign') || message.includes('strategy')) {
    return helperResponses.campaign || helperResponses.strategy || helperResponses.default;
  } else if (message.includes('content') || message.includes('write') || message.includes('create')) {
    return helperResponses.content || helperResponses.default;
  } else if (message.includes('analysis') || message.includes('analyze') || message.includes('data')) {
    return helperResponses.analysis || helperResponses.default;
  } else if (message.includes('email') || message.includes('automation')) {
    return helperResponses.email || helperResponses.automation || helperResponses.default;
  } else if (message.includes('ads') || message.includes('advertising') || message.includes('google') || message.includes('facebook')) {
    return helperResponses.google || helperResponses.facebook || helperResponses.copy || helperResponses.default;
  } else if (message.includes('lead') || message.includes('conversion')) {
    return helperResponses.generation || helperResponses.qualification || helperResponses.default;
  } else if (message.includes('growth') || message.includes('scale') || message.includes('expand')) {
    return helperResponses.scaling || helperResponses.expansion || helperResponses.default;
  } else if (message.includes('social') || message.includes('engagement')) {
    return helperResponses.engagement || helperResponses.schedule || helperResponses.default;
  } else if (message.includes('roi') || message.includes('report')) {
    return helperResponses.roi || helperResponses.reporting || helperResponses.default;
  }
  
  return helperResponses.default;
};

export const aiService = {
  async generateResponse(helperData, userMessage, conversationHistory = []) {
    // Simulate API call delay
    await delay(1500 + Math.random() * 1000);
    
    try {
      const response = generateAIResponse(helperData, userMessage, conversationHistory);
      
      return {
        content: response,
        model: 'gpt-4',
        tokens_used: Math.floor(Math.random() * 200) + 50,
        response_time: Math.floor(Math.random() * 2000) + 1000
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  },

  async processQuickAction(helperData, actionType) {
    await delay(800 + Math.random() * 400);
    
    const quickActionResponses = {
      1: { // MarketingMax
        'Create campaign strategy': 'Here\'s a comprehensive campaign strategy framework tailored to your business goals...',
        'Analyze competitors': 'Let me provide a detailed competitive analysis with actionable insights...',
        'Market research': 'Based on current market trends, here are the key findings for your industry...',
        'Growth planning': 'Here\'s a strategic growth plan with specific milestones and tactics...'
      },
      2: { // SocialStevie
        'Create post ideas': 'Here are 10 engaging post ideas that will boost your social media presence...',
        'Plan content calendar': 'Let me create a 30-day content calendar with optimal posting times...',
        'Write captions': 'Here are some captivating captions that will increase engagement...',
        'Hashtag research': 'I\'ve found the best hashtags for your niche with high engagement potential...'
      },
      3: { // ContentCat
        'Write blog post': 'Here\'s a complete blog post structure with engaging headlines and actionable content...',
        'Create email copy': 'I\'ve crafted compelling email copy that will drive opens and clicks...',
        'Product descriptions': 'Here are persuasive product descriptions that highlight benefits and drive sales...',
        'Landing page copy': 'I\'ve created conversion-focused landing page copy that speaks to your audience...'
      }
    };

    const helperActions = quickActionResponses[helperData.Id] || {};
    const response = helperActions[actionType] || `Here's some helpful guidance for "${actionType}" based on your specific needs...`;

    return {
      content: response,
      action_type: actionType,
      helper_id: helperData.Id
    };
  }
};