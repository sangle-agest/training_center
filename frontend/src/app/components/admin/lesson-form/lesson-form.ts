import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar, toHTML } from 'ngx-editor';
import { LessonService } from '../../../services/lesson.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Lesson, Category } from '../../../models';

@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgxEditorModule],
  templateUrl: './lesson-form.html',
  styleUrl: './lesson-form.css'
})
export class LessonFormComponent implements OnInit, OnDestroy {
  editor!: Editor;
  lessonForm!: FormGroup;
  lessonId: number | null = null;
  categoryId: number | null = null;
  courseId: number | null = null;
  categories: Category[] = [];
  isEditMode = false;
  errorMessage = '';
  successMessage = '';
  
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private lessonService: LessonService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    
    this.lessonForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      category_id: new FormControl(null, Validators.required),
      order: new FormControl(0)
    });

    // Get query params
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'] ? parseInt(params['categoryId']) : null;
      this.courseId = params['courseId'] ? parseInt(params['courseId']) : null;
      
      if (this.categoryId) {
        this.lessonForm.patchValue({ category_id: this.categoryId });
      }
    });

    // Check if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lessonId = parseInt(id, 10);
      this.isEditMode = true;
      this.loadLesson();
    }

    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadLesson(): void {
    if (this.lessonId) {
      this.lessonService.getById(this.lessonId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.lessonForm.patchValue({
              title: response.data.title,
              content: response.data.content,
              category_id: response.data.category_id,
              order: response.data.order
            });
            this.categoryId = response.data.category_id;
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to load lesson';
          console.error('Error loading lesson:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.lessonForm.invalid) {
      return;
    }

    const lessonData = this.lessonForm.value;

    const request = this.isEditMode && this.lessonId
      ? this.lessonService.update(this.lessonId, lessonData)
      : this.lessonService.create(lessonData);

    request.subscribe({
      next: (response) => {
        this.successMessage = `Lesson ${this.isEditMode ? 'updated' : 'created'} successfully!`;
        setTimeout(() => {
          this.goBack();
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} lesson`;
      }
    });
  }

  goBack(): void {
    if (this.courseId) {
      this.router.navigate(['/admin/courses', this.courseId, 'manage']);
    } else {
      this.router.navigate(['/admin/courses']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
