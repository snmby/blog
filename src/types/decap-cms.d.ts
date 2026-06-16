declare module "decap-cms" {
	const CMS: {
		init: (options?: { config?: Record<string, unknown> }) => void;
	};

	export default CMS;
}
