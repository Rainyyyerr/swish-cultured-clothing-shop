import { users } from "./users";

function findUser(username) {
    return users.find(user => user.username === username);
}

function addUser(user) {
    const newUser = {
        id: users.length + 1,
        ...user,
        role: 'user'
    };
    users.push(newUser);
    localStorage.setItem('swishUsers', JSON.stringify(users));
    return newUser;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

export { users, findUser, addUser, getCurrentUser, setCurrentUser, clearCurrentUser };