import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { CourseService } from '../../../services/course.service';
import { CategoryService } from '../../../services/category.service';
import { LessonService } from '../../../services/lesson.service';
import { AuthService } from '../../../services/auth.service';
import { Course, Category, Lesson } from '../../../models';

@Component({
  selector: 'app-lesson-editor',
  imports: [CommonModule, FormsModule, RouterModule, DragDropModule],
  templateUrl: './lesson-editor.html',
  styleUrl: './lesson-editor.css'
})
export class LessonEditorComponent implements OnInit {
  course: Course | null = null;
  courseId: number | null = null;
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  showCategoryModal = false;
  
  categoryForm: Partial<Category> = {
    name: '',
    course_id: 0,
    order: 0
  };
  
  editingCategory: Category | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
    private lessonService: LessonService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = parseInt(id, 10);
      this.loadCourse();
    }
  }

  loadCourse(): void {
    if (this.courseId) {
      console.log('Loading course with ID:', this.courseId);
      this.courseService.getById(this.courseId).subscribe({
        next: (response) => {
          console.log('Course response:', response);
          if (response.success && response.data) {
            this.course = response.data;
            this.categories = response.data.categories || [];
            console.log('Course loaded:', this.course);
            console.log('Categories:', this.categories);
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to load course';
          console.error('Error loading course:', error);
        }
      });
    }
  }

  openCategoryModal(category?: Category): void {
    this.editingCategory = category || null;
    if (category) {
      this.categoryForm = { ...category };
    } else {
      this.categoryForm = {
        name: '',
        course_id: this.courseId!,
        order: this.categories.length
      };
    }
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
    this.categoryForm = { name: '', course_id: 0, order: 0 };
  }

  saveCategory(): void {
    const request = this.editingCategory
      ? this.categoryService.update(this.editingCategory.id, this.categoryForm)
      : this.categoryService.create(this.categoryForm);

    request.subscribe({
      next: () => {
        this.successMessage = `Category ${this.editingCategory ? 'updated' : 'created'} successfully!`;
        this.closeCategoryModal();
        this.loadCourse();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to save category';
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure? This will also delete all lessons in this category.')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Category deleted successfully!';
          this.loadCourse();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete category';
        }
      });
    }
  }

  // Drag-drop handlers for categories
  dropCategory(event: CdkDragDrop<Category[]>): void {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.updateCategoryOrder();
  }

  updateCategoryOrder(): void {
    this.categories.forEach((category, index) => {
      if (category.order !== index) {
        this.categoryService.update(category.id, { order: index }).subscribe({
          error: (error) => console.error('Failed to update category order:', error)
        });
      }
    });
  }

  // Drag-drop handlers for lessons
  dropLesson(event: CdkDragDrop<Lesson[]>, category: Category): void {
    if (!category.lessons) return;
    moveItemInArray(category.lessons, event.previousIndex, event.currentIndex);
    this.updateLessonOrder(category.lessons);
  }

  updateLessonOrder(lessons: Lesson[]): void {
    lessons.forEach((lesson, index) => {
      if (lesson.order !== index) {
        this.lessonService.update(lesson.id, { order: index }).subscribe({
          error: (error) => console.error('Failed to update lesson order:', error)
        });
      }
    });
  }

  // Navigate to lesson form
  addLesson(category: Category): void {
    this.router.navigate(['/admin/lessons/create'], {
      queryParams: { categoryId: category.id, courseId: this.courseId }
    });
  }

  editLesson(lesson: Lesson): void {
    this.router.navigate(['/admin/lessons', lesson.id, 'edit'], {
      queryParams: { courseId: this.courseId }
    });
  }

  deleteLesson(id: number): void {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.lessonService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Lesson deleted successfully!';
          this.loadCourse();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete lesson';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
