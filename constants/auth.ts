export const AUTHORIZED_ADMINS = [
    {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        permissions: ['CREATE_USERS', 'MANAGE_ROLES']
    }
];