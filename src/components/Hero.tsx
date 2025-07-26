import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import heroImage from '@/assets/hero-bg-B-STdH_T.jpg';
import { downloadResume } from '@/lib/resume';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const titles = ['Full-Stack Developer', 'React Specialist', 'Problem Solver', 'UI/UX Enthusiast'];
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownloadResume = () => {
    downloadResume('Hero Section');
  };

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentTitle.length) {
          setDisplayText(currentTitle.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentTitle.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, titleIndex, isDeleting, titles]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Hero background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80"></div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-glow/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-foreground">Hi, I'm</span>
            <span className="block gradient-text">Excellence Ademiluyi</span>
          </h1>
          
          <div className="text-2xl md:text-3xl text-muted-foreground mb-8 h-12 flex items-center justify-center">
            <span className="border-r-2 border-primary animate-pulse pr-1">
              {displayText}
            </span>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            I craft exceptional digital experiences with modern technologies. 
            Specializing in React, Node.js, and creating pixel-perfect, performant web applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="min-w-48"
            >
              View My Work
              <ChevronDown className="ml-2 animate-bounce" size={20} />
            </Button>
            
            <Button
              variant="glass"
              size="lg"
              onClick={handleDownloadResume}
              className="min-w-48"
            >
              <Download className="mr-2" size={20} />
              Download Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-muted-foreground" size={24} />
      </div>
    </section>
  );
};

export default Hero;