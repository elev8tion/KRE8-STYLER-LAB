'use client';

export interface SavedComponent {
  id: string;
  name: string;
  code: string;
  css: string;
  timestamp: Date;
  tags?: string[];
  thumbnail?: string;
}

class ComponentStorage {
  private readonly STORAGE_KEY = 'kre8_saved_components';

  // Get all saved components
  getComponents(): SavedComponent[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const components = JSON.parse(stored);
      return components.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp)
      }));
    } catch {
      return [];
    }
  }

  // Save a new component
  saveComponent(name: string, code: string, css: string, tags?: string[]): SavedComponent {
    const newComponent: SavedComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      code,
      css,
      timestamp: new Date(),
      tags
    };

    const components = this.getComponents();
    components.unshift(newComponent); // Add to beginning
    
    // Keep only last 50 components
    const toSave = components.slice(0, 50);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    
    return newComponent;
  }

  // Update an existing component
  updateComponent(id: string, updates: Partial<SavedComponent>): boolean {
    const components = this.getComponents();
    const index = components.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    components[index] = {
      ...components[index],
      ...updates,
      timestamp: new Date()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(components));
    return true;
  }

  // Delete a component
  deleteComponent(id: string): boolean {
    const components = this.getComponents();
    const filtered = components.filter(c => c.id !== id);
    
    if (filtered.length === components.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // Get a single component by ID
  getComponent(id: string): SavedComponent | null {
    const components = this.getComponents();
    return components.find(c => c.id === id) || null;
  }

  // Search components by name or tags
  searchComponents(query: string): SavedComponent[] {
    const components = this.getComponents();
    const lowercaseQuery = query.toLowerCase();
    
    return components.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) ||
      c.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Export components as JSON
  exportComponents(): string {
    const components = this.getComponents();
    return JSON.stringify(components, null, 2);
  }

  // Import components from JSON
  importComponents(json: string): boolean {
    try {
      const imported = JSON.parse(json);
      if (!Array.isArray(imported)) return false;
      
      const components = this.getComponents();
      const merged = [...imported, ...components];
      
      // Remove duplicates by ID
      const unique = merged.filter((c, i, arr) => 
        arr.findIndex(x => x.id === c.id) === i
      );
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unique.slice(0, 100)));
      return true;
    } catch {
      return false;
    }
  }

  // Clear all components
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const componentStorage = new ComponentStorage();