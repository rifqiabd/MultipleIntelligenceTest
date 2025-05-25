import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type PageTitles = {
  [key: string]: string;
};

// Map of route paths to page titles
const pageTitles: PageTitles = {
  '/': 'Beranda | Tes Multiple Intelligences',
  '/admin': 'Login Admin | Tes Multiple Intelligences',
  '/admin/dashboard': 'Dashboard Admin | Tes Multiple Intelligences',
  '/admin/questions': 'Kelola Pertanyaan | Tes Multiple Intelligences',
  '/test': 'Form Pendaftaran | Tes Multiple Intelligences',
  '/test/questions': 'Pertanyaan Tes | Tes Multiple Intelligences',
  '/test/results': 'Hasil Tes | Tes Multiple Intelligences',
  '/makasihya': 'Terima Kasih | Tes Multiple Intelligences',
};

// Default title when route is not found
const defaultTitle = 'Tes Multiple Intelligences';

export const usePageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Get the title for the current path or use the default title
    const currentTitle = pageTitles[location.pathname] || defaultTitle;
    
    // Set the document title
    document.title = currentTitle;
  }, [location.pathname]);
};

export default usePageTitle;
