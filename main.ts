import {ItemView, TFile, WorkspaceLeaf} from 'obsidian';
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

		selectEl.addEventListener('change', (event) => {
			const selectedTag = (event.target as HTMLSelectElement).value;
			this.displayNotesWithSelectedTag(selectedTag, selectEl);
		});
	}

	async displayNotesWithSelectedTag(tag: string, selectEl: HTMLSelectElement) {
		const notesWithTag = await this.getFilesWithTag(tag);

		// Clear previous results
		this.contentEl.empty();
		this.contentEl.appendChild(selectEl); // Re-append the selector

		for (const note of notesWithTag) {
			const noteContent = await this.app.vault.read(note);
			const preview = noteContent.slice(0, 100); // Adjust for desired preview length

			this.contentEl.createEl('div', {
				text: preview,
				attr: {
					style: `
                background-color: #f9f9f9;  /* Light background */
                border-radius: 5px;        /* Rounded border */
                padding: 10px;             /* Padding inside the card */
                margin-bottom: 10px;       /* Gap between cards */
                margin-top: 10px;       /* Gap between cards */
                border: 1px solid #e0e0e0; /* Optional border */
            `
				}
			});
		}
	}

	async getFilesWithTag(tag: string): Promise<TFile[]> {
		const allFiles = this.app.vault.getMarkdownFiles();
		const filesWithTag: TFile[] = [];

		allFiles.forEach(file => {
			const metadata = this.app.metadataCache.getFileCache(file);
			if (metadata && metadata.tags) {
				const tags = metadata.tags.map(t => (typeof t === 'string' ? t : t.tag));
				if (tags.includes(tag)) {
					filesWithTag.push(file);
				}
			}
		});

		return filesWithTag;
	}

}
