import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  viewMode: 'card' | 'table' = 'card';

  constructor(
    private courseService: CourseService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  toggleView(mode: 'card' | 'table'): void {
    console.log('Toggling view from', this.viewMode, 'to', mode);
    this.viewMode = mode;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    console.log('===== CoursesComponent ngOnInit =====');
    console.log('Initial viewMode:', this.viewMode);
    this.loadCourses();
  }

  loadCourses(): void {
    console.log('===== loadCourses called =====');
    
    this.courseService.getAll().subscribe({
      next: (response) => {
        console.log('===== Courses API Response =====');
        console.log('Response:', response);
        console.log('Response.success:', response.success);
        console.log('Response.data:', response.data);
        console.log('Response.data type:', typeof response.data);
        console.log('Response.data is array:', Array.isArray(response.data));
        
        if (response.success && response.data) {
          this.courses = response.data;
          console.log('Courses assigned to this.courses');
          console.log('this.courses:', this.courses);
          console.log('this.courses.length:', this.courses.length);
        } else {
          console.log('Response success or data was falsy');
        }
        console.log('Triggering change detection...');
        this.cdr.detectChanges();
        console.log('Change detection triggered');
        console.log('================================');
      },
      error: (error) => {
        console.error('===== Error loading courses =====');
        console.error('Error:', error);
        console.error('=================================');
        this.cdr.detectChanges();
      }
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.delete(id).subscribe({
        next: () => {
          this.loadCourses();
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
