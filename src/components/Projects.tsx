import ProjectCard from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

// Import project images
import portfolioImg from '@/assets/project-portfolio-Uy77r_1w.jpg';
import taskManagerImg from '@/assets/project-taskmanager-DJHBzgrE.jpg';
import weatherImg from '@/assets/project-weather-CKnlu4rw.jpg';
import recipeImg from '@/assets/project-recipe-D4IgR8ce.jpg';
import expenseImg from '@/assets/project-expense-CxO9h3kP.jpg';

const Projects = () => {
  const projects = [
    {
      title: "Personal Portfolio",
      description: "A responsive portfolio website showcasing my projects and skills. Built with modern React, featuring smooth animations, dark/light mode toggle, and optimized performance.",
      image: portfolioImg,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      title: "Task Management App",
      description: "A fully functional task manager with priority levels, local storage, editing capabilities, and filtering. Features real-time stats and a clean, intuitive interface.",
      image: taskManagerImg,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
      liveUrl: "/projects/task-manager",
      githubUrl: "https://github.com/yourusername/task-manager"
    },
    {
      title: "Weather App",
      description: "A beautiful weather application with current conditions, 5-day forecast, geolocation support, and detailed weather metrics. Features responsive design and smooth animations.",
      image: weatherImg,
      technologies: ["React", "TypeScript", "Weather API", "Geolocation", "Tailwind CSS"],
      liveUrl: "/projects/weather-app",
      githubUrl: "https://github.com/yourusername/weather-app"
    },
    {
      title: "Recipe Finder",
      description: "A comprehensive recipe search application with ingredients-based search, advanced filtering, and detailed recipe views. Find recipes using ingredients you have at home, or search by cuisine, diet, and cooking preferences.",
      image: recipeImg,
      technologies: ["React", "TypeScript", "Spoonacular API", "Advanced Search", "Tailwind CSS"],
      liveUrl: "/projects/recipe-finder",
      githubUrl: "https://github.com/yourusername/recipe-finder"
    },
    {
      title: "Expense Tracker",
      description: "A comprehensive personal finance management application with transaction tracking, category analysis, monthly trends, and data export/import capabilities. Features real-time analytics and insights.",
      image: expenseImg,
      technologies: ["React", "TypeScript", "Local Storage", "Data Analytics", "Tailwind CSS"],
      liveUrl: "/projects/expense-tracker",
      githubUrl: "https://github.com/yourusername/expense-tracker"
    }
  ];

  return (
    <section id="projects" className="section-padding bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my recent work, demonstrating expertise in modern web technologies
            and delivering exceptional user experiences.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Want to see more projects? Check out my GitHub for additional work and contributions.
          </p>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/Excellencedev?tab=repositories" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2" size={20} />
              View All Projects
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;