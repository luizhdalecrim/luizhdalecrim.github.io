import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Briefcase, User2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Seu Nome</h1>
          <p className="text-xl md:text-2xl mb-8">Desenvolvedor Full Stack</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-white hover:text-blue-300 transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <User2 className="text-blue-600" size={24} />
            <h2 className="text-3xl font-bold">Sobre Mim</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sou um desenvolvedor apaixonado por criar soluções inovadoras e eficientes. 
            Com experiência em desenvolvimento web full stack, busco sempre aprender novas 
            tecnologias e aprimorar minhas habilidades.
          </p>
        </div>
      </section>

      {/* Habilidades Section */}
      <section id="habilidades" className="py-20 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Code2 className="text-blue-600" size={24} />
            <h2 className="text-3xl font-bold">Habilidades</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
              <div key={skill} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg">{skill}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos Section */}
      <section id="projetos" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="text-blue-600" size={24} />
            <h2 className="text-3xl font-bold">Projetos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((project) => (
              <div key={project} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600`}
                  alt={`Projeto ${project}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Projeto {project}</h3>
                  <p className="text-gray-600 mb-4">
                    Descrição breve do projeto e tecnologias utilizadas.
                  </p>
                  <div className="flex gap-2">
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Github size={16} />
                      Código
                    </a>
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={16} />
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-4">Entre em contato: seu.email@exemplo.com</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;