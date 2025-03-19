// Mock data for local development

// Dashboard stats
export const dashboardStats = {
  total_calls: 120,
  calls_connected: 98,
  calls_dropped: 22,
  avg_duration: 245, // in seconds
  success_rate: 81.7 // percentage
};

// Conversation insights
export const conversationInsights = [
  {
    id: "conv-001",
    person_name: "Maria Garcia",
    sentiment: "Positive",
    summary: "Food aid received",
    duration_seconds: 272,
    flags: null,
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    feedback_type: "suggestion",
    impact: "low",
    supporting_quote: "I received all the food packages as promised."
  },
  {
    id: "conv-002",
    person_name: "Ahmed Hassan",
    sentiment: "Negative",
    summary: "Missing medical supplies",
    duration_seconds: 495,
    flags: "urgent",
    start_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    feedback_type: "complaint",
    impact: "high",
    supporting_quote: "I haven't received my medication for two weeks now."
  },
  {
    id: "conv-003",
    person_name: "Priya Sharma",
    sentiment: "Neutral",
    summary: "Partial education grant",
    duration_seconds: 723,
    flags: "follow-up",
    start_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    feedback_type: "pain_point",
    impact: "medium",
    supporting_quote: "I received part of the education grant, but not the full amount."
  },
  {
    id: "conv-004",
    person_name: "John Mwangi",
    sentiment: "Positive",
    summary: "Housing assistance",
    duration_seconds: 347,
    flags: null,
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    feedback_type: "suggestion",
    impact: "low",
    supporting_quote: "The housing assistance program has been very helpful for my family."
  }
];

// Conversation details
export const conversationDetails = [
  {
    conversation_id: "conv-001",
    transcript: "System: Hello, this is Sarah from Aid Relief. I'm calling to verify if you've received your food assistance package this month.\nUser: Hello, yes, this is Maria. Yes, I did receive the food package last week.\nSystem: That's great to hear. Did it contain all the items that were promised?\nUser: Yes, it had the rice, beans, cooking oil, and the fortified milk powder for the children.\nSystem: Excellent. And was the quality of the items satisfactory?\nUser: The quality was good. I received all the food packages as promised. The rice was especially good quality this time.\nSystem: I'm glad to hear that. Is there anything else you'd like to share about the food assistance program?\nUser: Well, it would be helpful if deliveries could be scheduled in advance so we know when to expect them.\nSystem: That's a good suggestion. I'll make note of that for our program coordinators. Is there anything else you need assistance with today?\nUser: No, that's all. Thank you for checking in.",
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 2 * 60 * 60 * 1000 + 272000).toISOString(),
    duration_seconds: 272,
    sentiment: "Positive",
    sentiment_quotes: ["I did receive the food package last week", "The quality was good", "The rice was especially good quality this time"],
    flags: null,
    flag_severity: null,
    flag_quotes: [],
    feedback_type: "suggestion",
    impact: "low",
    feedback_quotes: ["It would be helpful if deliveries could be scheduled in advance"],
    agent_name: "Sarah",
    topic: "Food Aid Verification",
    suggested_action: "Consider implementing a delivery notification system"
  },
  {
    conversation_id: "conv-002",
    transcript: "System: Hello, this is Michael from Health Partners. I'm calling to check on your medical supply delivery.\nUser: Hi, this is Ahmed. I've been waiting for my medication but haven't received anything yet.\nSystem: I'm sorry to hear that. According to our records, your diabetes medication should have been delivered two weeks ago.\nUser: Yes, that's right. I haven't received my medication for two weeks now. I've had to ration what I had left, and now I've run out completely.\nSystem: This is very concerning. I apologize for this serious oversight. Are you experiencing any health issues due to missing your medication?\nUser: My blood sugar levels have been unstable. I've been feeling dizzy and tired.\nSystem: This is an urgent matter that needs immediate attention. I'll escalate this right away to our medical team.\nUser: Please do. I can't afford to buy these medications on my own.\nSystem: I understand. We'll arrange for an emergency delivery today if possible. Would someone be available at your home to receive it?\nUser: Yes, I'll be home all day. Please make sure it comes today.",
    start_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 3 * 60 * 60 * 1000 + 495000).toISOString(),
    duration_seconds: 495,
    sentiment: "Negative",
    sentiment_quotes: ["I haven't received my medication for two weeks now", "My blood sugar levels have been unstable", "I've been feeling dizzy and tired"],
    flags: "urgent",
    flag_severity: "high",
    flag_quotes: ["I've had to ration what I had left, and now I've run out completely", "I can't afford to buy these medications on my own"],
    feedback_type: "complaint",
    impact: "high",
    feedback_quotes: ["Please make sure it comes today", "This is very concerning"],
    agent_name: "Michael",
    topic: "Medical Supply Verification",
    suggested_action: "Arrange emergency medication delivery and follow up with medical team"
  },
  {
    conversation_id: "conv-003",
    transcript: "System: Hello, this is Anita from Education First. I'm calling about your education grant verification.\nUser: Hi Anita, this is Priya speaking.\nSystem: Hi Priya, I wanted to check if you've received your education grant for this semester.\nUser: Well, I received some money, but I think it wasn't the full amount that was promised.\nSystem: I see. According to our records, you should have received 500 dollars for tuition and 200 dollars for books and supplies.\nUser: I received the 500 dollars for tuition, but not the book allowance.\nSystem: Thank you for letting me know. That's definitely an issue we need to resolve. When did you receive the tuition portion?\nUser: About two weeks ago. I received part of the education grant, but not the full amount. I've been waiting for the rest.\nSystem: I apologize for this oversight. I'll look into why the book allowance wasn't processed and get back to you within 48 hours.\nUser: That would be helpful. I need to purchase some required textbooks soon.\nSystem: I understand. Is there a particular deadline by which you need the funds?\nUser: My professor said we need the main textbook by next Monday.\nSystem: Noted. I'll make sure this gets expedited then.",
    start_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 5 * 60 * 60 * 1000 + 723000).toISOString(),
    duration_seconds: 723,
    sentiment: "Neutral",
    sentiment_quotes: ["I received some money", "I received the 500 dollars for tuition", "That would be helpful"],
    flags: "follow-up",
    flag_severity: "medium",
    flag_quotes: ["I think it wasn't the full amount that was promised", "I need to purchase some required textbooks soon"],
    feedback_type: "pain_point",
    impact: "medium",
    feedback_quotes: ["I received part of the education grant, but not the full amount", "I've been waiting for the rest"],
    agent_name: "Anita",
    topic: "Education Grant Verification",
    suggested_action: "Expedite book allowance payment and verify grant disbursement process"
  },
  {
    conversation_id: "conv-004",
    transcript: "System: Hello, this is David from Shelter Support. I'm calling to follow up on your housing assistance.\nUser: Hello David, this is John speaking.\nSystem: Hi John, I wanted to check how things are going with the housing assistance program you're enrolled in.\nUser: It's going very well. The housing assistance program has been very helpful for my family.\nSystem: That's wonderful to hear. Have you been receiving the monthly rent subsidy on time?\nUser: Yes, it comes right on schedule at the beginning of each month.\nSystem: Great. And has the landlord been cooperative with the program requirements?\nUser: Yes, no issues there. He understands the payment system now.\nSystem: Excellent. Is there anything about the program that could be improved from your perspective?\nUser: Well, it might be helpful to have some assistance with utility bills as well, especially during winter months.\nSystem: That's a good suggestion. We do have a separate program for utility assistance that you might qualify for. Would you like me to send you information about that?\nUser: Yes, that would be very helpful.\nSystem: I'll email that to you today. Is there anything else you need assistance with?\nUser: No, that's all for now. Thank you for checking in.",
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 24 * 60 * 60 * 1000 + 347000).toISOString(),
    duration_seconds: 347,
    sentiment: "Positive",
    sentiment_quotes: ["It's going very well", "The housing assistance program has been very helpful for my family", "It comes right on schedule"],
    flags: null,
    flag_severity: null,
    flag_quotes: [],
    feedback_type: "suggestion",
    impact: "low",
    feedback_quotes: ["It might be helpful to have some assistance with utility bills as well", "Especially during winter months"],
    agent_name: "David",
    topic: "Housing Assistance Verification",
    suggested_action: "Send utility assistance program information and consider program expansion"
  }
];

// Call metrics for charts
export const callMetrics = {
  daily: [
    { date: '2023-06-01', total: 42, connected: 35, dropped: 7 },
    { date: '2023-06-02', total: 38, connected: 33, dropped: 5 },
    { date: '2023-06-03', total: 45, connected: 40, dropped: 5 },
    { date: '2023-06-04', total: 32, connected: 28, dropped: 4 },
    { date: '2023-06-05', total: 48, connected: 42, dropped: 6 },
    { date: '2023-06-06', total: 52, connected: 45, dropped: 7 },
    { date: '2023-06-07', total: 41, connected: 36, dropped: 5 }
  ],
  weekly: [
    { week: 'Week 1', total: 280, connected: 245, dropped: 35 },
    { week: 'Week 2', total: 310, connected: 275, dropped: 35 },
    { week: 'Week 3', total: 290, connected: 260, dropped: 30 },
    { week: 'Week 4', total: 320, connected: 290, dropped: 30 }
  ],
  monthly: [
    { month: 'Jan', total: 1200, connected: 1050, dropped: 150 },
    { month: 'Feb', total: 1100, connected: 980, dropped: 120 },
    { month: 'Mar', total: 1300, connected: 1170, dropped: 130 },
    { month: 'Apr', total: 1250, connected: 1125, dropped: 125 },
    { month: 'May', total: 1400, connected: 1260, dropped: 140 },
    { month: 'Jun', total: 1200, connected: 1080, dropped: 120 }
  ]
};

// Add daily call volume data by month
export const dailyCallVolumeByMonth = {
  January: [42, 38, 45, 32, 48, 52, 41, 39, 47, 53, 49, 44, 38, 42, 46, 51, 47, 43, 39, 44, 50, 55, 48, 42, 38, 43, 47, 52, 49, 45, 41],
  February: [38, 42, 47, 35, 43, 49, 44, 40, 45, 50, 46, 41, 37, 43, 48, 53, 49, 44, 39, 45, 51, 56, 50, 45, 40, 46, 52, 48],
  March: [45, 41, 48, 36, 44, 50, 46, 42, 47, 52, 48, 43, 39, 45, 50, 55, 51, 46, 41, 47, 53, 58, 52, 47, 42, 48, 54, 50, 45, 41, 47],
  April: [40, 44, 49, 37, 45, 51, 47, 43, 48, 53, 49, 44, 40, 46, 51, 56, 52, 47, 42, 48, 54, 59, 53, 48, 43, 49, 55, 51, 46, 42],
  May: [43, 47, 52, 40, 48, 54, 50, 46, 51, 56, 52, 47, 43, 49, 54, 59, 55, 50, 45, 51, 57, 62, 56, 51, 46, 52, 58, 54, 49, 45, 51],
  June: [48, 44, 51, 39, 47, 53, 49, 45, 50, 55, 51, 46, 42, 48, 53, 58, 54, 49, 44, 50, 56, 61, 55, 50, 45, 51, 57, 53, 48, 44],
  July: [52, 48, 55, 43, 51, 57, 53, 49, 54, 59, 55, 50, 46, 52, 57, 62, 58, 53, 48, 54, 60, 65, 59, 54, 49, 55, 61, 57, 52, 48, 54],
  August: [50, 46, 53, 41, 49, 55, 51, 47, 52, 57, 53, 48, 44, 50, 55, 60, 56, 51, 46, 52, 58, 63, 57, 52, 47, 53, 59, 55, 50, 46, 52],
  September: [45, 41, 48, 36, 44, 50, 46, 42, 47, 52, 48, 43, 39, 45, 50, 55, 51, 46, 41, 47, 53, 58, 52, 47, 42, 48, 54, 50, 45, 41],
  October: [43, 39, 46, 34, 42, 48, 44, 40, 45, 50, 46, 41, 37, 43, 48, 53, 49, 44, 39, 45, 51, 56, 50, 45, 40, 46, 52, 48, 43, 39, 45],
  November: [40, 36, 43, 31, 39, 45, 41, 37, 42, 47, 43, 38, 34, 40, 45, 50, 46, 41, 36, 42, 48, 53, 47, 42, 37, 43, 49, 45, 40, 36],
  December: [38, 34, 41, 29, 37, 43, 39, 35, 40, 45, 41, 36, 32, 38, 43, 48, 44, 39, 34, 40, 46, 51, 45, 40, 35, 41, 47, 43, 38, 34, 40]
};

export const mockConversations = [
  {
    id: 1,
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    timestamp: "2024-03-15T10:30:00",
    sentiment: "positive",
    duration: "5m 30s",
    messages: [
      { role: "user", content: "Hi, I need help with my order" },
      { role: "bot", content: "Hello! I'd be happy to help with your order. Could you provide your order number?" }
    ]
  },
  {
    id: 2,
    userName: "Unknown User",
    userEmail: null,
    timestamp: "2024-03-15T11:45:00",
    sentiment: "neutral",
    duration: "3m 15s",
    messages: [
      { role: "user", content: "What are your business hours?" },
      { role: "bot", content: "We're open Monday through Friday, 9 AM to 6 PM EST." }
    ]
  }
];

export const mockAnalytics = {
  totalConversations: 150,
  averageDuration: "4m 20s",
  sentimentBreakdown: {
    positive: 45,
    neutral: 90,
    negative: 15
  },
  userTypes: {
    identified: 95,
    anonymous: 55
  }
}; 