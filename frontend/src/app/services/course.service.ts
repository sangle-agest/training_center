import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}`);
  }

  getTree(id: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}/tree`);
  }

  create(course: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(this.apiUrl, course);
  }

  update(id: number, course: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(`${this.apiUrl}/${id}`, course);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  assignToUsers(courseId: number, userIds: number[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/${courseId}/assign`,
      { user_ids: userIds }
    );
  }

  unassignFromUser(courseId: number, userId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${courseId}/unassign/${userId}`
    );
  }

  getLearners(courseId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${courseId}/learners`);
  }
}
