type SortablePost = {
	id: string;
	data: {
		published: Date;
		updated?: Date;
		pinned?: boolean;
	};
};

/** 置顶优先，其次按 updated（未设置时用 published）倒序。 */
export function comparePostsByRecentUpdate(
	a: SortablePost,
	b: SortablePost,
): number {
	return (
		Number(!!b.data.pinned) - Number(!!a.data.pinned) ||
		(b.data.updated ?? b.data.published).getTime() -
			(a.data.updated ?? a.data.published).getTime() ||
		b.data.published.getTime() - a.data.published.getTime() ||
		a.id.localeCompare(b.id)
	);
}
