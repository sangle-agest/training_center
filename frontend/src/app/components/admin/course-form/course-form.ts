import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models';

@Component({
  selector: 'app-course-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseFormComponent implements OnInit {
  course: Partial<Course> = {
    title: '',
    description: '',
    is_active: true
  };
  isEditMode = false;
  courseId: number | null = null;
  errorMessage = '';
  successMessage = '';
  submitting = false;

  constructor(
    private courseService: CourseService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Course ID from route:', id);
    if (id) {
      this.isEditMode = true;
      this.courseId = parseInt(id, 10);
      console.log('Edit mode enabled, loading course:', this.courseId);
      this.loadCourse();
    }
  }

  loadCourse(): void {
    if (this.courseId) {
      console.log('Loading course:', this.courseId);
      this.courseService.getById(this.courseId).subscribe({
        next: (response) => {
          console.log('Course loaded:', response);
          if (response.success && response.data) {
            this.course = response.data;
            console.log('Course data assigned:', this.course);
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to load course';
          console.error('Error loading course:', error);
        }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.submitting = true;

    const request = this.isEditMode && this.courseId
      ? this.courseService.update(this.courseId, this.course)
      : this.courseService.create(this.course);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Course ${this.isEditMode ? 'updated' : 'created'} successfully!`;
          setTimeout(() => {
            this.router.navigate(['/admin/courses']);
          }, 1500);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} course`;
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/courses']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
