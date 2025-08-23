'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, Library, Archive, Cog } from 'lucide-react';

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  color: string;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick, color }) => {
  return (
    <StyledTabButton $color={color} $active={isActive} onClick={onClick}>
      <button className="button">
        <span className="svgIcon">{icon}</span>
        <span className="buttonText">{label}</span>
      </button>
    </StyledTabButton>
  );
};

interface ExpandingVerticalTabsProps {
  activeTab: 'preview' | 'library' | 'saved' | 'settings';
  setActiveTab: (tab: 'preview' | 'library' | 'saved' | 'settings') => void;
}

const ExpandingVerticalTabs: React.FC<ExpandingVerticalTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'preview', icon: <Eye size={20} />, label: 'Preview', color: '#00ffcc' },
    { id: 'library', icon: <Library size={20} />, label: 'Library', color: '#ff00ff' },
    { id: 'saved', icon: <Archive size={20} />, label: 'Saved', color: '#00ff88' },
    { id: 'settings', icon: <Cog size={20} />, label: 'Settings', color: '#ff9900' }
  ];

  return (
    <Container>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          color={tab.color}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 12px;
  background: rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(0, 255, 204, 0.2);
  align-items: center;
  width: 90px;
  transition: all 0.3s ease;
`;

const StyledTabButton = styled.div<{ $color: string; $active: boolean }>`
  position: relative;
  
  .button {
    width: ${props => props.$active ? '70px' : '42px'};
    height: ${props => props.$active ? '70px' : '42px'};
    border-radius: ${props => props.$active ? '20px' : '50%'};
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.$color}33, ${props.$color}22)`
      : `linear-gradient(135deg, ${props.$color}22, ${props.$color}11)`
    };
    border: 1px solid ${props => props.$active ? props.$color : `${props.$color}44`};
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 0 20px ${props => props.$color}22,
      inset 0 0 20px ${props => props.$color}11,
      0 0 40px ${props => props.$active ? props.$color + '44' : 'transparent'};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
    font-family: 'Fira Code', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .svgIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: ${props => props.$color};
    filter: drop-shadow(0 0 3px ${props => props.$color});
    position: absolute;
    transform: ${props => props.$active ? 'translateY(-12px)' : 'translateY(0)'};
    scale: ${props => props.$active ? '0.9' : '1'};
  }

  .buttonText {
    position: absolute;
    color: ${props => props.$color};
    font-weight: 500;
    opacity: ${props => props.$active ? '1' : '0'};
    transform: ${props => props.$active ? 'translateY(10px)' : 'translateY(20px)'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    text-shadow: 0 0 10px ${props => props.$color}88;
    pointer-events: none;
    font-size: 9px;
  }

  .button:hover {
    ${props => !props.$active && `
      height: 70px;
      border-radius: 20px;
      background: linear-gradient(135deg, ${props.$color}33, ${props.$color}22);
      border-color: ${props.$color};
    `}
    box-shadow: 
      0 0 30px ${props => props.$color}44,
      inset 0 0 20px ${props => props.$color}22,
      0 0 60px ${props => props.$color}33;
  }

  .button:hover .svgIcon {
    ${props => !props.$active && `
      transform: translateY(-12px);
      scale: 0.9;
    `}
  }

  .button:hover .buttonText {
    ${props => !props.$active && `
      opacity: 1;
      transform: translateY(10px);
    `}
  }

  .button:active {
    scale: 0.95;
    box-shadow: 
      0 0 40px ${props => props.$color}66,
      inset 0 0 30px ${props => props.$color}33;
  }

  .button::before {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, transparent, ${props => props.$color}44, transparent);
    transition: top 0.5s;
  }

  .button:hover::before {
    top: 100%;
  }

  .button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, ${props => props.$color}11, transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .button:hover::after {
    opacity: 1;
  }
`;

export default ExpandingVerticalTabs;