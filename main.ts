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
		// This method is called when your view is opened.
		// You can initialize your view content here.
		this.contentEl.setText("Hello from My Custom View!");
	}
}
