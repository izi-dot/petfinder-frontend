import { Routes } from '@angular/router';
import { SignUpPage, LoginPage, PostPage } from './components';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'signup',
        pathMatch: 'full'
    },
    {
        path: 'signup',
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
