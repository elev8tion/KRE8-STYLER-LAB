'use client';

import React from 'react';
import styled from 'styled-components';
import { 
  Minimize2, Zap, ArrowRightLeft, Save, Copy, Download, 
  Upload, Images, Code2
} from 'lucide-react';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  active?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, color = '#00ffcc', active = false }) => {
  const isLongLabel = label.length > 8;
  return (
    <StyledButton $color={color} $active={active} $longLabel={isLongLabel} onClick={onClick}>
      <button className="button">
        <span className="svgIcon">{icon}</span>
        <span className="buttonText">{label}</span>
      </button>
    </StyledButton>
  );
};

interface ExpandingHeaderActionsProps {
  toggleAllPanels: () => void;
  setAutoRun: (value: boolean) => void;
  convertComponent: () => void;
  saveComponent: () => void;
  copyToClipboard: () => void;
  exportComponents: () => void;
  importComponents: () => void;
  openGallery: () => void;
  openEditor: () => void;
  allPanelsCollapsed: boolean;
  autoRun: boolean;
}

const ExpandingHeaderActions: React.FC<ExpandingHeaderActionsProps> = ({
  toggleAllPanels,
  setAutoRun,
  convertComponent,
  saveComponent,
  copyToClipboard,
  exportComponents,
  importComponents,
  openGallery,
  openEditor,
  allPanelsCollapsed,
  autoRun,
}) => {
  const actions = [
    {
      icon: <Minimize2 size={16} />,
      label: 'Collapse All',
      onClick: toggleAllPanels,
      color: '#00ffcc',
      active: allPanelsCollapsed
    },
    {
      icon: <Zap size={16} />,
      label: 'Auto Run',
      onClick: () => setAutoRun(!autoRun),
      color: '#ffcc00',
      active: autoRun
    },
    {
      icon: <ArrowRightLeft size={16} />,
      label: 'Convert',
      onClick: convertComponent,
      color: '#ff00ff'
    },
    {
      icon: <Save size={16} />,
      label: 'Save',
      onClick: saveComponent,
      color: '#00ccff'
    },
    {
      icon: <Copy size={16} />,
      label: 'Copy',
      onClick: copyToClipboard,
      color: '#00ccff'
    },
    {
      icon: <Download size={16} />,
      label: 'Export',
      onClick: exportComponents,
      color: '#00ff88'
    },
    {
      icon: <Upload size={16} />,
      label: 'Import',
      onClick: importComponents,
      color: '#00ff88'
    },
    {
      icon: <Images size={16} />,
      label: 'Gallery',
      onClick: openGallery,
      color: '#ff6600'
    },
    {
      icon: <Code2 size={16} />,
      label: 'Editor',
      onClick: openEditor,
      color: '#ff00cc'
    }
  ];

  return (
    <Container>
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const StyledButton = styled.div<{ $color: string; $active?: boolean; $longLabel?: boolean }>`
  .button {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.$color}, ${props.$color}88)`
      : `linear-gradient(135deg, ${props.$color}22, ${props.$color}11)`
    };
    border: 1px solid ${props => props.$color}44;
    font-weight: 600;
    display: flex;
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
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .svgIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: ${props => props.$color};
    filter: drop-shadow(0 0 3px ${props => props.$color});
    position: absolute;
  }

  .buttonText {
    position: absolute;
    color: ${props => props.$color};
    font-weight: 500;
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    text-shadow: 0 0 10px ${props => props.$color}88;
    pointer-events: none;
  }

  .button:hover {
    width: ${props => props.$longLabel ? '145px' : '130px'};
    border-radius: 25px;
    background: linear-gradient(135deg, ${props => props.$color}33, ${props => props.$color}22);
    border-color: ${props => props.$color};
    box-shadow: 
      0 0 30px ${props => props.$color}44,
      inset 0 0 20px ${props => props.$color}22,
      0 0 60px ${props => props.$color}33;
  }

  .button:hover .svgIcon {
    transform: translateX(${props => props.$longLabel ? '-48px' : '-42px'});
    scale: 0.9;
  }

  .button:hover .buttonText {
    opacity: 1;
    transform: translateX(${props => props.$longLabel ? '12px' : '10px'});
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
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${props => props.$color}44, transparent);
    transition: left 0.5s;
  }

  .button:hover::before {
    left: 100%;
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

export default ExpandingHeaderActions;