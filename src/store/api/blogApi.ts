import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      let token = (getState() as RootState).auth?.token;
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (status) => `/blogs${status ? `?status=${status}` : ''}`,
      providesTags: ['Blog'],
    }),
    getBlog: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/slug/${slug}`,
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: '/blogs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogQuery, useGetBlogBySlugQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } = blogApi;
