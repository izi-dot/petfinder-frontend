import { Routes } from '@angular/router';
import { SignUpPageComponent, LoginPageComponent, PostPageComponent } from './components';

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
];
