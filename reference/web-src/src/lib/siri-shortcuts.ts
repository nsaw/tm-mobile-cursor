export interface ShortcutConfig {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export class SiriShortcutGenerator {
  private static baseURL = window.location.origin;

  static generateVoiceShortcutURL(): string {
    // Create a properly formatted iOS shortcut import URL
    const baseURL = this.baseURL;
    
    // Simple shortcut that works - just dictate and open URL
    const shortcutData = {
      "WFWorkflowActions": [
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.dictatetext",
          "WFWorkflowActionParameters": {
            "WFSpeechLanguage": "en-US"
          }
        },
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.urlencode"
        },
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.openurl",
          "WFWorkflowActionParameters": {
            "WFInput": `${baseURL}/?voice=PLACEHOLDER&siri=true`
          }
        }
      ],
      "WFWorkflowClientVersion": "2605.0.5",
      "WFWorkflowIcon": {
        "WFWorkflowIconStartColor": 4292311040,
        "WFWorkflowIconGlyphNumber": 59511
      },
      "WFWorkflowMinimumClientVersion": 900
    };

    try {
      const encoded = btoa(JSON.stringify(shortcutData));
      return `shortcuts://x-callback-url/import-workflow?url=${encodeURIComponent(`data:application/x-shortcut;base64,${encoded}`)}&name=${encodeURIComponent("Add to Thoughtmarks")}`;
    } catch (error) {
      return `shortcuts://create-shortcut`;
    }
  }

  static generateShortcutFile(): string {
    const baseURL = this.baseURL;
    const shortcut = {
      "WFWorkflowActions": [
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.dictatetext",
          "WFWorkflowActionParameters": {
            "WFSpeechLanguage": "en-US"
          }
        },
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.urlencode"
        },
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.openurl",
          "WFWorkflowActionParameters": {
            "WFInput": `${baseURL}/?voice=PLACEHOLDER&siri=true`
          }
        }
      ]
    };

    return JSON.stringify(shortcut, null, 2);
  }

  static getThoughtmarksShortcuts(): ShortcutConfig[] {
    return [
      {
        name: "Add to Thoughtmarks",
        url: `${this.baseURL}/?voice=true`,
        icon: "mic",
        color: "#C6D600"
      }
    ];
  }

  static installShortcut(config: ShortcutConfig): void {
    const shortcutURL = this.generateVoiceShortcutURL();
    window.open(shortcutURL, '_self');
  }

  static installAllShortcuts(): void {
    const shortcuts = this.getThoughtmarksShortcuts();
    if (shortcuts.length > 0) {
      this.installShortcut(shortcuts[0]);
    }
  }
}