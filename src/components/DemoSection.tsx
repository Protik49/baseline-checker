import React from 'react';
import { Code, Palette, Zap, Copy } from 'lucide-react';

interface DemoSectionProps {
  onCodeSelect: (code: string) => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({ onCodeSelect }) => {
  const demoSnippets = [
    {
      title: 'Modern CSS Grid',
      icon: Palette,
      description: 'CSS Grid with container queries and aspect ratio',
      code: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  aspect-ratio: 16/9;
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    padding: 2rem;
    border-radius: 1rem;
  }
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
}`,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Modern JavaScript',
      icon: Code,
      description: 'Async/await, fetch API, and ES modules',
      code: `// Modern JavaScript with async/await and fetch
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    
    // Destructuring and optional chaining
    const { name, email, preferences = {} } = userData;
    const theme = preferences?.ui?.theme ?? 'light';
    
    // Array methods and template literals
    const notifications = userData.notifications
      ?.filter(n => !n.read)
      ?.map(n => ({ ...n, timestamp: new Date(n.created) }));
    
    return { name, email, theme, notifications };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('User data unavailable');
  }
};

// Top-level await and dynamic imports
const userModule = await import('./user-utils.js');
const currentUser = await fetchUserData('123');`,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Advanced HTML',
      icon: Zap,
      description: 'Modern HTML with web components and forms',
      code: `<!-- Modern HTML with web components and advanced forms -->
<dialog id="user-modal" class="modal">
  <form method="dialog" class="modal-form">
    <h2>User Registration</h2>
    
    <input type="email" name="email" required 
           placeholder="Enter your email"
           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$">
    
    <input type="url" name="website" 
           placeholder="Your website (optional)">
    
    <input type="tel" name="phone" 
           placeholder="Phone number"
           pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
    
    <input type="date" name="birthdate" required>
    
    <input type="range" name="experience" 
           min="1" max="10" value="5">
    
    <datalist id="skills">
      <option value="JavaScript">
      <option value="TypeScript">
      <option value="React">
    </datalist>
    
    <button type="submit">Register</button>
  </form>
</dialog>

<my-custom-element data-theme="dark">
  <template shadowrootmode="open">
    <style>
      :host { display: block; }
      .content { padding: 1rem; }
    </style>
    <div class="content">
      <slot></slot>
    </div>
  </template>
  <p>This is a custom element with shadow DOM!</p>
</my-custom-element>`,
      gradient: 'from-violet-500 to-pink-600'
    }
  ];

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/5 via-violet-500/5 to-blue-500/5 rounded-3xl blur-xl"></div>
      
      <div className="relative glass rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Sample Code</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click any example below to see the Baseline analysis in action. 
              Each snippet demonstrates different modern web features.
            </p>
          </div>
          
          {/* Demo Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {demoSnippets.map((snippet, index) => {
              const IconComponent = snippet.icon;
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${snippet.gradient} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative bg-white/50 border-2 border-gray-200/50 rounded-2xl p-6 transition-all duration-300">
                    
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${snippet.gradient} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{snippet.title}</h3>
                        <p className="text-sm text-gray-600">{snippet.description}</p>
                      </div>
                    </div>
                    
                    {/* Code Preview */}
                    <div className="bg-gray-900 rounded-xl p-4 mb-4 overflow-hidden">
                      <pre className="text-xs text-gray-300 code-editor leading-relaxed overflow-hidden">
                        {snippet.code.split('\n').slice(0, 8).join('\n')}
                        {snippet.code.split('\n').length > 8 && '\n...'}
                      </pre>
                    </div>
                    
                    {/* Action */}
                    <button
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${snippet.gradient} text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCodeSelect(snippet.code);
                      }}
                    >
                      <Zap size={16} />
                      <span>Try Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-violet-300 rounded-2xl border border-violet-500/30">
              <Zap size={16} />
              <span className="font-medium">Ready to check your own code? Scroll up to get started!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default DemoSection;