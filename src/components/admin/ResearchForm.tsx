import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Save, Loader2, ExternalLink, FileText } from 'lucide-react';

interface ResearchFormProps {
  onSuccess?: () => void;
}

export function ResearchForm({ onSuccess }: ResearchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    research_url: '',
    meta_description: '',
    published: true
  });

  const [researchFile, setResearchFile] = useState<File | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file under 10MB",
          variant: "destructive",
        });
        return;
      }

      // Accept PDF, DOC, DOCX files
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF or Word document",
          variant: "destructive",
        });
        return;
      }

      setResearchFile(file);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!researchFile) return null;

    setIsUploading(true);
    try {
      const fileExt = researchFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('research')
        .upload(fileName, researchFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('research')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and description",
        variant: "destructive",
      });
      return;
    }

    if (!formData.research_url.trim() && !researchFile) {
      toast({
        title: "Missing research link or file",
        description: "Please provide either a research URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fileUrl = await uploadFile();
      const slug = generateSlug(formData.title);

      const { error } = await supabase.from('research').insert({
        title: formData.title,
        description: formData.description,
        research_url: formData.research_url || null,
        file_url: fileUrl,
        slug,
        published: formData.published,
        keywords,
        meta_description: formData.meta_description || null,
        published_at: formData.published ? new Date().toISOString() : null
      });

      if (error) throw error;

      toast({
        title: "Research added",
        description: "Your research has been successfully added",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        research_url: '',
        meta_description: '',
        published: true
      });
      setKeywords([]);
      setResearchFile(null);
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating research:', error);
      toast({
        title: "Error creating research",
        description: error.message || "Failed to create research",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <GlassCard className="p-8 m-lens">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold font-poppins text-momta-slate-light">
              Add New Research
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-momta-slate-light">
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter research title..."
                className="bg-momta-night-dark/50 border-momta-blue/20 text-momta-slate-light"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-momta-slate-light">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the research..."
                className="bg-momta-night-dark/50 border-momta-blue/20 text-momta-slate-light min-h-[150px]"
                required
              />
            </div>

            {/* Research URL */}
            <div className="space-y-2">
              <Label htmlFor="research_url" className="text-momta-slate-light">
                Research URL
              </Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-momta-slate-dark" />
                <Input
                  id="research_url"
                  type="url"
                  value={formData.research_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, research_url: e.target.value }))}
                  placeholder="https://example.com/research-paper"
                  className="bg-momta-night-dark/50 border-momta-blue/20 text-momta-slate-light pl-10"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-momta-slate-light">Research File (PDF, DOC, DOCX)</Label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-momta-night-dark/50 border border-momta-blue/20 rounded-lg text-momta-slate-light hover:bg-momta-night-dark/70 transition-colors">
                    <Upload className="w-4 h-4" />
                    Select File
                  </div>
                </label>
                {researchFile && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-momta-blue/10 border border-momta-blue/20 rounded-lg">
                    <FileText className="w-4 h-4 text-momta-blue-light" />
                    <span className="text-sm text-momta-slate-light">{researchFile.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="w-4 h-4 p-0 text-momta-slate-dark hover:text-red-400"
                      onClick={() => setResearchFile(null)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-momta-slate-dark">
                Provide either a research URL or upload a file (max 10MB)
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="meta_description" className="text-momta-slate-light">
                Meta Description (SEO)
              </Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="SEO description (160 characters max)..."
                className="bg-momta-night-dark/50 border-momta-blue/20 text-momta-slate-light"
                rows={2}
                maxLength={160}
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label className="text-momta-slate-light">Keywords</Label>
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Add keyword..."
                  className="bg-momta-night-dark/50 border-momta-blue/20 text-momta-slate-light"
                />
                <Button type="button" onClick={addKeyword} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {keyword}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published" className="text-momta-slate-light">
                Published
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading || isUploading}
              className="w-full gap-2"
            >
              {(isLoading || isUploading) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isUploading ? 'Uploading File...' : isLoading ? 'Adding...' : 'Add Research'}
            </Button>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  );
}