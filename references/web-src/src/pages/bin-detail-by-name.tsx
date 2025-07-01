import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBins } from "@/hooks/use-bins";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import type { ThoughtmarkWithBin } from "@shared/schema";

export default function BinDetailByName() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Extract bin name from URL
  const currentPath = window.location.pathname;
  const binName = currentPath.split('/bin/')[1]?.replace(/-/g, ' ');
  const formattedBinName = binName?.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const { data: bins = [] } = useBins();
  const { data: thoughtmarks = [] } = useThoughtmarks();

  // Find the bin by name
  const bin = bins.find(b => b.name.toLowerCase() === formattedBinName?.toLowerCase());
  
  // Get thoughtmarks for this bin
  const binThoughtmarks = thoughtmarks.filter(t => 
    t.binId === bin?.id && !t.isDeleted
  );

  // Filter thoughtmarks based on search
  const filteredThoughtmarks = binThoughtmarks.filter(thoughtmark =>
    thoughtmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thoughtmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thoughtmark.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="full-height bg-black text-white flex items-center justify-center">
        <p>Please sign in to view bins</p>
      </div>
    );
  }

  if (!bin) {
    return (
      <div className="full-height bg-black text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-title text-white">Bin Not Found</h1>
          </div>
          <p className="text-gray-400 mb-4">The bin "{formattedBinName}" could not be found.</p>
          <Button onClick={() => setLocation("/")}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="full-height bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-title text-white">{bin.name}</h1>
            {bin.description && (
              <p className="text-sm text-gray-400 mt-1">{bin.description}</p>
            )}
          </div>
          <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {binThoughtmarks.length}
          </span>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search in ${bin.name}...`}
          />
        </div>

        {/* Add Thoughtmark Button */}
        <div className="mb-6">
          <Button
            onClick={() => setLocation(`/create?bin=${bin.id}`)}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 hover:border-[#C6D600] py-3 rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to {bin.name}
          </Button>
        </div>

        {/* Thoughtmarks */}
        <div className="space-y-3">
          {filteredThoughtmarks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {searchQuery ? 'No thoughtmarks match your search.' : `No thoughtmarks in ${bin.name} yet.`}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setLocation(`/create?bin=${bin.id}`)}
                  variant="outline"
                  className="border-[#C6D600] text-[#C6D600] hover:bg-[#C6D600] hover:text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Thoughtmark
                </Button>
              )}
            </div>
          ) : (
            filteredThoughtmarks.map((thoughtmark) => (
              <ThoughtmarkCard
                key={thoughtmark.id}
                thoughtmark={thoughtmark}
                onClick={() => setLocation(`/thoughtmarks/${thoughtmark.id}`)}
                enableSwipeDelete={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}