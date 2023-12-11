// This file is automatically generated by `gen_registry.py`

import { Registry, type Item } from "$cpt/window/window";
export const window_registry = new Registry();
export { Registry, type Item };

import dialog from "./Dialog.svelte";
import window from "./Window.svelte";

window_registry.register("welcome", dialog, {"content": "<h1>Welcome to Floppa OS!</h1>\n<p>This is my website. Welcome!</p>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat. Duis aute irure dolor in reprehenderit in voluptate\nvelit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint\noccaecat.</p>", "width": [120, 90], "title": "Welcome!"});
