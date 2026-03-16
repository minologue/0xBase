import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

const config: NextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	async headers() {
		return [
			{
				// Apply to all routes
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},
	images: {
		remotePatterns: [
			// Google OAuth avatar CDN
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
			// GitHub avatar CDN
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
		],
	},
};

export default withNextIntl(withMDX(config));

