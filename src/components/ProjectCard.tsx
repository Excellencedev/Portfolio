import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Eye } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const ProjectCard = ({ 
  title, 
  description, 
  image, 
  technologies, 
  liveUrl, 
  githubUrl, 
  featured = false 
}: ProjectCardProps) => {
  return (
    <div className={`group relative overflow-hidden rounded-lg glass-card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${featured ? 'md:col-span-2' : ''}`}>
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className={`w-full ${featured ? 'h-48 md:h-64' : 'h-48 md:h-56'} object-cover transition-transform duration-500 group-hover:scale-110`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-3">
            {liveUrl && (
              <Button variant="hero" size="sm" asChild>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <Eye size={16} />
                  Live Demo
                </a>
              </Button>
            )}
            {githubUrl && (
              <Button variant="glass" size="sm" asChild>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github size={16} />
                  Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {liveUrl && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
                Live Demo
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={16} />
                Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;