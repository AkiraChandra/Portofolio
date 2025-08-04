// src/utils/resume/exportUtils.ts
import { Experience, ExportFormat } from '@/types/experience';
export const generateResume = async (
  experiences: Experience[],
  format: ExportFormat
): Promise<Blob | null> => {
  try {
    switch (format.type) {
      case 'docx':
        return await generateDOCX(experiences);
      case 'txt':
        return generateTXT(experiences);
      default:
        throw new Error(`Unsupported format: ${format.type}`);
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    return null;
  }
};

async function generateDOCX(experiences: Experience[]): Promise<Blob> {
  // Implement DOCX generation
  // You might want to use a library like docx-templates
  throw new Error('DOCX generation not implemented');
}

function generateTXT(experiences: Experience[]): Blob {
  let content = 'PROFESSIONAL EXPERIENCE\n\n';

  experiences.forEach((exp) => {
    content += `${exp.company} - ${exp.role}\n`;
    content += `${exp.period}${exp.location ? ` | ${exp.location}` : ''}\n\n`;
    content += `${exp.description}\n\n`;

    if (exp.achievements.length > 0) {
      content += 'Key Achievements:\n';
      exp.achievements.forEach((achievement) => {
        content += `• ${achievement}\n`;
      });
      content += '\n';
    }

    if (exp.technologies?.length) {
      content += `Technologies: ${exp.technologies.join(', ')}\n\n`;
    }

    content += '-------------------\n\n';
  });

  return new Blob([content], { type: 'text/plain' });
}

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};