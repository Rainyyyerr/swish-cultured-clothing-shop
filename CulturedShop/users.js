export const users = JSON.parse(localStorage.getItem('swishUsers')) || [
    {
        id: 1,
        username: 'admin',
        password: '123',
        email: 'admin@swishxrevere.com',
        role: 'admin'
    }
];
