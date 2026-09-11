'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (pathname) {
      const pathSegments = pathname.split('/').filter((segment) => segment !== '');
      
      // Build breadcrumb items
      const crumbs: BreadcrumbItem[] = [];
      
    
      crumbs.push({ label: 'Home', href: '/' });
      
      // Build path segments
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += '/' + segment;
        
        // Format label: replace hyphens with spaces and capitalize
        let label = segment.replace(/-/g, ' ');
        // Handle camelCase like "admin-dashboard" -> "Admin Dashboard"
        label = label.replace(/([A-Z])/g, ' $1').trim();
        // Capitalize first letter of each word
        label = label.replace(/\b\w/g, (char) => char.toUpperCase());
        
        crumbs.push({ label, href: currentPath });
      });
      
      setBreadcrumbs(crumbs);
    }
  }, [pathname]);

  // Return empty div during server-side rendering to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-6" />;
  }

  // Return empty div if no breadcrumbs
  if (breadcrumbs.length === 0) {
    return <div className="h-6" />;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRightIcon" 
                  size={16} 
                  className="mx-2 text-gray-400 flex-shrink-0" 
                />
              )}
              {isLast ? (
                <span 
                  className="font-medium text-gray-900 capitalize" 
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="text-gray-500 hover:text-primary transition-colors capitalize"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}