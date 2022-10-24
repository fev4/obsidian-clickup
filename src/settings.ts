import { App, PluginSettingTab, Setting } from "obsidian";
import type ClickUpPlugin from "src";
import { getTokenPath } from "./token";

export class SettingsTab extends PluginSettingTab {
  private plugin: ClickUpPlugin;

  constructor(app: App, plugin: ClickUpPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "ClickUp Plugin Settings" });

    this.apiToken();
  }

  apiToken() {
    new Setting(this.containerEl)
      .setName("ClickUp API Key")
      .setDesc("Found in 'My Settings' > 'My Apps' > 'Apps' > Click Generate")
      .addTextArea(async (text) => {
        try {
          text.setValue(
            await this.app.vault.adapter.read(getTokenPath(this.app.vault))
          );
        } catch (e) {
          /* Throw away read error if file does not exist. */
        }
        text.setPlaceholder("Enter your API key").onChange(async (value) => {
          await this.app.vault.adapter.write(
            getTokenPath(this.app.vault),
            value
          );
        });
      });
  }
}
