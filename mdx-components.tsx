import type { MDXComponents } from "mdx/types";

/**
 * Required by Next.js App Router for @next/mdx.
 * Resolves MDX components statically — avoids the React context fallback
 * that triggers "createContext only works in Client Components".
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
	return { ...components };
}
