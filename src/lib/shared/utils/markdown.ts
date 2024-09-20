export const escapeMarkdown = (text: string) => {
  return text
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/\`/g, '\\`')
    .replace(/\./g, '\\.')
    .replace(/-/g, '\\-');
};
