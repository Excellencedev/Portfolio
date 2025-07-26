import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Code, Database, Wrench, Cloud } from 'lucide-react';
import { downloadResume } from '@/lib/resume';

const About = () => {
  const handleDownloadResume = () => {
    downloadResume('About Section');
  };

  const skillCategories = [
    {
      title: "Frontend",
      icon: Code,
      skills: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS", "SASS", "JavaScript ES6+", "HTML5/CSS3"]
    },
    {
      title: "Backend", 
      icon: Database,
      skills: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Rust"]
    },
    {
      title: "Tools & DevOps",
      icon: Wrench,
      skills: ["Git", "Docker", "Webpack", "Vite", "Jest", "Cypress", "ESLint", "Prettier"]
    },
    {
      title: "Cloud & Deployment",
      icon: Cloud,
      skills: ["AWS", "Vercel", "Netlify", "Firebase", "Heroku", "DigitalOcean", "CI/CD", "Linux"]
    }
  ];

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* About Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="gradient-text">Me</span>
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I'm a passionate full-stack developer with over 5 years of experience creating 
                  innovative web solutions. My journey began with a Computer Science degree, but my 
                  real education came from building real-world applications and solving complex problems.
                </p>
                
                <p>
                  I specialize in modern JavaScript frameworks, particularly React and Node.js, 
                  and I'm always eager to learn new technologies. I believe in writing clean, 
                  maintainable code and creating user experiences that are both beautiful and functional.
                </p>
                
                <p>
                  When I'm not coding, you'll find me contributing to open-source projects, 
                  mentoring junior developers, or exploring the latest web technologies. 
                  I'm always excited to take on new challenges and collaborate with teams 
                  that share my passion for excellence.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" onClick={handleDownloadResume}>
                <Download className="mr-2" size={20} />
                Download Resume
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Let's Work Together
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary to-primary-glow p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-6xl font-bold gradient-text">
                    AE
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-glow/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Skills & <span className="gradient-text">Technologies</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="glass-card p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <category.icon className="text-primary" size={32} />
                </div>
                
                <h4 className="text-xl font-semibold mb-4 text-foreground">
                  {category.title}
                </h4>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;