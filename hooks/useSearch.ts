import { useState, useEffect, useMemo } from 'react';
import { GroceryItem } from '../types';
import { COMPREHENSIVE_GROCERY_ITEMS } from '../data/groceryData';

// Search result interface
interface SearchResult {
  displayName: string;
  englishName: string;
  score: number;
  matchType: 'exact' | 'prefix' | 'substring' | 'regional';
  item: any;
}

// Helper function to convert string to sentence case
const toSentenceCase = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Simplified search function using static data
const performSearch = (query: string, limit: number = 10): SearchResult[] => {
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase().trim();

  // Skip if query is too short
  if (queryLower.length < 1) return results;

  console.log('Searching for:', queryLower);

  COMPREHENSIVE_GROCERY_ITEMS.forEach((item) => {
    let bestScore = 0;
    let bestMatchType: 'exact' | 'prefix' | 'substring' | 'regional' = 'substring';
    let bestDisplayName = item.name;
    let foundMatch = false;

    // Search in English name
    const englishName = item.name.toLowerCase();
    const englishScore = calculateMatchScore(queryLower, englishName);
    if (englishScore > 0) {
      bestScore = Math.max(bestScore, englishScore);
      bestMatchType = englishScore >= 100 ? 'exact' : englishScore >= 80 ? 'prefix' : 'substring';
      foundMatch = true;
      console.log('English match for', item.name, 'score:', englishScore);
    }

    // Search in regional names
    if (item.regionalNames && Array.isArray(item.regionalNames)) {
      item.regionalNames.forEach((regionalName: string) => {
        const regionalNameLower = regionalName.toLowerCase();
        const regionalScore = calculateMatchScore(queryLower, regionalNameLower);

        if (regionalScore > bestScore) {
          bestScore = regionalScore;
          bestMatchType = regionalScore >= 100 ? 'exact' : regionalScore >= 80 ? 'prefix' : 'regional';
          bestDisplayName = regionalName; // Use the matched regional name as display
          foundMatch = true;
          console.log('Regional match for', item.name, 'with regional name:', regionalName, 'score:', regionalScore);
        }
      });
    }

    // Search in keywords
    if (item.keywords && Array.isArray(item.keywords)) {
      item.keywords.forEach((keyword: string) => {
        const keywordLower = keyword.toLowerCase();
        const keywordScore = calculateMatchScore(queryLower, keywordLower);

        if (keywordScore > bestScore) {
          bestScore = keywordScore;
          bestMatchType = keywordScore >= 100 ? 'exact' : keywordScore >= 80 ? 'prefix' : 'substring';
          bestDisplayName = item.name; // Show English name for keyword matches
          foundMatch = true;
          console.log('Keyword match for', item.name, 'with keyword:', keyword, 'score:', keywordScore);
        }
      });
    }

    // If we found a match, add it to results
    if (foundMatch && bestScore > 0) {
      results.push({
        displayName: toSentenceCase(bestDisplayName),
        englishName: item.name,
        score: bestScore,
        matchType: bestMatchType,
        item: item
      });
      console.log('Added result:', {
        displayName: toSentenceCase(bestDisplayName),
        englishName: item.name,
        score: bestScore,
        matchType: bestMatchType
      });
    }
  });

  // Sort by score (highest first), remove duplicates by displayName, and limit to top results
  const uniqueResults = results
    .sort((a, b) => b.score - a.score)
    .filter((result, index, self) =>
      index === self.findIndex(r => r.displayName === result.displayName)
    )
    .slice(0, limit);

  console.log('Final results:', uniqueResults);
  return uniqueResults;
};

// Calculate match score based on query similarity
const calculateMatchScore = (query: string, target: string): number => {
  if (!query || !target) return 0;

  const queryWords = query.split(/\s+/).filter(word => word.length > 0);
  let totalScore = 0;

  // Multi-word query handling
  if (queryWords.length > 1) {
    // Check if all query words are present in target
    const allWordsPresent = queryWords.every(word =>
      target.includes(word)
    );

    if (!allWordsPresent) return 0;

    // Calculate score based on word order and proximity
    let score = 50; // Base score for multi-word match

    // Bonus for exact phrase match
    if (target.includes(query)) {
      score += 50;
    }

    // Bonus for words appearing in order
    const targetWords = target.split(/\s+/);
    let consecutiveWords = 0;
    let maxConsecutive = 0;

    for (let i = 0; i < targetWords.length; i++) {
      if (queryWords.some(qWord => targetWords[i].includes(qWord))) {
        consecutiveWords++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveWords);
      } else {
        consecutiveWords = 0;
      }
    }

    score += maxConsecutive * 10;
    return Math.min(score, 100);
  }

  // Single word query
  const queryWord = queryWords[0];

  // Exact match gets highest score
  if (target === queryWord) {
    return 100;
  }

  // Prefix match gets high score
  if (target.startsWith(queryWord)) {
    return 80 + (queryWord.length / target.length) * 15;
  }

  // Word boundary match (whole word within target)
  const wordBoundaryRegex = new RegExp(`\\b${queryWord}\\b`, 'i');
  if (wordBoundaryRegex.test(target)) {
    return 70 + (queryWord.length / target.length) * 20;
  }

  // Substring match
  if (target.includes(queryWord)) {
    const position = target.indexOf(queryWord);
    const positionBonus = position === 0 ? 20 : 10;
    const lengthRatio = queryWord.length / target.length;
    return 40 + positionBonus + (lengthRatio * 30);
  }

  // Fuzzy matching for typos (simple implementation)
  const levenshteinDistance = calculateLevenshteinDistance(queryWord, target);
  if (levenshteinDistance <= 2 && target.length >= 3) {
    return Math.max(20 - levenshteinDistance * 5, 5);
  }

  return 0;
};

// Simple Levenshtein distance for fuzzy matching
const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export const useSearch = (items: GroceryItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (text.length > 0) {
      // Use simplified search with static data
      const searchResults = performSearch(text, 10);
      console.log('Search query:', text);
      console.log('Search results:', searchResults);

      setSuggestions(searchResults.map((result: SearchResult) => result.displayName));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (selectedName: string) => {
    console.log('Selecting suggestion:', selectedName);
    setSearchQuery('');
    setShowSuggestions(false);

    // Find the item from static data
    for (const item of COMPREHENSIVE_GROCERY_ITEMS) {
      // If selected name matches English name, return the full item
      if (item.name.toLowerCase() === selectedName.toLowerCase()) {
        console.log('Found match by English name:', item);
        return item;
      }

      // If selected name matches a regional name, return the full item
      if (item.regionalNames && item.regionalNames.some((regional: string) =>
        regional.toLowerCase() === selectedName.toLowerCase()
      )) {
        console.log('Found match by regional name:', item);
        return item;
      }

      // Also check if the selected name matches any keyword
      if (item.keywords && item.keywords.some((keyword: string) =>
        keyword.toLowerCase() === selectedName.toLowerCase()
      )) {
        console.log('Found match by keyword:', item);
        return item;
      }
    }

    console.log('No match found, returning custom item');
    // If no match found, return a custom item object
    return {
      name: selectedName,
      category: 'Other',
      keywords: [],
      regionalNames: []
    };
  };

  const addCustomItem = () => {
    setShowSuggestions(false);
    return searchQuery;
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return {
    searchQuery,
    suggestions,
    showSuggestions,
    handleSearchChange,
    selectSuggestion,
    addCustomItem,
    clearSearch,
  };
};
