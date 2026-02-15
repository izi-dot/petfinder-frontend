import { Routes } from '@angular/router';
import { SignUpPageComponent, LoginPageComponent, PostPageComponent, PostDetailPageComponent } from './components';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'signup',
        pathMatch: 'full'
    },
    {
        path: 'signup',
        component: SignUpPageComponent
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'post',
        component: PostPageComponent
    },
    {
        path: 'post/:id', 
        component: PostDetailPageComponent
    }
];
