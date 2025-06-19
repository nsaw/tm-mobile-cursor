import { useState } from "react";
import { ArrowLeft, Users, Share2, Download, Globe, Lock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useBins } from "@/hooks/use-bins";
import { useToast } from "@/hooks/use-toast";
import { socialSharingManager } from "@/lib/social-sharing";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";

export default function Collaborate() {
  const [, setLocation] = useLocation();
  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { data: bins = [] } = useBins();
  const { toast } = useToast();
  
  const [selectedBin, setSelectedBin] = useState<number | null>(null);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedThoughtmarks, setSelectedThoughtmarks] = useState<Set<number>>(new Set());

  const filteredThoughtmarks = selectedBin 
    ? thoughtmarks.filter(tm => tm.binId === selectedBin)
    : thoughtmarks;

  const toggleThoughtmarkSelection = (id: number) => {
    const newSelection = new Set(selectedThoughtmarks);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedThoughtmarks(newSelection);
  };

  const selectAllFromBin = () => {
    if (selectedBin) {
      const binThoughtmarks = thoughtmarks
        .filter(tm => tm.binId === selectedBin)
        .map(tm => tm.id);
      setSelectedThoughtmarks(new Set(binThoughtmarks));
    }
  };

  const clearSelection = () => {
    setSelectedThoughtmarks(new Set());
  };

  const handleExportCollection = async () => {
    const selectedTms = thoughtmarks.filter(tm => selectedThoughtmarks.has(tm.id));
    if (selectedTms.length === 0) {
      toast({
        title: "No thoughtmarks selected",
        description: "Please select thoughtmarks to export",
        variant: "destructive"
      });
      return;
    }

    const title = collectionTitle || `Thoughtmark Collection - ${new Date().toLocaleDateString()}`;
    const collaborationDoc = await socialSharingManager.exportForCollaboration(selectedTms, title);
    
    // Create and download file
    const blob = new Blob([collaborationDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Collection exported",
      description: `${selectedTms.length} thoughtmarks exported for collaboration`,
    });
  };

  const handleShareCollection = async () => {
    const selectedTms = thoughtmarks.filter(tm => selectedThoughtmarks.has(tm.id));
    if (selectedTms.length === 0) {
      toast({
        title: "No thoughtmarks selected",
        description: "Please select thoughtmarks to share",
        variant: "destructive"
      });
      return;
    }

    const title = collectionTitle || `Shared Thoughtmarks`;
    const shareText = await socialSharingManager.exportForCollaboration(selectedTms, title);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Collection copied and ready to share",
        });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard", 
        description: "Collection copied and ready to share",
      });
    }
  };

  const generateShareableLink = () => {
    const selectedTms = thoughtmarks.filter(tm => selectedThoughtmarks.has(tm.id));
    if (selectedTms.length === 0) return;

    const baseUrl = window.location.origin;
    const collectionData = {
      title: collectionTitle,
      description: collectionDescription,
      thoughtmarks: selectedTms.map(tm => ({
        title: tm.title,
        content: tm.content,
        tags: tm.tags,
        binName: tm.binName
      })),
      isPublic
    };
    
    const encodedData = btoa(JSON.stringify(collectionData));
    const shareUrl = `${baseUrl}/shared/${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: "Anyone with this link can view the collection",
    });
  };

  return (
    <div className="full-height bg-black text-white pb-24">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-wide">COLLABORATE</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Collection Setup */}
        <Card className="bg-gray-900 border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-[#C6D600]" />
            <h3 className="font-semibold">Create Collection</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm text-gray-300">Collection Title</Label>
              <Input
                id="title"
                value={collectionTitle}
                onChange={(e) => setCollectionTitle(e.target.value)}
                placeholder="My Thoughtmark Collection"
                className="bg-gray-800 border-gray-600 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm text-gray-300">Description (Optional)</Label>
              <Textarea
                id="description"
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                placeholder="Describe what this collection is about..."
                rows={3}
                className="bg-gray-800 border-gray-600 mt-1"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span className="text-sm">
                  {isPublic ? "Public Collection" : "Private Collection"}
                </span>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>
        </Card>

        {/* Bin Filter */}
        <Card className="bg-gray-900 border-gray-700 p-4">
          <h3 className="font-semibold mb-3">Select from Collection</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              onClick={() => setSelectedBin(null)}
              variant={selectedBin === null ? "default" : "outline"}
              className="text-sm"
            >
              All ({thoughtmarks.length})
            </Button>
            {bins.map(bin => (
              <Button
                key={bin.id}
                onClick={() => setSelectedBin(bin.id)}
                variant={selectedBin === bin.id ? "default" : "outline"}
                className="text-sm"
              >
                {bin.name} ({bin.thoughtmarkCount})
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={selectAllFromBin}
              variant="outline"
              size="sm"
              disabled={!selectedBin}
            >
              Select All
            </Button>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
            >
              Clear Selection
            </Button>
          </div>
        </Card>

        {/* Selection Summary */}
        {selectedThoughtmarks.size > 0 && (
          <Card className="bg-blue-950 border-blue-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">
                {selectedThoughtmarks.size} thoughtmark{selectedThoughtmarks.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={handleShareCollection}
                className="bg-[#C6D600] text-black hover:bg-[#C6D600]/90"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Collection
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleExportCollection}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                
                <Button
                  onClick={generateShareableLink}
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Link
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Thoughtmarks List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-300">
            Thoughtmarks {selectedBin && `from ${bins.find(b => b.id === selectedBin)?.name}`}
          </h3>
          
          {filteredThoughtmarks.map(thoughtmark => (
            <div
              key={thoughtmark.id}
              className={`relative ${
                selectedThoughtmarks.has(thoughtmark.id)
                  ? 'ring-2 ring-[#C6D600] ring-opacity-50'
                  : ''
              }`}
            >
              <div
                onClick={() => toggleThoughtmarkSelection(thoughtmark.id)}
                className="cursor-pointer"
              >
                <ThoughtmarkCard
                  thoughtmark={thoughtmark}
                  onClick={() => toggleThoughtmarkSelection(thoughtmark.id)}
                />
              </div>
              
              {selectedThoughtmarks.has(thoughtmark.id) && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-[#C6D600] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              )}
            </div>
          ))}
          
          {filteredThoughtmarks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No thoughtmarks found</p>
              <p className="text-sm">Create some thoughtmarks to start collaborating</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}