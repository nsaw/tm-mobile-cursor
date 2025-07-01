import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PersistentLayout } from "@/components/persistent-layout";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What are Thoughtmarks and how do they help me?",
        answer: "Thoughtmarks are mental bookmarks that let you capture thoughts quickly without breaking your focus. When you're in flow state but have an idea, create a thoughtmark to revisit later rather than getting distracted immediately."
      },
      {
        question: "Do I need to create an account?",
        answer: "No! You can use Thoughtmarks as a guest to try all basic features. Creating an account enables cross-device sync and premium AI features, but it's completely optional."
      },
      {
        question: "How does voice recording work?",
        answer: "Tap the red mic button in the bottom navigation to record voice notes. Your browser will transcribe speech to text automatically. This works on most modern browsers and mobile devices."
      }
    ]
  },
  {
    category: "Voice Features",
    questions: [
      {
        question: "Can I use Siri to add thoughtmarks?",
        answer: "Yes! On iOS, add Thoughtmarks to your home screen as a web app, then use 'Hey Siri, add thoughtmark' to quickly record voice notes."
      },
      {
        question: "What if speech recognition doesn't work?",
        answer: "Speech recognition requires microphone permissions and works best in Chrome and Safari. If it's not available, you can still record audio and type manually."
      },
      {
        question: "Are my voice recordings stored?",
        answer: "No, we only keep the transcribed text. Audio recordings are processed locally in your browser and not saved to our servers."
      }
    ]
  },
  {
    category: "Organization",
    questions: [
      {
        question: "How do bins and tags work?",
        answer: "Bins are like folders for organizing thoughtmarks by project or area. Tags are labels that help you find related thoughts across different bins. Use both for powerful organization."
      },
      {
        question: "What is the 'Sort Later' bin?",
        answer: "This is the default bin for voice notes and quick captures. It's designed for thoughts you want to organize properly later when you have more time and focus."
      },
      {
        question: "Can I change how thoughtmarks are organized?",
        answer: "Yes! You can move thoughtmarks between bins, add/remove tags, and use the search and filter features to find exactly what you need."
      }
    ]
  },
  {
    category: "AI Features",
    questions: [
      {
        question: "What AI features are available?",
        answer: "Premium users get AI-powered thoughtmark summaries, connection discovery between ideas, and personalized content recommendations for books, podcasts, and articles."
      },
      {
        question: "How does the AI understand my thoughts?",
        answer: "Our AI analyzes the content and tags of your thoughtmarks to identify patterns, themes, and connections you might not notice. It suggests related content to help you explore ideas deeper."
      },
      {
        question: "Is my data used to train AI models?",
        answer: "No, your personal thoughtmarks are never used for training. AI analysis happens privately for your account only, and your data remains completely private."
      }
    ]
  },
  {
    category: "Privacy & Data",
    questions: [
      {
        question: "How is my data protected?",
        answer: "All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal thoughtmarks with third parties."
      },
      {
        question: "Can I export my data?",
        answer: "Yes, you can export all your thoughtmarks as JSON or markdown files from the settings page. You own your data and can take it with you anytime."
      },
      {
        question: "What happens if I delete my account?",
        answer: "All your data is permanently deleted within 30 days. We provide a final export opportunity before deletion is complete."
      }
    ]
  }
];

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            FAQ
          </h1>
          <p className="text-gray-400">Frequently asked questions</p>
        </div>

        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            Everything you need to know about using Thoughtmarks to stay focused 
            and capture your best ideas.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqs.map((category, categoryIndex) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold text-[#C6D600] mb-4">
                {category.category}
              </h2>
              
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`;
                  const isExpanded = expandedItems.has(itemId);
                  
                  return (
                    <Card key={itemId} className="bg-gray-900 border-gray-700">
                      <button
                        onClick={() => toggleExpanded(itemId)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                      >
                        <span className="font-medium pr-4">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-to-br from-blue-950 to-gray-900 border-blue-700 p-6 mt-8">
          <h3 className="font-semibold mb-2 text-[#C6D600]">Still have questions?</h3>
          <p className="text-gray-300 text-sm mb-4">
            We're here to help you get the most out of Thoughtmarks.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => { window.location.href = "/about"; }}
              variant="outline"
              className="w-full text-sm"
            >
              Learn More About Thoughtmarks
            </Button>
            <Button
              onClick={() => { window.location.href = "/"; }}
              className="w-full bg-[#C6D600] text-black hover:bg-[#C6D600]/90 text-sm"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </PersistentLayout>
  );
}