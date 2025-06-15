'use client';

import { useState } from 'react';

interface SearchResult {
  candidateId: string;
  candidateName: string;
  industries: string[];
  skills: string[];
  score: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Candidate Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for candidates..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.candidateId}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{result.candidateName}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {result.industries.map((industry) => (
                  <span
                    key={industry}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {industry}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Relevance score: {(result.score * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {query && !isLoading && results.length === 0 && (
        <div className="text-center text-gray-500">
          No results found for your search.
        </div>
      )}
    </div>
  );
} 