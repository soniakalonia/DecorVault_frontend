'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useGetBlogBySlugQuery } from '@/store/api/blogApi';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading } = useGetBlogBySlugQuery(slug);
  
  const blog = data?.blog;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Blog not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <Icon name="ArrowLeftIcon" size={16} />
          Back to Blog
        </Link>

        <article>
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">{blog.category}</span>
            <span className="flex items-center gap-1">
              <Icon name="CalendarIcon" size={14} />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="EyeIcon" size={14} />
              {blog.views} views
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">{blog.title}</h1>
          
          <p className="text-lg text-muted-foreground mb-6">{blog.excerpt}</p>

          {blog.image && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <AppImage src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Written by <span className="font-medium text-foreground">{blog.author}</span>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
