import assert from "node:assert/strict";
import test from "node:test";
import { comparePostsByRecentUpdate } from "./post-sort";

function post(id: string, published: string, updated?: string, pinned = false) {
	return {
		id,
		data: {
			published: new Date(published),
			updated: updated ? new Date(updated) : undefined,
			pinned,
		},
	};
}

test("pinned posts stay before newer unpinned posts", () => {
	const posts = [
		post("new", "2026-10-31"),
		post("pinned-old", "2020-01-01", undefined, true),
		post("pinned-updated", "2019-01-01", "2026-10-30", true),
	];
	assert.deepEqual(
		posts.sort(comparePostsByRecentUpdate).map((p) => p.id),
		["pinned-updated", "pinned-old", "new"],
	);
});

test("updated posts and new posts share the same descending date order", () => {
	const posts = [
		post("old", "2020-01-01"),
		post("new", "2026-10-30"),
		post("updated", "2019-01-01", "2026-10-31"),
	];
	assert.deepEqual(
		posts.sort(comparePostsByRecentUpdate).map((p) => p.id),
		["updated", "new", "old"],
	);
});

test("updated is used exactly when supplied, even if earlier than published", () => {
	const posts = [
		post("explicit", "2026-10-31", "2026-10-01"),
		post("fallback", "2026-10-20"),
	];
	assert.deepEqual(
		posts.sort(comparePostsByRecentUpdate).map((p) => p.id),
		["fallback", "explicit"],
	);
});

test("equal dates have deterministic order across repeated collection reads", () => {
	const posts = [
		post("b", "2026-01-01", "2026-10-31"),
		post("a", "2026-01-01", "2026-10-31"),
		post("new-publication", "2026-10-31"),
	];
	const expected = ["new-publication", "a", "b"];
	assert.deepEqual(
		[...posts].sort(comparePostsByRecentUpdate).map((p) => p.id),
		expected,
	);
	assert.deepEqual(
		[...posts]
			.reverse()
			.sort(comparePostsByRecentUpdate)
			.map((p) => p.id),
		expected,
	);
	assert.equal(comparePostsByRecentUpdate(posts[0], posts[0]), 0);
});
