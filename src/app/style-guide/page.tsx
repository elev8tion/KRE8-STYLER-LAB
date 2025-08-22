'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import HolographicLoader from '@/components/HolographicLoader';
import HolographicBackground from '@/components/HolographicBackground';
import KRE8StylerLogo from '@/components/KRE8StylerLogo';
import AnimatedButton from '@/components/AnimatedButton';
import AnimatedInput from '@/components/AnimatedInput';
import AnimatedCard from '@/components/AnimatedCard';
import CyberCard from '@/components/CyberCard';
import { FiCpu, FiZap, FiSend, FiCode, FiLayers, FiBox, FiEdit3, FiTerminal } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Dynamically import the AI Component Editor
const AIComponentEditor = dynamic(() => import('@/components/editor/AIComponentEditor'), { 
  ssr: false,
  loading: () => <div className="text-cyan-400">Loading AI Editor...</div>
});

// Component Registry for tracking correlations
const componentRegistry = {
  'holo-bg': {
    name: 'Holographic Background',
    path: '@/components/HolographicBackground',
    description: 'Background wrapper with reduced opacity loader',
    usedIn: ['/claude-dashboard'],
    modifications: []
  },
  'cyber-card-horizontal': {
    name: 'Cyber Card (Horizontal)',
    path: '@/components/CyberCard',
    description: '3D hover effect card with cyber aesthetics',
    usedIn: ['/claude-dashboard'],
    modifications: []
  },
  'animated-btn-holo': {
    name: 'Animated Button (Holographic)',
    path: '@/components/AnimatedButton',
    description: 'Button with holographic gradient effect',
    usedIn: ['/claude-dashboard'],
    modifications: []
  }
};

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(135deg, #00A8C7 0%, #F13786 50%, #EE8B60 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-family: var(--font-orbitron);
  letter-spacing: 2px;
  text-shadow: 0 0 40px rgba(241, 55, 134, 0.3);
`;

const Section = styled.section`
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #00A8C7;
  margin-bottom: 2rem;
  font-family: var(--font-orbitron);
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    opacity: 0.7;
  }
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ComponentCard = styled.div`
  background: rgba(20, 20, 30, 0.8);
  border: 1px solid rgba(0, 168, 199, 0.3);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(0, 168, 199, 0.2);
    border-color: rgba(241, 55, 134, 0.5);
  }
`;

export default function StyleGuide() {
  const [activeSection, setActiveSection] = useState('editor');
  const [savedCode, setSavedCode] = useState('');
  const [showEditor, setShowEditor] = useState(true);

  const handleSaveCode = (code: string) => {
    setSavedCode(code);
    console.log('Code saved:', code);
    // Here you could save to localStorage or send to backend
  };

  return (
    <>
      <HolographicBackground />
      <Container>
        <Header>
          <Title>KRE8-Styler Component Lab</Title>
          <p style={{ color: '#a0a0a0', fontSize: '1.2rem' }}>
            AI-Powered Component Creation & Live Editing
          </p>
        </Header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-1">
            <button
              onClick={() => setActiveSection('editor')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeSection === 'editor'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiEdit3 className="inline mr-2" />
              AI Editor
            </button>
            <button
              onClick={() => setActiveSection('components')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeSection === 'components'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiLayers className="inline mr-2" />
              Components
            </button>
            <button
              onClick={() => setActiveSection('playground')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeSection === 'playground'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiTerminal className="inline mr-2" />
              Playground
            </button>
          </div>
        </div>

        {/* AI Component Editor Section */}
        {activeSection === 'editor' && (
          <Section>
            <SectionTitle>
              <FiCode /> AI Component Editor
            </SectionTitle>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AIComponentEditor
                initialCode={`// Welcome to KRE8-Styler AI Editor
// Ask AI to enhance your components!

export default function MyComponent() {
  return (
    <div className="p-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        Hello KRE8 World!
      </h2>
      <p className="text-white/90">
        Start typing or ask AI to help you build amazing components.
      </p>
    </div>
  );
}`}
                onSave={handleSaveCode}
                enableAI={true}
              />
            </motion.div>

            {savedCode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-gray-900/50 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 text-sm">✓ Component saved successfully!</p>
              </motion.div>
            )}
          </Section>
        )}

        {/* Components Showcase Section */}
        {activeSection === 'components' && (
          <Section>
            <SectionTitle>
              <FiLayers /> Component Library
            </SectionTitle>
            
            <ComponentGrid>
              {/* Logo Component */}
              <ComponentCard>
                <h3 style={{ color: '#F13786', marginBottom: '1rem' }}>KRE8 Logo</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <KRE8StylerLogo width={100} height={100} />
                </div>
                <code style={{ color: '#00A8C7', fontSize: '0.9rem' }}>
                  &lt;KRE8StylerLogo /&gt;
                </code>
              </ComponentCard>

              {/* Animated Button */}
              <ComponentCard>
                <h3 style={{ color: '#F13786', marginBottom: '1rem' }}>Animated Buttons</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <AnimatedButton variant="holographic">
                    <FiZap /> Holographic
                  </AnimatedButton>
                  <AnimatedButton variant="primary">
                    <FiCpu /> Primary Style
                  </AnimatedButton>
                  <AnimatedButton variant="secondary">
                    <FiSend /> Secondary Style
                  </AnimatedButton>
                </div>
              </ComponentCard>

              {/* Animated Input */}
              <ComponentCard>
                <h3 style={{ color: '#F13786', marginBottom: '1rem' }}>Animated Input</h3>
                <AnimatedInput 
                  placeholder="Type something..." 
                  icon={<FiCode />}
                />
              </ComponentCard>

              {/* Animated Card */}
              <ComponentCard>
                <h3 style={{ color: '#F13786', marginBottom: '1rem' }}>Animated Card</h3>
                <AnimatedCard
                  title="Feature Card"
                  description="Hover for 3D effect with gradient borders"
                  icon={<FiBox />}
                />
              </ComponentCard>

              {/* Cyber Card */}
              <ComponentCard>
                <h3 style={{ color: '#F13786', marginBottom: '1rem' }}>Cyber Card</h3>
                <CyberCard
                  title="Cyber Component"
                  stats={[
                    { label: 'Performance', value: '98%', color: '#00A8C7' },
                    { label: 'Efficiency', value: '95%', color: '#F13786' }
                  ]}
                />
              </ComponentCard>

              {/* Holographic Loader */}
              <ComponentCard>
                <h3 style={{ color: '#F13786', marginBottom: '1rem' }}>Holographic Loader</h3>
                <div style={{ height: '200px', position: 'relative' }}>
                  <HolographicLoader />
                </div>
              </ComponentCard>
            </ComponentGrid>
          </Section>
        )}

        {/* Playground Section */}
        {activeSection === 'playground' && (
          <Section>
            <SectionTitle>
              <FiTerminal /> Interactive Playground
            </SectionTitle>
            
            <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6">
              <p className="text-gray-400 mb-4">
                Test your components in an isolated environment with live hot-reload.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-cyan-400 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowEditor(!showEditor)}
                      className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 
                               rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all"
                    >
                      {showEditor ? 'Hide' : 'Show'} AI Editor
                    </button>
                    <button
                      className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 
                               rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all"
                    >
                      Import from GitHub
                    </button>
                    <button
                      className="w-full px-4 py-2 bg-green-500/20 border border-green-500/30 
                               rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
                    >
                      Export Component
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-cyan-400 mb-3">Component Templates</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300">🎨 Holographic Button</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300">💫 Animated Card</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300">🌟 Cyber Panel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Component Registry Info */}
        <Section>
          <SectionTitle>
            <FiBox /> Component Registry
          </SectionTitle>
          <div style={{ 
            background: 'rgba(20, 20, 30, 0.6)', 
            padding: '1.5rem', 
            borderRadius: '10px',
            border: '1px solid rgba(0, 168, 199, 0.2)'
          }}>
            <pre style={{ color: '#00A8C7', fontSize: '0.9rem', overflow: 'auto' }}>
              {JSON.stringify(componentRegistry, null, 2)}
            </pre>
          </div>
        </Section>
      </Container>
    </>
  );
}