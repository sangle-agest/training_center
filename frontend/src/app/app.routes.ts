import { Routes } from '@angular/router';
import { authGuard, adminGuard, learnerGuard, loginGuard, rootGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/admin/dashboard/dashboard';
import { CoursesComponent } from './components/admin/courses/courses';
import { CourseFormComponent } from './components/admin/course-form/course-form';
import { LessonEditorComponent } from './components/admin/lesson-editor/lesson-editor';
import { LessonFormComponent } from './components/admin/lesson-form/lesson-form';
import { LessonViewComponent as AdminLessonViewComponent } from './components/admin/lesson-view/lesson-view';
import { MyCoursesComponent } from './components/learner/my-courses/my-courses';
import { CourseViewComponent } from './components/learner/course-view/course-view';
import { LessonViewComponent } from './components/learner/lesson-view/lesson-view';

export const routes: Routes = [
  { path: '', canActivate: [rootGuard], children: [] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/create', component: CourseFormComponent },
      { path: 'courses/:id/edit', component: CourseFormComponent },
      { path: 'courses/:id/manage', component: LessonEditorComponent },
      { path: 'lessons/create', component: LessonFormComponent },
      { path: 'lessons/:id/edit', component: LessonFormComponent },
      { path: 'lessons/:id/view', component: AdminLessonViewComponent },
    ]
  },
  
  // Learner routes
  {
    path: 'learn',
    canActivate: [authGuard, learnerGuard],
    children: [
      { path: '', component: MyCoursesComponent },
      { path: 'courses/:id', component: CourseViewComponent },
      { path: 'lessons/:id', component: LessonViewComponent },
    ]
  },

  { path: '**', redirectTo: '/login' }
];
