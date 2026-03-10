import { PdfReader } from 'pdfreader';

export async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let text = '';
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);
      if (!item) return resolve(text.trim()); // end of file
      if (item.text) text += beautifyPdfText(item.text) + ' ';
    });
  });
}

export function beautifyPdfText(raw: string): string {
  return (
    raw
      // 1. remove soft hyphen / zero-width spaces
      .replace(/[\u00AD\u200B]/g, '')
      // 2. collapse multi-space & fake new-lines that are only single-char splits
      .replace(/(?<!\.)\s*\n\s*(?![A-Z][a-z])/g, ' ')
      // 3. keep real paragraph breaks (blank line or line ends with ".")
      .replace(/(\.|\n)\s*\n\s*(?=[A-Z][ ]?[A-Z])/g, '$1\n\n')
      // 4. clean up phone numbers & e-mails that got spaces inserted
      .replace(
        /(\+91)\s*(\d)\s*(\d)\s*(\d)\s*(\d)\s*(\d)\s*(\d)\s*(\d)\s*(\d)\s*(\d)/g,
        '$1 $2$3$4$5$6$7$8$9$10'
      )
      .replace(/([a-z])\s+(@)\s+([a-z])/g, '$1$2$3')
      // 5. final whitespace hygiene
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
}
