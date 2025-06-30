import React from "react";
import Error from "@/components/ui/Error";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AI responses based on helper personality and user input
// Mock AI responses based on helper personality and user input with conversation context
const generateAIResponse = (helperData, userMessage, conversationHistory = []) => {
  // Analyze conversation context to avoid repetitive responses
  const contextAnalysis = analyzeConversationContext(conversationHistory, userMessage);
  
  const responses = {
    1: { // MarketingMax
      default: "Great question! Let me analyze your marketing strategy needs and provide some strategic insights...",
      campaign: "For your campaign strategy, I recommend focusing on these key elements: target audience segmentation, competitive positioning, and multi-channel approach. Here's a detailed breakdown...",
      analysis: "Based on market analysis, I see several opportunities for growth. Let me outline the key findings and actionable recommendations...",
      strategy: "Your strategic approach should consider both short-term wins and long-term brand building. Here's my recommended framework...",
      followup: "Building on our previous discussion, let me dive deeper into the specific tactics that will help you implement this strategy effectively...",
      clarification: "Let me clarify that point and provide some additional context that might be helpful for your situation..."
    },
    2: { // SocialStevie
      default: "Awesome! Let's get creative with your social media presence. I'm buzzing with ideas for your brand!",
      content: "Here are some engaging content ideas that will make your audience stop scrolling: 1) Behind-the-scenes stories, 2) User-generated content campaigns, 3) Interactive polls and quizzes...",
      schedule: "For optimal posting times, I recommend: Monday-Wednesday 9am-11am for B2B content, Thursday-Friday 3pm-5pm for engagement posts, and weekends for lifestyle content...",
      engagement: "To boost engagement, try these proven tactics: Ask questions in your captions, use trending hashtags strategically, respond to comments within 2 hours...",
      followup: "Perfect! Now that we've covered the basics, let's explore some advanced social media tactics that will really make your content stand out...",
      clarification: "Great question! Let me break that down further and show you exactly how to implement these social media strategies..."
    },
    3: { // ContentCat
      default: "Purr-fect! I'm excited to help you create some amazing content. What type of writing project are we tackling today?",
      blog: "Here's a compelling blog post structure for you: Eye-catching headline, problem-focused intro, value-packed body with actionable tips, and a strong call-to-action...",
      email: "For effective email copy, let's use the AIDA framework: Attention-grabbing subject line, Interest-building opening, Desire-creating body, and Action-driving close...",
      copy: "Great copy connects emotionally with your audience. Let me craft some persuasive copy that speaks directly to your customers' needs and desires...",
      followup: "Excellent! Now let's refine that content further. I have some additional techniques that will make your writing even more compelling...",
      clarification: "Let me explain that concept in more detail and show you some examples of how to apply it effectively..."
    },
    4: { // EmailElla
      default: "Hello! I'm excited to help you build stronger relationships through email marketing. What's your email challenge today?",
      campaign: "For your email campaign, let's focus on personalization and value delivery. I'll create a series that nurtures leads while providing genuine value at each touchpoint...",
      automation: "Email automation is powerful! Let me design a welcome series that introduces new subscribers to your brand, builds trust, and guides them toward conversion...",
      list: "List building success comes from offering irresistible lead magnets. Here are some ideas that will attract your ideal customers...",
      followup: "Wonderful! Let's take your email strategy to the next level with some advanced segmentation and personalization techniques...",
      clarification: "That's a great point! Let me provide more specific guidance on how to implement these email marketing strategies..."
    },
    5: { // AdsAnnie
      default: "Ready to get some serious ROI? I'm here to help you create ads that convert! What's your advertising goal?",
      google: "For Google Ads success, keyword research is crucial. Let me identify high-intent keywords with good search volume and manageable competition...",
      facebook: "Facebook Ads excel at targeting specific audiences. I'll help you create compelling ad creative and precise targeting to reach your ideal customers...",
      copy: "Great ad copy grabs attention, creates urgency, and drives action. Here's some high-converting copy for your campaigns...",
      followup: "Excellent direction! Now let's optimize those ads further. I have some advanced targeting and bidding strategies that will improve your ROI...",
      clarification: "Perfect question! Let me walk you through the specifics of setting up and optimizing these advertising campaigns..."
    },
    6: { // DataDolly
      default: "Numbers tell the story! I'm here to help you make sense of your data and turn insights into action. What metrics are we analyzing?",
      analysis: "Looking at your performance data, I can see some interesting patterns. Here's what the numbers are telling us about your marketing effectiveness...",
      roi: "Let's calculate your return on investment across different channels. Based on the data, here's where you're getting the best bang for your buck...",
      reporting: "I'll create a comprehensive report that highlights key performance indicators, trends, and actionable recommendations for improvement...",
      followup: "Great! Now let's dig deeper into these metrics and identify specific optimization opportunities based on the data trends...",
      clarification: "Excellent question! Let me break down these analytics concepts and show you how to interpret the data more effectively..."
    },
    7: { // LeadLucy
      default: "Target acquired! I'm ready to help you generate and convert more qualified leads. What's your lead generation challenge?",
      generation: "For effective lead generation, we need to create multiple touchpoints and nurture sequences. Here's a comprehensive lead gen strategy...",
      qualification: "Not all leads are created equal. Let me help you develop a scoring system to identify your most promising prospects...",
      nurturing: "Lead nurturing is all about providing value at the right time. Here's a sequence that will guide prospects through your sales funnel...",
      followup: "Perfect! Let's enhance your lead generation with some advanced qualification techniques and conversion optimization strategies...",
      clarification: "Great insight! Let me provide more detailed guidance on implementing these lead generation and nurturing tactics..."
    },
    8: { // GrowthGrace
      default: "Sky's the limit! I'm here to help you scale your business strategically. What growth challenges are we tackling?",
      scaling: "Sustainable growth requires systems and processes. Let me outline a scaling strategy that maintains quality while increasing capacity...",
      partnerships: "Strategic partnerships can accelerate growth significantly. Here are some partnership opportunities worth exploring...",
      expansion: "Market expansion needs careful planning. Let's analyze potential markets and create an entry strategy that minimizes risk while maximizing opportunity...",
      followup: "Fantastic progress! Let's now focus on the implementation details and timeline for executing this growth strategy effectively...",
      clarification: "Excellent question! Let me elaborate on these growth strategies and provide you with a more detailed action plan..."
    }
  };

  const helperId = helperData.Id;
  const helperResponses = responses[helperId] || responses[1];
  
  // Check for conversation context to avoid repetition
  if (contextAnalysis.isFollowUp) {
    return helperResponses.followup || generateContextualResponse(helperData, userMessage, conversationHistory);
  }
  
  if (contextAnalysis.needsClarification) {
    return helperResponses.clarification || generateClarificationResponse(helperData, userMessage, conversationHistory);
  }
  
  // Avoid repeating the same greeting or initial response
  if (contextAnalysis.isRepeatQuery) {
    return generateVariedResponse(helperData, userMessage, conversationHistory, helperResponses);
  }
  
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

// Analyze conversation context to prevent repetitive responses
const analyzeConversationContext = (conversationHistory, currentMessage) => {
  const recentMessages = conversationHistory.slice(-6); // Look at last 6 messages
  const assistantMessages = recentMessages.filter(msg => msg.role === 'assistant');
  const userMessages = recentMessages.filter(msg => msg.role === 'user');
  
  // Check if this appears to be a follow-up question
  const followUpIndicators = ['more', 'also', 'additionally', 'what about', 'how about', 'can you', 'could you'];
  const isFollowUp = followUpIndicators.some(indicator => 
    currentMessage.toLowerCase().includes(indicator)
  ) && conversationHistory.length > 2;
  
  // Check if user is asking for clarification
  const clarificationIndicators = ['explain', 'clarify', 'what do you mean', 'how do', 'why', 'elaborate'];
  const needsClarification = clarificationIndicators.some(indicator => 
    currentMessage.toLowerCase().includes(indicator)
  );
  
  // Check if this is a repeat of a previous query
  const currentMessageLower = currentMessage.toLowerCase();
  const isRepeatQuery = userMessages.some(msg => 
    msg.content && msg.content.toLowerCase().includes(currentMessageLower.substring(0, 20))
  ) && currentMessage.length > 10;
  
  return {
    isFollowUp,
    needsClarification,
    isRepeatQuery,
    messageCount: conversationHistory.length,
    recentTopics: extractTopics(recentMessages)
  };
};

// Extract topics from recent messages for context
const extractTopics = (messages) => {
  const topics = [];
  const keywords = ['campaign', 'strategy', 'content', 'social', 'email', 'ads', 'analytics', 'growth', 'leads'];
  
  messages.forEach(msg => {
    if (msg.content) {
      keywords.forEach(keyword => {
        if (msg.content.toLowerCase().includes(keyword) && !topics.includes(keyword)) {
          topics.push(keyword);
        }
      });
    }
  });
  
  return topics;
};

// Generate contextual responses based on conversation history
const generateContextualResponse = (helperData, userMessage, conversationHistory) => {
  const recentTopics = extractTopics(conversationHistory.slice(-4));
  const helperName = helperData.name;
  
  const contextualResponses = {
    1: `Based on what we've discussed about ${recentTopics.join(' and ')}, let me provide some additional strategic insights that will help you implement these marketing concepts effectively...`,
    2: `Great! Building on our conversation about ${recentTopics.join(' and ')}, here are some creative ways to take your social media strategy to the next level...`,
    3: `Purr-fect! Now that we've covered ${recentTopics.join(' and ')}, let me help you craft some content that will really make an impact...`,
    4: `Wonderful! Expanding on our discussion about ${recentTopics.join(' and ')}, here are some advanced email marketing techniques that will boost your results...`,
    5: `Excellent! Now that we've talked about ${recentTopics.join(' and ')}, let me show you how to optimize your advertising for even better ROI...`,
    6: `Great question! Looking at the ${recentTopics.join(' and ')} data we've discussed, here are some additional insights and optimization opportunities...`,
    7: `Target acquired! Building on our ${recentTopics.join(' and ')} discussion, here are some advanced lead generation tactics that will improve your conversion rates...`,
    8: `Sky's the limit! Based on our conversation about ${recentTopics.join(' and ')}, here's how to scale these strategies for maximum growth impact...`
  };
  
  return contextualResponses[helperData.Id] || `Great question! Let me build on our previous discussion and provide you with some additional insights that will help you move forward...`;
};

// Generate clarification responses
const generateClarificationResponse = (helperData, userMessage, conversationHistory) => {
  const helperName = helperData.name;
  
  const clarificationResponses = {
    1: `Absolutely! Let me break that down step-by-step. As your strategic marketing partner, I want to make sure you have a clear understanding of how to implement these concepts...`,
    2: `For sure! Let me explain that in more detail with some concrete examples you can use for your social media strategy...`,
    3: `Of course! Let me clarify that with some specific examples and show you exactly how to apply this in your content creation...`,
    4: `Definitely! Let me walk you through that process step-by-step so you can implement these email marketing strategies effectively...`,
    5: `Absolutely! Let me explain that advertising concept in more detail and show you exactly how to set it up for maximum ROI...`,
    6: `Great question! Let me clarify those analytics concepts and show you how to interpret and act on this data effectively...`,
    7: `Perfect question! Let me break down that lead generation strategy and show you exactly how to implement each step...`,
    8: `Excellent question! Let me clarify that growth strategy and provide you with a detailed implementation roadmap...`
  };
  
  return clarificationResponses[helperData.Id] || `Great question! Let me clarify that concept and provide you with a more detailed explanation...`;
};

// Generate varied responses to avoid repetition
const generateVariedResponse = (helperData, userMessage, conversationHistory, helperResponses) => {
  const alternatives = [
    `Let me approach this from a different angle and provide you with some fresh perspectives...`,
    `Here's another way to think about this challenge, with some new strategies you might not have considered...`,
    `I have some additional ideas that might be exactly what you're looking for...`,
    `Let me share some alternative approaches that could work well for your specific situation...`
const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
  return randomAlternative;
};

export const aiService = {
  async generateResponse(helperData, userMessage, conversationHistory = []) {
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

async processQuickAction(helperData, actionType, knowledgeBase = [], conversationHistory = []) {
    await delay(800 + Math.random() * 400);
    
    // Check if this action was recently used to provide varied responses
    const recentActions = conversationHistory
      .filter(msg => msg.role === 'assistant' && msg.content.includes(actionType))
      .slice(-2);
    
    const isRecentAction = recentActions.length > 0;
    
    const quickActionResponses = {
      1: { // MarketingMax
        'Create campaign strategy': isRecentAction ? 
          'Let me refine that campaign strategy further with some advanced tactics and implementation details...' :
          'Here\'s a comprehensive campaign strategy framework tailored to your business goals...',
        'Analyze competitors': isRecentAction ?
          'Building on that competitive analysis, here are some additional market positioning opportunities...' :
          'Let me provide a detailed competitive analysis with actionable insights...',
        'Market research': isRecentAction ?
          'Here\'s some additional market research focusing on emerging trends and opportunities...' :
          'Based on current market trends, here are the key findings for your industry...',
        'Growth planning': isRecentAction ?
          'Let me expand on that growth plan with specific tactics for the next phase of scaling...' :
          'Here\'s a strategic growth plan with specific milestones and tactics...'
      },
      2: { // SocialStevie
        'Create post ideas': isRecentAction ?
          'Here are some fresh, creative post ideas that build on our previous concepts...' :
          'Here are 10 engaging post ideas that will boost your social media presence...',
        'Plan content calendar': isRecentAction ?
          'Let me create an advanced content calendar with seasonal themes and trending topics...' :
          'Let me create a 30-day content calendar with optimal posting times...',
        'Write captions': isRecentAction ?
          'Here are some alternative caption styles and formats to diversify your content...' :
          'Here are some captivating captions that will increase engagement...',
        'Hashtag research': isRecentAction ?
          'I\'ve found some additional niche hashtags and trending opportunities for your content...' :
          'I\'ve found the best hashtags for your niche with high engagement potential...'
      },
      3: { // ContentCat
        'Write blog post': isRecentAction ?
          'Let me help you create another blog post with a different angle and fresh perspective...' :
          'Here\'s a complete blog post structure with engaging headlines and actionable content...',
        'Create email copy': isRecentAction ?
          'Here\'s some alternative email copy with different messaging strategies and approaches...' :
          'I\'ve crafted compelling email copy that will drive opens and clicks...',
        'Product descriptions': isRecentAction ?
          'Let me create some additional product descriptions focusing on different benefits and features...' :
          'Here are persuasive product descriptions that highlight benefits and drive sales...',
        'Landing page copy': isRecentAction ?
          'Here\'s some alternative landing page copy with different value propositions and calls-to-action...' :
          'I\'ve created conversion-focused landing page copy that speaks to your audience...'
      },
      4: { // EmailElla
        'Design email campaign': isRecentAction ?
          'Let me design another email campaign with different segmentation and personalization strategies...' :
          'Here\'s a comprehensive email campaign designed to nurture leads and drive conversions...',
        'Create automation': isRecentAction ?
          'Here\'s an advanced automation sequence that complements your existing email workflows...' :
          'I\'ve created a powerful automation sequence that will save you time and increase engagement...',
        'Write newsletters': isRecentAction ?
          'Here are some fresh newsletter ideas with different formats and content types...' :
          'Here\'s a compelling newsletter template that will keep your subscribers engaged...',
        'Segment audiences': isRecentAction ?
          'Let me show you some advanced segmentation strategies for better targeting...' :
          'Here\'s how to segment your email list for maximum engagement and conversions...'
      },
      5: { // AdsAnnie
        'Create ad copy': isRecentAction ?
          'Here\'s some alternative ad copy with different headlines and value propositions...' :
          'I\'ve created high-converting ad copy that will grab attention and drive clicks...',
        'Keyword research': isRecentAction ?
          'Here are some additional keyword opportunities and long-tail variations to consider...' :
          'I\'ve identified the best keywords for your campaigns with optimal search volume and competition...',
        'Campaign setup': isRecentAction ?
          'Let me help you set up an additional campaign with different targeting and bidding strategies...' :
          'Here\'s a complete campaign setup guide with optimized targeting and budget allocation...',
        'Ad optimization': isRecentAction ?
          'Here are some advanced optimization techniques to further improve your ad performance...' :
          'I\'ve identified key optimization opportunities to improve your ROI and reduce costs...'
      },
      6: { // DataDolly
        'Analyze performance': isRecentAction ?
          'Let me dive deeper into the performance data and identify additional optimization opportunities...' :
          'Here\'s a comprehensive performance analysis with actionable insights and recommendations...',
        'Create reports': isRecentAction ?
          'I\'ll create an additional report focusing on different metrics and KPIs...' :
          'I\'ve created a detailed report highlighting your key performance indicators and trends...',
        'Track ROI': isRecentAction ?
          'Here\'s an advanced ROI analysis with attribution modeling and lifetime value calculations...' :
          'Let me calculate your ROI across all channels and identify your most profitable investments...',
        'Identify trends': isRecentAction ?
          'I\'ve found some additional trends and patterns that could impact your future strategy...' :
          'Here are the key trends I\'ve identified in your data and what they mean for your business...'
      },
      7: { // LeadLucy
        'Create lead magnet': isRecentAction ?
          'Here\'s another lead magnet idea with a different format and value proposition...' :
          'I\'ve designed an irresistible lead magnet that will attract your ideal prospects...',
        'Design funnel': isRecentAction ?
          'Let me create an additional funnel with different touchpoints and conversion strategies...' :
          'Here\'s a high-converting sales funnel designed to guide prospects to purchase...',
        'Qualify leads': isRecentAction ?
          'Here are some advanced lead qualification techniques and scoring methods...' :
          'I\'ve created a lead scoring system to help you identify your most promising prospects...',
        'Nurture sequences': isRecentAction ?
          'Here\'s an additional nurture sequence for different segments of your audience...' :
          'I\'ve designed a nurture sequence that will build trust and guide leads toward conversion...'
      },
      8: { // GrowthGrace
        'Growth strategy': isRecentAction ?
          'Let me outline an additional growth strategy focusing on different market opportunities...' :
          'Here\'s a comprehensive growth strategy designed to scale your business systematically...',
        'Partnership ideas': isRecentAction ?
          'I\'ve identified some additional partnership opportunities in adjacent markets...' :
          'Here are strategic partnership opportunities that could accelerate your growth...',
        'Market expansion': isRecentAction ?
          'Let me explore additional market expansion opportunities with different entry strategies...' :
          'I\'ve analyzed potential markets for expansion and created an entry strategy...',
        'Scaling plan': isRecentAction ?
          'Here\'s an advanced scaling plan with different operational strategies and systems...' :
          'I\'ve created a systematic scaling plan that maintains quality while increasing capacity...'
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