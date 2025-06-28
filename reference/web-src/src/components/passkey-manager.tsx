import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Trash2, Smartphone, Laptop, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { simplePasskeyAuth } from "@/lib/passkeys-simple";
import { nativeIOSAuth } from "@/lib/native-ios-auth";

interface PasskeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

interface SavedPasskey {
  id: string;
  name: string;
  deviceType: 'phone' | 'laptop' | 'web';
  createdAt: Date;
}

export function PasskeyManager({ isOpen, onClose, userEmail }: PasskeyManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [savedPasskeys, setSavedPasskeys] = useState<SavedPasskey[]>([]);
  const { toast } = useToast();

  const getDeviceIcon = (type: 'phone' | 'laptop' | 'web') => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-4 h-4" />;
      case 'laptop':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const handleAddPasskey = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email is required to create a passkey",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    
    try {
      let result;
      
      if (nativeIOSAuth.isAvailable()) {
        // Use native iOS authentication
        result = await nativeIOSAuth.authenticateWithBiometric();
        if (result.success) {
          // Add to saved passkeys list
          const newPasskey: SavedPasskey = {
            id: Date.now().toString(),
            name: "iPhone",
            deviceType: 'phone',
            createdAt: new Date()
          };
          setSavedPasskeys(prev => [...prev, newPasskey]);
        }
      } else {
        // Use web passkey authentication
        result = await simplePasskeyAuth.setupPasskey(userEmail);
        if (result.success) {
          const newPasskey: SavedPasskey = {
            id: Date.now().toString(),
            name: "This browser",
            deviceType: 'web',
            createdAt: new Date()
          };
          setSavedPasskeys(prev => [...prev, newPasskey]);
        }
      }

      if (result.success) {
        toast({
          title: "Passkey Added",
          description: "Your passkey has been created successfully",
        });
      } else {
        toast({
          title: "Failed to Create Passkey",
          description: result.error || "The passkey could not be saved; please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Passkey Setup Failed",
        description: "Please try again and complete the biometric prompt when asked.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePasskey = (passkeyId: string) => {
    setSavedPasskeys(prev => prev.filter(p => p.id !== passkeyId));
    
    // Clear from storage
    if (nativeIOSAuth.isAvailable()) {
      // Native iOS handles removal automatically
    } else {
      simplePasskeyAuth.removePasskey();
    }
    
    toast({
      title: "Passkey Removed",
      description: "The passkey has been removed from your account",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <DialogTitle className="text-xl font-semibold text-white">
            Manage Passkeys
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-2">
            Use your device's built-in security features like Face ID to sign in instead of remembering passwords.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {savedPasskeys.length > 0 ? (
            <div className="space-y-3">
              {savedPasskeys.map((passkey) => (
                <div
                  key={passkey.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">
                      {getDeviceIcon(passkey.deviceType)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{passkey.name}</p>
                      <p className="text-xs text-gray-400">
                        Added {passkey.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePasskey(passkey.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No passkeys configured</p>
            </div>
          )}

          <Button
            onClick={handleAddPasskey}
            disabled={isAdding}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? "Adding passkey..." : "Add new passkey"}
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
        </div>

        {nativeIOSAuth.isAvailable() && (
          <div className="mt-4 p-3 bg-blue-950/30 border border-blue-800 rounded-lg">
            <p className="text-xs text-blue-300">
              Your biometric data is stored securely on your device using iOS Keychain. 
              Thoughtmarks never has access to your biometric information.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}