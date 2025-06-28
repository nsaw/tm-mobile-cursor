import type { Thoughtmark, Bin, ThoughtmarkWithBin, BinWithCount, InsertThoughtmark, InsertBin } from "@shared/schema";

const STORAGE_KEYS = {
  THOUGHTMARKS: 'thoughtmarks_local',
  BINS: 'bins_local',
  NEXT_ID: 'next_id_local'
};

interface LocalData {
  thoughtmarks: Thoughtmark[];
  bins: Bin[];
  nextThoughtmarkId: number;
  nextBinId: number;
}

class LocalStorageManager {
  private data: LocalData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): LocalData {
    try {
      const stored = localStorage.getItem('thoughtmarks_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load local data:', error);
    }

    // Initialize with default data
    const defaultData: LocalData = {
      thoughtmarks: [
        {
          id: 1,
          title: "Creative Awareness",
          content: "The universe is only as large as our perception of it. When we cultivate our awareness, we are expanding the universe. This expands the scope of what we have to work with and what can work through us.",
          tags: ["creativity", "awareness", "universe"],
          attachments: null,
          binId: 2, // Quotes bin
          userId: 0,
          isDeleted: false,
          deletedAt: null,
          embedding: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: "The Creative Process",
          content: "Creativity is not a talent. It is a way of operating. The artist's job is not to succumb to despair but to find an antidote for the emptiness of existence.",
          tags: ["creativity", "process", "art"],
          attachments: null,
          binId: 3, // Inspiration bin
          userId: 0,
          isDeleted: false,
          deletedAt: null,
          embedding: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      bins: [
        {
          id: 1,
          name: "Product Ideas",
          description: "Innovative concepts and business opportunities",
          color: "#C6D600",
          icon: "lightbulb",
          userId: 0,
          createdAt: new Date()
        },
        {
          id: 2,
          name: "Quotes",
          description: "Inspiring words and memorable sayings",
          color: "#00D9FF",
          icon: "quote",
          userId: 0,
          createdAt: new Date()
        },
        {
          id: 3,
          name: "Inspiration",
          description: "Ideas that spark creativity and motivation",
          color: "#FF6B6B",
          icon: "spark",
          userId: 0,
          createdAt: new Date()
        },
        {
          id: 4,
          name: "Circle Back",
          description: "Items to revisit and follow up on",
          color: "#4ECDC4",
          icon: "circle",
          userId: 0,
          createdAt: new Date()
        },
        {
          id: 5,
          name: "Revelations",
          description: "Breakthrough moments and insights",
          color: "#FFE66D",
          icon: "zap",
          userId: 0,
          createdAt: new Date()
        },
        {
          id: 6,
          name: "Sort Later",
          description: "Quick captures to organize later",
          color: "#95E1D3",
          icon: "folder",
          userId: 0,
          createdAt: new Date()
        }
      ],
      nextThoughtmarkId: 3,
      nextBinId: 7
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data?: LocalData): void {
    try {
      localStorage.setItem('thoughtmarks_data', JSON.stringify(data || this.data));
    } catch (error) {
      console.warn('Failed to save local data:', error);
    }
  }

  // Thoughtmark operations
  getThoughtmarks(): ThoughtmarkWithBin[] {
    return this.data.thoughtmarks.map(tm => ({
      ...tm,
      binName: this.data.bins.find(bin => bin.id === tm.binId)?.name
    }));
  }

  getThoughtmarksByBinId(binId: number): ThoughtmarkWithBin[] {
    return this.data.thoughtmarks
      .filter(tm => tm.binId === binId)
      .map(tm => ({
        ...tm,
        binName: this.data.bins.find(bin => bin.id === tm.binId)?.name
      }));
  }

  createThoughtmark(data: InsertThoughtmark): Thoughtmark {
    const thoughtmark: Thoughtmark = {
      id: this.data.nextThoughtmarkId++,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      binId: data.binId ?? null,
      userId: 0, // Guest user ID
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.data.thoughtmarks.push(thoughtmark);
    this.saveData();
    return thoughtmark;
  }

  updateThoughtmark(id: number, data: Partial<InsertThoughtmark>): Thoughtmark | null {
    const index = this.data.thoughtmarks.findIndex(tm => tm.id === id);
    if (index === -1) return null;

    this.data.thoughtmarks[index] = {
      ...this.data.thoughtmarks[index],
      ...data,
      updatedAt: new Date()
    };

    this.saveData();
    return this.data.thoughtmarks[index];
  }

  deleteThoughtmark(id: number): boolean {
    const index = this.data.thoughtmarks.findIndex(tm => tm.id === id);
    if (index === -1) return false;

    this.data.thoughtmarks[index].isDeleted = true;
    this.data.thoughtmarks[index].updatedAt = new Date();
    this.saveData();
    return true;
  }

  restoreThoughtmark(id: number): boolean {
    const index = this.data.thoughtmarks.findIndex(tm => tm.id === id);
    if (index === -1) return false;

    this.data.thoughtmarks[index].isDeleted = false;
    this.data.thoughtmarks[index].updatedAt = new Date();
    this.saveData();
    return true;
  }

  getDeletedThoughtmarks(): ThoughtmarkWithBin[] {
    return this.data.thoughtmarks
      .filter(tm => tm.isDeleted)
      .map(tm => ({
        ...tm,
        binName: this.data.bins.find(bin => bin.id === tm.binId)?.name
      }));
  }

  searchThoughtmarks(query: string, tags?: string[]): ThoughtmarkWithBin[] {
    const searchTerm = query.toLowerCase();
    return this.data.thoughtmarks
      .filter(tm => {
        if (tm.isDeleted) return false;
        
        const matchesQuery = tm.title.toLowerCase().includes(searchTerm) ||
                           tm.content.toLowerCase().includes(searchTerm);
        
        const matchesTags = !tags || tags.length === 0 || 
                          tags.some(tag => tm.tags?.includes(tag));
        
        return matchesQuery && matchesTags;
      })
      .map(tm => ({
        ...tm,
        binName: this.data.bins.find(bin => bin.id === tm.binId)?.name
      }));
  }

  // Bin operations
  getBins(): BinWithCount[] {
    return this.data.bins.map(bin => ({
      ...bin,
      thoughtmarkCount: this.data.thoughtmarks.filter(tm => 
        tm.binId === bin.id && !tm.isDeleted
      ).length
    }));
  }

  getBin(id: number): Bin | null {
    return this.data.bins.find(bin => bin.id === id) || null;
  }

  createBin(data: InsertBin): Bin {
    const bin: Bin = {
      id: this.data.nextBinId++,
      name: data.name,
      description: data.description || null,
      color: "#C6D600",
      icon: "folder",
      userId: 0, // Guest user ID
      createdAt: new Date()
    };

    this.data.bins.push(bin);
    this.saveData();
    return bin;
  }

  updateBin(id: number, data: Partial<InsertBin>): Bin | null {
    const index = this.data.bins.findIndex(bin => bin.id === id);
    if (index === -1) return null;

    this.data.bins[index] = {
      ...this.data.bins[index],
      ...data
    };

    this.saveData();
    return this.data.bins[index];
  }

  deleteBin(id: number): boolean {
    const index = this.data.bins.findIndex(bin => bin.id === id);
    if (index === -1) return false;

    // Move thoughtmarks to "Sort Later" bin (id: 1)
    this.data.thoughtmarks
      .filter(tm => tm.binId === id)
      .forEach(tm => {
        tm.binId = 1;
        tm.updatedAt = new Date();
      });

    this.data.bins.splice(index, 1);
    this.saveData();
    return true;
  }

  // Data export for premium upgrade
  exportData() {
    return {
      thoughtmarks: this.data.thoughtmarks.filter(tm => !tm.isDeleted),
      bins: this.data.bins
    };
  }

  // Clear all data (for logout)
  clearData(): void {
    localStorage.removeItem('thoughtmarks_data');
    this.data = this.loadData();
  }
}

export const localStorageManager = new LocalStorageManager();