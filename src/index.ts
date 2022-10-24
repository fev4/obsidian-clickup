import {
    ItemView,
    Platform,
    Plugin,
    WorkspaceLeaf,
} from "obsidian";
import { SettingsTab } from "./settings";

import DiceRoller from "./ui/DiceRoller.svelte";

const VIEW_TYPE = "svelte-view";

// Remember to rename these classes and interfaces!

interface ObsidianClickUpOptions {
    clickUpApiKey: string;
}

const DEFAULT_SETTINGS: ObsidianClickUpOptions = {
    clickUpApiKey: "",
};

class MySvelteView extends ItemView {
    view: DiceRoller;

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Dice Roller";
    }

    getIcon(): string {
        return "dice";
    }

    async onOpen(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.view = new DiceRoller({
            target: (this as any).contentEl,
            props: {},
        });
    }
}

export default class ClickUpPlugin extends Plugin {
    private view: MySvelteView;
    settings: ObsidianClickUpOptions;

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => (this.view = new MySvelteView(leaf))
        );

        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

        // This creates an icon in the left ribbon.
        this.addRibbonIcon("checkmark", "Obsidian ClickUp", (evt: MouseEvent) =>
            this.openMapView()
        );

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: "open-sample-modal-simple",
            name: "Open sample modal (simple)",
            callback: () => this.openMapView(),
        });
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SettingsTab(this.app, this));
    }

    onLayoutReady(): void {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE,
        });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async openMapView() {
        const workspace = this.app.workspace;
        workspace.detachLeavesOfType(VIEW_TYPE);
        const leaf = workspace.getLeaf(
            // @ts-ignore
            !Platform.isMobile
        );
        await leaf.setViewState({ type: VIEW_TYPE });
        workspace.revealLeaf(leaf);
    }
}

