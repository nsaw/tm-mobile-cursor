import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, Package, Smartphone, FileCode, Database, Palette, Archive } from 'lucide-react';
import { triggerExport, downloadExport, getExportStatus, type ExportResult } from '@/lib/fileHelpers';

interface ExportStatus {
  isRunning: boolean;
  lastExport?: Date;
  availableDownloads: string[];
}

export default function AdminExports() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    isRunning: false,
    availableDownloads: [],
  });
  const [activeExport, setActiveExport] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadExportStatus();
  }, []);

  const loadExportStatus = async () => {
    try {
      const status = await getExportStatus();
      setExportStatus(status);
    } catch (error) {
      console.error('Failed to load export status:', error);
    }
  };

  const handleExport = async (type: 'swiftui' | 'full' | 'assets' | 'react-native') => {
    setActiveExport(type);
    setExportResult(null);
    setProgress(0);

    try {
      const result = await triggerExport(type, (progressInfo) => {
        setProgress(progressInfo.progress);
      });

      setExportResult(result);
      if (result.success) {
        await loadExportStatus();
      }
    } catch (error) {
      setExportResult({
        success: false,
        message: error instanceof Error ? error.message : 'Export failed',
      });
    } finally {
      setActiveExport(null);
      setProgress(0);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      await downloadExport(filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const exportTypes = [
    {
      id: 'react-native' as const,
      title: 'React Native/Expo App',
      description: 'Cross-platform mobile app for iOS and Android',
      icon: <Smartphone className="w-6 h-6" />,
      features: [
        'Expo Router with tab navigation',
        'TypeScript configuration',
        'React Query API integration',
        'Secure authentication flow',
        'Dark theme optimized for mobile',
        'EAS build configuration'
      ],
      color: 'bg-cyan-500'
    },
    {
      id: 'swiftui' as const,
      title: 'SwiftUI App Export',
      description: 'Complete iOS SwiftUI project ready for Xcode',
      icon: <Smartphone className="w-6 h-6" />,
      features: [
        'SwiftUI views for all pages',
        'App.swift with navigation structure',
        'Info.plist with permissions',
        'Launch screen configuration',
        'Localization bundles',
        'XcodeGen project file'
      ],
      color: 'bg-blue-500'
    },
    {
      id: 'full' as const,
      title: 'Complete Export Package',
      description: 'Full application export with web, mobile, and documentation',
      icon: <Package className="w-6 h-6" />,
      features: [
        'Web application source code',
        'React Native/Expo mobile app',
        'SwiftUI project files',
        'API documentation',
        'Database schema export',
        'Deployment configurations'
      ],
      color: 'bg-purple-500'
    },
    {
      id: 'assets' as const,
      title: 'Design Assets Only',
      description: 'UI assets, icons, and design tokens for external use',
      icon: <Palette className="w-6 h-6" />,
      features: [
        'App icons (all sizes)',
        'Design tokens (colors, spacing)',
        'Screenshots for App Store',
        'Component style guide',
        'Brand assets package',
        'Figma import files'
      ],
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-black dark:via-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-border/20 bg-card/40 dark:bg-card/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="default"
                onClick={() => window.history.back()}
                className="h-10 px-4 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Settings
              </Button>
              <div className="h-6 w-px bg-border/50 dark:bg-gray-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-foreground dark:text-white mb-1">Admin Export Suite</h1>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Generate React Native, iOS SwiftUI apps, and export application assets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Card */}
        <Card className="section-gap card-standard bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground dark:text-white">
              <Database className="w-5 h-5" />
              <span>Export Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2">Status</p>
                <Badge 
                  variant={exportStatus.isRunning ? "default" : "secondary"}
                  className={`px-3 py-1 text-sm font-medium ${
                    exportStatus.isRunning 
                      ? "bg-green-600 hover:bg-green-700 text-white border-green-500" 
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                  }`}
                >
                  {exportStatus.isRunning ? "Running" : "Ready"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Last Export</p>
                <p className="text-sm text-foreground dark:text-gray-300">
                  {exportStatus.lastExport
                    ? new Date(exportStatus.lastExport).toLocaleDateString()
                    : "Never"
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Available Downloads</p>
                <p className="text-sm text-foreground dark:text-gray-300">{exportStatus.availableDownloads.length} files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Progress */}
        {activeExport && (
          <Alert className="mb-8">
            <FileCode className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Exporting {activeExport}...</p>
                <Progress value={progress} className="w-full" />
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Export Result */}
        {exportResult && (
          <Alert className={`mb-8 ${exportResult.success ? 'border-green-500' : 'border-red-500'}`}>
            <AlertDescription>
              {exportResult.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Export Types */}
        <div className="layout-stack section-gap">
          {exportTypes.map((exportType) => (
            <Card key={exportType.id} className="card-standard relative overflow-hidden bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50 hover:border-border/40 dark:hover:border-gray-600/70 transition-all duration-200">
              <div className={`absolute top-0 left-0 w-full h-1 ${exportType.color}`} />
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-foreground dark:text-white">
                  <div className={`p-2 rounded-lg ${exportType.color} text-white shadow-lg`}>
                    {exportType.icon}
                  </div>
                  <span>{exportType.title}</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-gray-400">{exportType.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {exportType.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground dark:text-gray-400 flex items-center">
                      <div className="w-1.5 h-1.5 bg-current rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleExport(exportType.id)}
                  disabled={activeExport !== null || exportStatus.isRunning}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg disabled:opacity-50 transition-all duration-200"
                >
                  {activeExport === exportType.id ? 'Exporting...' : 'Start Export'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Downloads */}
        {exportStatus.availableDownloads.length > 0 && (
          <Card className="section-gap card-standard bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground dark:text-white">
                <Archive className="w-5 h-5" />
                <span>Available Downloads</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Previously generated exports ready for download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportStatus.availableDownloads.map((filename) => (
                  <div
                    key={filename}
                    className="flex items-center justify-between p-4 border border-border/30 dark:border-gray-700/50 rounded-lg bg-card/30 dark:bg-card/20 backdrop-blur-sm hover:bg-card/50 dark:hover:bg-card/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Archive className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
                      <span className="font-medium text-foreground dark:text-gray-200">{filename}</span>
                    </div>
                    <Button
                      size="default"
                      variant="outline"
                      onClick={() => handleDownload(filename)}
                      className="h-10 px-4 font-medium border-border/50 dark:border-gray-600 hover:bg-card/50 dark:hover:bg-card/40 transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}