/**
 * Suggests a title for a thoughtmark based on its body content
 * @param body - The body text of the thoughtmark
 * @param maxLength - Maximum length for the suggested title (default: 50)
 * @returns A suggested title string
 */
export function suggestTitleFromBody(body: string, maxLength: number = 50): string {
  if (!body || body.trim().length === 0) {
    return 'Untitled Thoughtmark';
  }

  // Clean the body text
  const cleanBody = body.trim().replace(/\s+/g, ' ');

  // Try to find a good title from the first sentence or phrase
  const sentences = cleanBody.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();

  if (firstSentence && firstSentence.length <= maxLength) {
    return firstSentence;
  }

  // If first sentence is too long, try to find a shorter phrase
  const words = cleanBody.split(' ');
  let title = '';
  
  for (const word of words) {
    const testTitle = title + (title ? ' ' : '') + word;
    if (testTitle.length <= maxLength) {
      title = testTitle;
    } else {
      break;
    }
  }

  // If we have a title, return it with proper capitalization
  if (title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Fallback: take first few characters
  return cleanBody.substring(0, maxLength - 3) + '...';
}

/**
 * Enhanced title suggestion that considers common patterns
 * @param body - The body text of the thoughtmark
 * @param maxLength - Maximum length for the suggested title (default: 50)
 * @returns A suggested title string
 */
export function suggestSmartTitleFromBody(body: string, maxLength: number = 50): string {
  if (!body || body.trim().length === 0) {
    return 'Untitled Thoughtmark';
  }

  const cleanBody = body.trim().replace(/\s+/g, ' ');

  // Look for common patterns that make good titles
  const patterns = [
    // Questions
    /^([^.!?]+\?)/,
    // Statements starting with "I need to", "I should", "I want to"
    /^(I (need to|should|want to|have to|must|will|am going to)[^.!?]+)/i,
    // Statements starting with action verbs
    /^((Remember|Check|Look|Find|Buy|Call|Email|Text|Visit|Research|Study|Learn|Practice|Create|Build|Fix|Update|Review|Plan|Schedule)[^.!?]+)/i,
    // Statements with "about" or "regarding"
    /^([^.!?]*(?:about|regarding|concerning|related to)[^.!?]+)/i,
  ];

  for (const pattern of patterns) {
    const match = cleanBody.match(pattern);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (candidate.length <= maxLength) {
        return candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  // Fallback to basic title suggestion
  return suggestTitleFromBody(body, maxLength);
} 