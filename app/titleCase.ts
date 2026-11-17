
// Headings, card titles and button labels are title case: every word capitalised except
// short joining words in the middle ("How a Project Runs", "Start a Project"). Words that
// are already capitalised, numbers, emails and links are left as they are.
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "vs", "with"]);

export const titleCase = (text: string) => {
  const words = text.split(" ");
  return words
    .map((word, index) => {
      if (!word || /[@/]|\.\w/.test(word) || !/^[a-z]/.test(word)) return word;
      const inside = index > 0 && index < words.length - 1;
      return inside && SMALL_WORDS.has(word) ? word : word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};
