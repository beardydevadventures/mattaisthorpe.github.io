import type { CollectionEntry } from "astro:content";

export const projectCategories = [
	{
		slug: "ai",
		label: "AI",
		sourceTags: ["AI", "Generative AI"],
	},
	{
		slug: "xr",
		label: "XR",
		sourceTags: [
			"XR",
			"VR",
			"Immersive",
			"Smart Glasses",
			"Hand Tracking",
			"Passthrough",
		],
	},
	{
		slug: "web-apps",
		label: "Web & Apps",
		sourceTags: ["App", "Web App", "SaaS", "Android", "Next.js"],
	},
	{
		slug: "games",
		label: "Games",
		sourceTags: ["Game"],
		includeProjectIds: ["vr/smash-room"],
		excludeProjectIds: ["app/pathfinder-acg"],
	},
	{
		slug: "hackathons",
		label: "Hackathons",
		sourceTags: ["Hackathon"],
		includeProjectIds: ["ai/invi-ai"],
	},
] as const;

export type ProjectCategorySlug = (typeof projectCategories)[number]["slug"];

type Project = Pick<CollectionEntry<"projects">, "id" | "data">;

export function getProjectCategorySlugs(
	project: Project,
): ProjectCategorySlug[] {
	const tags = new Set(project.data.tags);

	return projectCategories
		.filter((category) => {
			const included =
				"includeProjectIds" in category &&
				category.includeProjectIds.some((id) => id === project.id);
			const excluded =
				"excludeProjectIds" in category &&
				category.excludeProjectIds.some((id) => id === project.id);
			const hasMappedTag = category.sourceTags.some((tag) => tags.has(tag));

			return !excluded && (included || hasMappedTag);
		})
		.map((category) => category.slug);
}
