import { Routes } from '@angular/router';
import { SignUpPage, LoginPage, PostPage } from './components';

export const routes: Routes = [
    {
        path: '',
        component: SignUpPage
    },
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'post',
        component: PostPage
    },
];
