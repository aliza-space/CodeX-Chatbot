/**
 * Normalizes informal text, common student typos, abbreviations,
 * and concatenated words for accurate NLP & RAG retrieval.
 */

const TYPO_MAP = [
  // Concatenated words & student slang
  [/\biam\b/gi, "i am"],
  [/\bijoin\b/gi, "i join"],
  [/\bcanijoin\b/gi, "can i join"],
  [/\bcanicome\b/gi, "can i come"],
  [/\bhowcani\b/gi, "how can i"],
  [/\bu\b/gi, "you"],
  [/\bur\b/gi, "your"],
  [/\br\b/gi, "are"],
  [/\bplz\b|\bpls\b/gi, "please"],
  [/\bintro\b/gi, "overview"],

  // Year abbreviations
  [/\b1st\s*yr\b|\b1styr\b|\bfirst\s*yr\b|\bfirst\s*year\b/gi, "1st year"],
  [/\b2nd\s*yr\b|\b2ndyr\b|\bsecond\s*yr\b|\bsecond\s*year\b/gi, "2nd year"],
  [/\b3rd\s*yr\b|\b3rdyr\b|\bthird\s*yr\b|\bthird\s*year\b/gi, "3rd year"],
  [/\b4th\s*yr\b|\b4thyr\b|\bfourth\s*yr\b|\bfinal\s*yr\b|\bfinal\s*year\b/gi, "4th year"],

  // Event and club typos
  [/\bcodex4\b|\bcdx4\b|\bcdx\s*4\b|\bcodex\s*4\b/gi, "codex 4.0"],
  [/\bcodex2\b|\bcdx2\b/gi, "codex 2.0"],
  [/\bcodex3\b|\bcdx3\b/gi, "codex 3.0"],
  [/\bgg\b|\bgalactic\b/gi, "galactic gamble"],
  [/\beligiblity\b|\belgibility\b|\belegibility\b|\belegible\b|\beligble\b/gi, "eligibility"],
  [/\bsponser\b|\bsponsers\b|\bsponsers\b/gi, "sponsors"],
  [/\bregistrtion\b|\breg\b|\bregistr\b/gi, "registration"],
  [/\bparticpate\b|\bpartcipate\b|\bparicipate\b/gi, "participate"],
  [/\bwiners\b|\bwho\s*won\b|\bwinnerz\b/gi, "winners"],
  [/\bcoord\b|\bcoordinater\b|\bcoordinators\b/gi, "coordinator"],
  [/\bcafetaria\b|\bcanten\b|\bcantin\b/gi, "cafeteria"],
  [/\blocation\b|\bvenue\b|\baddress\b|\bwhere\s*is\b/gi, "venue location"],
  [/\bprize\s*pool\b|\bprizes\b|\bcash\s*prize\b|\brewards\b/gi, "prizes"],
];

export function normalizeQuery(raw) {
  if (!raw) return "";
  let text = String(raw).trim();

  // Strip excessive repeated punctuation
  text = text.replace(/[?!.]{2,}/g, " ").replace(/\s+/g, " ");

  // Apply typo & slang mappings
  for (const [pattern, replacement] of TYPO_MAP) {
    text = text.replace(pattern, replacement);
  }

  return text.trim();
}
