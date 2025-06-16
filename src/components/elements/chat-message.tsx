import React from 'react';

interface SearchResult {
  candidateId: string;
  candidateName: string;
  industries: string[];
  skills: string[];
  score: number;
}

interface ChatMessageType {
  id: string;
  role: 'user' | 'ai';
  content: string;
  results?: SearchResult[];
}

const ChatMessage: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  return (
    <div className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
      <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'} whitespace-pre-line`}>
        {message.content}
      </div>
      {message.role === 'ai' && message.results && (
        <div className="mt-2 space-y-3">
          {message.results.length > 0 ? (
            message.results.map((result) => (
              <div
                key={result.candidateId}
                className="p-3 border border-base-200 rounded-lg bg-base-100"
              >
                <h2 className="text-lg font-semibold mb-1">{result.candidateName}</h2>
                <div className="flex flex-wrap gap-2 mb-1">
                  {result.industries.map((industry) => (
                    <span
                      key={industry}
                      className="badge badge-outline"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge badge-info"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-xs text-base-content/60">
                  Relevance score: {(result.score * 100).toFixed(1)}%
                </div>
              </div>
            ))
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 