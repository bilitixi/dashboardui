import { useState } from 'react';

export function useReports() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (type: string) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    alert(`Report "${type}" generated successfully.`);
  };

  return { isGenerating, generateReport };
}
