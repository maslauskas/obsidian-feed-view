import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Plugin } from 'obsidian';

export default class MyCustomViewPlugin extends Plugin {
	async onload() {
		this.registerView("my-custom-view", (leaf: WorkspaceLeaf) => new MyCustomView(leaf));

		// If you want to automatically open your view when the plugin is loaded:
		if (this.app.workspace.getLeavesOfType("my-custom-view").length === 0) {
			this.app.workspace.getRightLeaf(false).setViewState({
				type: "my-custom-view",
			});
		}
	}
}

class MyCustomView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return "my-custom-view";
	}

	getDisplayText(): string {
		return "My Custom View";
	}

	getIcon(): string {
		return "dice"; // You can use any available Obsidian icon name
	}

	async onOpen() {
		const allFiles = this.app.vault.getMarkdownFiles();
		const tagSet = new Set<string>();

		allFiles.forEach(file => {
			const metadata = this.app.metadataCache.getFileCache(file);
			if (metadata && metadata.tags) {
				metadata.tags.forEach(tag => {
					if (typeof tag === 'string') {
						tagSet.add(tag);
					} else if (tag.tag) {
						tagSet.add(tag.tag);
					}
				});
			}
		});

		const allTags = Array.from(tagSet);

		const selectEl = this.contentEl.createEl('select');

		allTags.forEach(tag => {
			const optionEl = selectEl.createEl('option', { text: tag });
			optionEl.value = tag;
		});
	}

}
