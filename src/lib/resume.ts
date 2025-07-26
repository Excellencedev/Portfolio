import resumeFile from '@/assets/resume.png';

/**
 * Downloads the resume file with analytics tracking
 * @param source - The source component/section where download was initiated
 */
export const downloadResume = (source: string = 'Unknown') => {
  try {
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = 'Ademiluyi_Excellence_Resume.png';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download analytics if Google Analytics is available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'download', {
        event_category: 'Resume',
        event_label: source,
        value: 1
      });
    }
    
    // Track with other analytics if available
    if (typeof (window as any).plausible !== 'undefined') {
      (window as any).plausible('Resume Download', {
        props: { source }
      });
    }
    
    console.log(`Resume downloaded from: ${source}`);
    return true;
  } catch (error) {
    console.error('Error downloading resume:', error);
    
    // Fallback: open in new tab
    try {
      window.open(resumeFile, '_blank');
      return true;
    } catch (fallbackError) {
      console.error('Fallback download failed:', fallbackError);
      return false;
    }
  }
};

/**
 * Gets the resume file URL for preview purposes
 */
export const getResumeUrl = () => resumeFile;

/**
 * Gets resume metadata
 */
export const getResumeInfo = () => ({
  filename: 'Ademiluyi_Excellence_Resume.png',
  type: 'image/png',
  url: resumeFile,
  downloadName: 'Ademiluyi_Excellence_Resume.png'
});
