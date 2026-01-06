import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CourseProgress, ApiResponse, Course } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) {}

  getMyCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}/my-courses`);
  }

  getCourseProgress(courseId: number): Observable<ApiResponse<CourseProgress>> {
    return this.http.get<ApiResponse<CourseProgress>>(`${this.apiUrl}/course/${courseId}`);
  }

  toggleLessonProgress(lessonId: number, completed: boolean = true): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/lesson/${lessonId}`,
      { completed }
    );
  }
}
