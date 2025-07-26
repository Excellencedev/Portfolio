import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in modern web development technologies including React, TypeScript, Node.js, and various databases. I'm always learning new tools and frameworks to stay current with industry trends."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on complexity and scope. A simple website might take 1-2 weeks, while a full-stack application could take 4-8 weeks. I always provide detailed timelines during the planning phase."
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer: "Yes! I offer ongoing maintenance packages that include bug fixes, security updates, performance optimization, and feature enhancements. I believe in building long-term relationships with my clients."
    },
    {
      question: "What is your development process?",
      answer: "I follow an agile development approach: initial consultation and requirements gathering, design and planning, iterative development with regular check-ins, testing and quality assurance, deployment, and ongoing support."
    },
    {
      question: "Can you work with existing codebases?",
      answer: "Absolutely! I have experience working with legacy code, refactoring existing applications, adding new features to established projects, and migrating applications to modern technologies."
    },
    {
      question: "What are your rates and payment terms?",
      answer: "My rates vary based on project complexity and timeline. I offer both fixed-price projects and hourly rates. I typically require 50% upfront with the remainder upon completion. Let's discuss your specific needs!"
    }
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get answers to common questions about my services, process, and expertise.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="glass-card px-6 py-2 rounded-lg border-0"
            >
              <AccordionTrigger className="text-left hover:no-underline hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;