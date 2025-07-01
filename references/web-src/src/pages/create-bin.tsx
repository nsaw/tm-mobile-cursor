import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lightbulb } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBinSchema } from "@shared/schema";
import { z } from "zod";

const createBinSchema = insertBinSchema.extend({
  name: z.string().min(1, "Bin name is required"),
});

type CreateBinForm = z.infer<typeof createBinSchema>;

export default function CreateBin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");

  const form = useForm<CreateBinForm>({
    resolver: zodResolver(createBinSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createBinMutation = useMutation({
    mutationFn: async (data: CreateBinForm) => {
      const response = await apiRequest("POST", "/api/bins", data);
      if (!response.ok) {
        throw new Error("Failed to create bin");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Bin created successfully",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create bin",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateBinForm) => {
    createBinMutation.mutate(data);
  };

  const binSuggestions = [
    "Product Ideas",
    "Research Notes", 
    "Meeting Notes",
    "Daily Thoughts",
    "Project Planning",
    "Learning Resources",
    "Creative Inspiration",
    "Work Tasks",
    "Personal Goals",
    "Quick Notes"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    form.setValue("name", suggestion);
  };

  return (
    <PageLayout title="Create New Bin" showBackButton={true} showNewButton={false}>
      <div className="max-w-md mx-auto pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Bin Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter bin name..."
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#C6D600] focus:border-[#C6D600]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Describe what this bin is for..."
                      rows={3}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#C6D600] focus:border-[#C6D600] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bin Suggestions */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-[#C6D600]" />
                <span className="text-sm font-medium text-gray-300">Popular Bin Ideas</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {binSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      selectedSuggestion === suggestion
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
                className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBinMutation.isPending}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                {createBinMutation.isPending ? "Creating..." : "Create Bin"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
}