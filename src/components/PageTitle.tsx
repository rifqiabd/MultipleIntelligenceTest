import { usePageTitle } from "@/hooks/use-page-title";

/**
 * A component that sets the document title based on the current route
 * This component doesn't render anything, it just uses the usePageTitle hook
 */
export const PageTitle = () => {
  usePageTitle();
  return null;
};

export default PageTitle;
