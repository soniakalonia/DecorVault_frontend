'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useGetBlogsQuery } from '@/store/api/blogApi';

const BlogSection = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetBlogsQuery(undefined);

  const allPosts = data?.blogs || [];
  const publishedPosts = allPosts.filter((blog: any) => blog.status === 'published');

  if (isLoading) return <div className="mx-auto max-w-[1400px] px-4 py-4 text-center">Loading blogs...</div>;
  if (error) return null;
  if (!publishedPosts.length) return null;

  return (
    <section className="w-full px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between" data-aos="fade-up">
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <Icon name="NewspaperIcon" size={32} className="text-primary" variant="solid" />
            <h2 className="font-heading text-xl font-bold  sm:text-4xl">
              Latest from Our Blog
            </h2>
          </div>
          <p className="text-muted-foreground text-[12px] sm:text-[16px]">
            Tips, guides, and inspiration for your home
          </p>
        </div>
        <Link
          href="/blog"
          className="flex items-center space-x-1 text-sm font-medium text-primary transition-smooth hover:underline"
        >
          <span>View All Posts</span>
          <Icon name="ArrowRightIcon" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {publishedPosts.slice(0, 4).map((post: any, index: number) => (
          <article
            key={post.id}
            onClick={() => router.push(`/blog/${post.slug}`)}
            className="group overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1 transition-smooth hover:shadow-elevation-2 cursor-pointer"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              <AppImage
                src={post.image || '/assets/products/1.jpg'}
                alt={post.title}
                className="h-full w-full object-cover transition-smooth group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {post.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold text-card-foreground transition-smooth group-hover:text-primary">
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
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center space-x-1 font-medium text-primary transition-smooth hover:underline"
                >
                  <span>Read More</span>
                  <Icon name="ArrowRightIcon" size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;



