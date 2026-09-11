"use client";

import { useState, useRef } from 'react';
// ❌ REMOVED: import AdminSidebar from '../components/AdminSidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import { Editor } from '@tinymce/tinymce-react';
import { useGetBlogsQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from '@/store/api/blogApi';
import { uploadImageToImageKit } from '@/lib/utils/imagekit';

export default function BlogPage() {
  const { data, isLoading } = useGetBlogsQuery(undefined);
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', category: 'General', status: 'draft' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const editorRef = useRef<any>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully');
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete blog');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = editingBlog?.image || '';

      if (imageFile) {
        toast.info('Uploading image...');
        imageUrl = await uploadImageToImageKit(imageFile, 'blogs');
      }

      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        image: imageUrl
      };

      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, formData: blogData }).unwrap();
        toast.success('Blog updated successfully');
      } else {
        await createBlog(blogData).unwrap();
        toast.success('Blog created successfully');
      }
      setIsModalOpen(false);
      setFormData({ title: '', content: '', excerpt: '', category: 'General', status: 'draft' });
      setImagePreview('');
      setImageFile(null);
      setEditingBlog(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save blog');
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, content: blog.content, excerpt: blog.excerpt, category: blog.category, status: blog.status });
    setImagePreview(blog.image || '');
    setIsModalOpen(true);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-6 min-w-0 h-[calc(100vh-64px)] overflow-y-auto">
        <Breadcrumb />
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-espresso">Blog Posts ({data?.blogs?.length || 0})</h1>
            <button onClick={() => { setEditingBlog(null); setFormData({ title: '', content: '', excerpt: '', category: 'General', status: 'draft' }); setImagePreview(''); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <Icon name="PlusIcon" size={20} />
              Add New Post
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-border ">
              <div className='overflow-x-auto sm:overflow-visible'>
                <table className="min-w-[1200px] md:min-w-full w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data?.blogs?.map((blog: any) => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{blog.id}</td>
                        <td className="px-4 py-3">
                          {blog.image ? (
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Icon name="PhotoIcon" size={20} className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium">{blog.title}</td>
                        <td className="px-4 py-3 text-xs">{blog.author}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">{new Date(blog.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs">{blog.views}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Edit" onClick={() => handleEdit(blog)}>
                              <Icon name="PencilSquareIcon" size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete" onClick={() => handleDelete(blog.id)}>
                              <Icon name="TrashIcon" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-espresso">{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingBlog(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Icon name="PhotoIcon" size={20} />
                    <span className="text-sm">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="News">News</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(50-250 characters)</span></label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  minLength={50}
                  maxLength={250}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter a brief excerpt (50-250 characters)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <Editor
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                  licenseKey="gpl"
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={formData.content}
                  onEditorChange={(content) => setFormData({ ...formData, content })}
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image media link | code fullscreen | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}