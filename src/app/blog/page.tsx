'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useGetBlogsQuery } from '@/store/api/blogApi';

export default function BlogPage() {
  const { data, isLoading } = useGetBlogsQuery(undefined);
  const publishedPosts = data?.blogs?.filter((blog: any) => blog.status === 'published') || [];
  const latestPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Our Blog</h1>
          <p className="text-muted-foreground">Tips, guides, and inspiration for your home</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading blogs...</div>
        ) : publishedPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No blogs available yet.</div>
        ) : (
          <>
            {/* Latest Blog - Featured */}
            {latestPost && (
              <Link href={`/blog/${latestPost.slug}`} className="block mb-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                    <AppImage
                      src={latestPost.image || '/assets/products/1.jpg'}
                      alt={latestPost.title}
                      className="w-full h-full object-cover hover:scale-105 transition-smooth"
                    />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-semibold mb-4 w-fit uppercase tracking-wide">
                      {latestPost.category}
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight hover:text-primary transition-smooth">
                      {latestPost.title}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg mb-6 line-clamp-4 leading-relaxed">
                      {latestPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Icon name="CalendarIcon" size={16} />
                        <span className="font-medium">{new Date(latestPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      <span className="text-border">•</span>
                      <span className="font-medium">By {latestPost.author}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Blogs Grid */}
            {otherPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1 hover:shadow-elevation-2 transition-smooth h-full">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <AppImage
                      src={post.image || '/assets/products/1.jpg'}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
                    />
                    <div className="absolute left-4 top-4 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold text-card-foreground group-hover:text-primary transition-smooth">
                      {post.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Icon name="CalendarIcon" size={14} />
                          <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="EyeIcon" size={14} />
                          <span>{post.views} views</span>
                        </span>
                      </div>
                      <span className="flex items-center space-x-1 font-medium text-primary">
                        <span>Read More</span>
                        <Icon name="ArrowRightIcon" size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </>
    )}
      </div>
    </div>
  );
}
