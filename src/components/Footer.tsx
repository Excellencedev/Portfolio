import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Excellencedev', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/excellence-ademiluyi-806243377/', label: 'LinkedIn' },
    { icon: Mail, href: '#contact', label: 'Email' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">
              Excellence Ademiluyi
            </h3>
            <p className="text-muted-foreground">
              Full-Stack Developer passionate about creating exceptional digital experiences 
              with modern technologies and clean code.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-muted-foreground"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Let's work together on your next project!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} Excellence Ademiluyi. 
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;