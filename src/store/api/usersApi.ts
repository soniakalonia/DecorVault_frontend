import { baseApi } from './baseApi'

export interface User {
  id: number
  full_name: string
  email: string
  mobile: string
  role: 'user' | 'admin'
  is_verified: boolean
  created_at: string
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<{ users: User[] }, void>({
      query: () => '/auth/users',
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation<
      { message: string; user: { id: number; role: string } },
      { userId: number; role: 'user' | 'admin' }
    >({
      query: ({ userId, role }) => ({
        url: '/auth/users/role',
        method: 'PUT',
        body: { userId, role },
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetAllUsersQuery, useUpdateUserRoleMutation } = usersApi