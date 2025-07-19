"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Mail, MapPin, ExternalLink, Github, Linkedin, Download, Menu, X, Code, Rocket, Brain, TrendingUp, Calendar } from 'lucide-react';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const projects = [
    {
      title: "NeuTalks — Real-time Emotion Recognition",
      description: "Developed a real-time emotion recognition system using a CNN model trained on the FER2013 dataset to classify facial expressions into seven emotion categories.",
      tech: ["Python", "TensorFlow", "Flask", "ReactJS", "TailwindCSS"],
      role: "Integrated the model with a Flask backend API, handling image processing and model inference.",
      challenges: "Designed an interactive frontend in ReactJS with TailwindCSS for live webcam capture, emotion feedback, and chatbot interaction.",
      icon: <Brain className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "DeFi — Cryptocurrency Tracker",
      description: "Built a responsive web application that fetches and displays real-time cryptocurrency prices, market trends, and historical data visualizations.",
      tech: ["ReactJS", "CoinGecko API", "TailwindCSS"],
      role: "Integrated with public crypto APIs (e.g., CoinGecko or CoinMarketCap) to fetch live data on top-performing coins, price fluctuations, and market cap.",
      challenges: "Ensuring real-time data updates and responsive design across all devices.",
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Bank DBMS — Desktop Banking Application",
      description: "Developed a desktop banking application with a user-friendly GUI using PySimpleGUI for efficient interface design.",
      tech: ["Python", "PySimpleGUI", "MySQL"],
      role: "Implemented core banking features including account creation, deposit/withdrawal, and balance inquiry.",
      challenges: "Integrated with a MySQL database to manage customer records and transaction logs with proper relational schema design.",
      icon: <Code className="w-6 h-6" />,
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "WebOn — Responsive Web Application",
      description: "Implemented a responsive and user-friendly interface with ReactJS and TailwindCSS, ensuring seamless performance across devices.",
      tech: ["ReactJS", "TailwindCSS"],
      role: "Focused on clean code practices and modular component design for maintainability and scalability.",
      challenges: "Creating a fully responsive design that works perfectly across all device sizes.",
      icon: <Rocket className="w-6 h-6" />,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const skills = {
    "Languages": ["Python", "Java", "C++", "JavaScript"],
    "Web Technologies": ["ReactJS", "Next.js", "Node.js", "Express.js", "Flask"],
    "Database": ["MySQL", "PostgreSQL"],
    "Tools": ["Git", "GitHub", "VS Code", "Sanity CMS"],
    "Other": ["Domain Management", "TensorFlow", "TailwindCSS", "PySimpleGUI"]
  };

  const experience = [
    {
      role: "Web Developer Trainee",
      company: "Truliyo Digital",
      period: "Jan 2025 – Present",
      location: "Gurugram, India",
      responsibilities: [
        "Engineered dynamic, interactive web applications using Next.js with server-side rendering and real-time content updates through Sanity CMS integration",
        "Implemented dynamic domain routing and automated email configuration systems to support multi-tenant website architectures",
        "Integrated Google APIs (Google Sheets and Google Drive) to automate job application management—storing applicant data in Sheets and uploading resumes to Drive folders organized by job titles"
      ]
    },
    {
      role: "Software Developer Intern",
      company: "CyberInfomines",
      period: "Oct 2024 – Jan 2025",
      responsibilities: [
        "Developed and debugged dynamic internal applications featuring real-time data processing, interactive dashboards, and automated system integrations",
        "Researched and implemented emerging web technologies and modern development practices to enhance application performance, user interactivity, and scalable architecture solutions"
      ]
    },
    {
      role: "Web Developer Intern",
      company: "OffBeatTrips",
      period: "Dec 2023 – Mar 2024",
      responsibilities: [
        "Developed and maintained dynamic customer-facing website with interactive booking features, real-time content management, and responsive design optimizations",
        "Engineered internal operational system with automated workflow processing, dynamic data visualization, and integrated performance monitoring to streamline business operations",
        "Awarded Intern of the Month in January 2024 for outstanding contributions and dedication"
      ]
    }
  ];

  const blogPosts = [
    "Building NeuTalks: Real-time Emotion Recognition with Deep Learning",
    "My Journey: From College Debugging Champion to Industry Intern",
    "Integrating Google APIs: Automating Job Application Management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NG
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'projects', 'skills', 'experience', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-colors duration-200 hover:text-blue-400 ${
                    activeSection === item ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['home', 'about', 'projects', 'skills', 'experience', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="capitalize block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md w-full text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 ${isVisible.home ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Naman Gupta</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8 text-xl sm:text-2xl text-gray-300">
              <Rocket className="w-6 h-6 text-blue-400" />
              <span>Software Engineer</span>
              <span>|</span>
              <span>Web Developer</span>
              <span>|</span>
              <span>Tech Enthusiast</span>
            </div>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Passionate about building responsive, user-centric applications. A quick learner and team player, always eager to upgrade my skill set and contribute effectively to collaborative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                View My Work
              </button>
              <button className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I'm a passionate software engineer specializing in modern web technologies. Currently pursuing my Bachelor of Technology in Computer Science and Technology at JB Knowledge Park, Faridabad, and working as a Web Developer Trainee at Truliyo Digital.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                With hands-on experience in building dynamic web applications using Next.js, React.js, and Node.js, I love creating responsive, user-centric solutions. My recent achievements include being awarded "Intern of the Month" at Off Beat Trips and securing 2nd position in a college-level debugging competition.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm always eager to learn new technologies and contribute to innovative projects that make a real impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.projects ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              Featured <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((project, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.gradient} flex items-center justify-center mb-6`}>
                    {project.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="bg-gray-700 text-xs px-2 py-1 rounded">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Key Features:</h4>
                    <p className="text-sm text-gray-300">{project.role}</p>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Implementation:</h4>
                    <p className="text-sm text-gray-300">{project.challenges}</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
                      <Github className="w-4 h-4" />
                      GitHub
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.skills ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              Skills & <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Tools</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(skills).map(([category, skillList], index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-blue-400">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, i) => (
                      <span key={i} className="bg-gray-700 text-sm px-3 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.experience ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Experience</span>
            </h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{exp.role}</h3>
                      <p className="text-blue-400 font-semibold">{exp.company}</p>
                      {exp.location && <p className="text-gray-400 text-sm">{exp.location}</p>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mt-2 sm:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{exp.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
            Blog & <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Insights</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="font-semibold mb-2">{post}</h3>
                <p className="text-sm text-gray-400">Coming soon...</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              Contact <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <p className="text-lg text-gray-300 mb-8">
                I'm always open to collaborations, freelance projects, or just a chat about tech!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>namangupta2360@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>New Delhi, India</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Contact Form
                </button>
                <button className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-400">
            © 2025 Naman Gupta · Built with Next.js & ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;