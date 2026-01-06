import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { FileUploadService, LessonFile } from '../../../services/file-upload.service';
import { AuthService } from '../../../services/auth.service';
import { HttpEventType } from '@angular/common/http';

interface Lesson {
  id: number;
  title: string;
  content: string;
  category_id: number;
  order: number;
}

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-view.html',
  styleUrls: ['./lesson-view.css']
})
export class LessonViewComponent implements OnInit {
  lesson: Lesson | null = null;
  files: LessonFile[] = [];
  loading = true;
  uploadProgress = 0;
  uploadingFile = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private fileUploadService: FileUploadService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    console.log('===== LessonViewComponent Init =====');
    console.log('Lesson ID from route:', lessonId);
    console.log('Auth token:', this.authService.token ? 'EXISTS' : 'MISSING');
    console.log('Current user:', this.authService.currentUserValue);
    console.log('===================================');
    
    if (lessonId) {
      this.loadLesson(+lessonId);
      this.loadFiles(+lessonId);
    }
  }

  loadLesson(lessonId: number) {
    console.log('===== loadLesson called =====');
    console.log('Loading lesson ID:', lessonId);
    this.loading = true;
    this.lessonService.getById(lessonId).subscribe({
      next: (response) => {
        console.log('Lesson API Response:', response);
        this.lesson = response.data || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('===== Lesson API Error =====');
        console.error('Error object:', error);
        console.error('Status:', error.status);
        console.error('Error response:', error.error);
        console.error('===========================');
        this.errorMessage = 'Failed to load lesson';
        this.loading = false;
      }
    });
  }

  loadFiles(lessonId: number) {
    this.fileUploadService.getLessonFiles(lessonId).subscribe({
      next: (response) => {
        this.files = response.data;
      },
      error: (error) => {
        console.error('Error loading files:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.lesson) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    if (!this.lesson) return;

    this.uploadingFile = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    this.fileUploadService.uploadLessonFile(this.lesson.id, file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.successMessage = 'File uploaded successfully!';
          this.uploadingFile = false;
          this.uploadProgress = 0;
          if (this.lesson) {
            this.loadFiles(this.lesson.id);
          }
          setTimeout(() => (this.successMessage = ''), 3000);
        }
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = 'Failed to upload file';
        this.uploadingFile = false;
        this.uploadProgress = 0;
      }
    });
  }

  deleteFile(file: LessonFile) {
    if (!confirm(`Are you sure you want to delete "${file.original_name}"?`)) {
      return;
    }

    this.fileUploadService.deleteFile(file.id).subscribe({
      next: () => {
        this.successMessage = 'File deleted successfully!';
        this.files = this.files.filter(f => f.id !== file.id);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.errorMessage = 'Failed to delete file';
      }
    });
  }

  downloadFile(file: LessonFile) {
    window.open(this.fileUploadService.getDownloadUrl(file.id), '_blank');
  }

  replaceFile(file: LessonFile) {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const newFile: File = e.target.files[0];
      if (newFile && this.lesson) {
        // Delete old file and upload new one
        this.fileUploadService.deleteFile(file.id).subscribe({
          next: () => {
            this.uploadFile(newFile);
          },
          error: (error) => {
            console.error('Replace error:', error);
            this.errorMessage = 'Failed to replace file';
          }
        });
      }
    };
    input.click();
  }

  getFileIcon(mimeType: string): string {
    return this.fileUploadService.getFileIcon(mimeType);
  }

  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

  editLesson() {
    if (this.lesson) {
      this.router.navigate(['/admin/lessons', this.lesson.id, 'edit']);
    }
  }

  goBack() {
    this.router.navigate(['/admin/courses']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
