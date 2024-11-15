// src/utils/resume/exportUtils.ts
import { Experience, ExportFormat } from '@/types/experience';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateResume = async (
  experiences: Experience[],
  format: ExportFormat
): Promise<Blob | null> => {
  try {
    switch (format.type) {
      case 'pdf':
        return await generatePDF(experiences, format.template);
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

async function generatePDF(
  experiences: Experience[],
  template?: string
): Promise<Blob> {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title
  doc.setFontSize(24);
  doc.text('Professional Experience', 20, yPos);
  yPos += 15;

  // Add experiences
  doc.setFontSize(12);
  experiences.forEach((exp) => {
    // Company and Role
    doc.setFont('', 'bold');
    doc.text(`${exp.company} - ${exp.role}`, 20, yPos);
    yPos += 7;

    // Period and Location
    doc.setFont('', 'normal');
    doc.text(`${exp.period}${exp.location ? ` | ${exp.location}` : ''}`, 20, yPos);
    yPos += 7;

    // Description
    const descLines = doc.splitTextToSize(exp.description, 170);
    descLines.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 7;
    });

    // Achievements
    if (exp.achievements.length > 0) {
      yPos += 5;
      doc.setFont('', 'bold');
      doc.text('Key Achievements:', 20, yPos);
      yPos += 7;
      doc.setFont('', 'normal');
      exp.achievements.forEach((achievement) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`• ${achievement}`, 25, yPos);
        yPos += 7;
      });
    }

    // Technologies
    if (exp.technologies?.length) {
      yPos += 5;
      doc.setFont('', 'bold');
      doc.text('Technologies:', 20, yPos);
      yPos += 7;
      doc.setFont('', 'normal');
      const techText = exp.technologies.join(', ');
      const techLines = doc.splitTextToSize(techText, 170);
      techLines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 25, yPos);
        yPos += 7;
      });
    }

    yPos += 10;
  });

  return doc.output('blob');
}

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