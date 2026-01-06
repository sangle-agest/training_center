import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lesson, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = `${environment.apiUrl}/lessons`;

  constructor(private http: HttpClient) {}

  getAll(categoryId?: number): Observable<ApiResponse<Lesson[]>> {
    if (categoryId) {
      return this.http.get<ApiResponse<Lesson[]>>(this.apiUrl, { 
        params: { category_id: categoryId.toString() }
      });
    }
    return this.http.get<ApiResponse<Lesson[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Lesson>> {
    return this.http.get<ApiResponse<Lesson>>(`${this.apiUrl}/${id}`);
  }

  create(lesson: Partial<Lesson>): Observable<ApiResponse<Lesson>> {
    return this.http.post<ApiResponse<Lesson>>(this.apiUrl, lesson);
  }

  update(id: number, lesson: Partial<Lesson>): Observable<ApiResponse<Lesson>> {
    return this.http.put<ApiResponse<Lesson>>(`${this.apiUrl}/${id}`, lesson);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  uploadFile(lessonId: number, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/${lessonId}/files`,
      formData
    );
  }

  getFiles(lessonId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${lessonId}/files`);
  }

  deleteFile(fileId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${environment.apiUrl}/files/${fileId}`);
  }

  downloadFile(fileId: number): string {
    return `${environment.apiUrl}/files/${fileId}/download`;
  }
}
