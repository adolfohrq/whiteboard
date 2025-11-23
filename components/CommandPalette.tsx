import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import {
  FilePlus,
  Moon,
  Sun,
  Palette,
  CheckSquare,
  Type,
  Link as LinkIcon,
  Upload,
  FolderKanban,
  Columns,
  Layout,
  Cable,
  Sparkles,
  Home,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  commands: {
    heading: string;
    items: {
      id: string;
      label: string;
      icon: React.ReactNode;
      action: () => void;
    }[];
  }[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, commands }) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  return (
    <Command.Dialog open={isOpen} onOpenChange={setIsOpen} label="Command Menu">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {commands.map((group) => (
          <Command.Group key={group.heading} heading={group.heading}>
            {group.items.map((item) => (
              <Command.Item
                key={item.id}
                onSelect={() => {
                  item.action();
                  setIsOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
};
