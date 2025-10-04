import {Routes} from '@angular/router';
import {noLangGuard} from './core/guards/no-lang-guard';
import {languageResolver} from './core/resolvers/language-resolver';
import {Home} from './pages/home/home';
import {metaResolver} from './core/resolvers/meta-resolver';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [noLangGuard],
    children: []
  },
  {
    path: ':lang',
    resolve: {language: languageResolver},
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: Home,
        title: 'Ensō',
        data: {
          metaTitleKey: 'SEO.home.title',
          metaDescriptionKey: 'SEO.home.description',
          metaKeywordsKey: 'SEO.home.keywords',
          metaImage: 'img/meta-image.webp'
        },
        resolve: { meta: metaResolver }
      }
    ]
  },
  { path: '**', redirectTo: '/en', pathMatch: 'full' },
  {path: '', redirectTo: '/en', pathMatch: 'full'}
];
