import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, ExternalLink, Maximize, Minimize } from 'lucide-react';

interface ProjectLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  githubUrl?: string;
  technologies?: string[];
  className?: string;
}

const ProjectLayout = ({
  children,
  title,
  description,
  githubUrl,
  technologies,
  className = "min-h-screen bg-background p-4"
}: ProjectLayoutProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={className}>
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Portfolio</span>
          </Link>

          {/* Project Info */}
          {(title || githubUrl) && (
            <div className="flex items-center gap-4">
              {title && (
                <div className="text-right">
                  <h1 className="text-xl font-bold text-foreground">{title}</h1>
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>

                {githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github size={16} />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Content */}
        <div className="relative">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-card rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">
              This is a live demo project
            </span>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} />
                  Portfolio
                </Button>
              </Link>
              {githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                    Source
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLayout;
