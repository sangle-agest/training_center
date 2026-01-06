<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\Lesson;
use App\Models\CourseAssignment;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create users
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@training.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $learner = User::factory()->create([
            'name' => 'Learner User',
            'email' => 'learner@training.com',
            'password' => bcrypt('password'),
            'role' => 'learner',
        ]);

        // Create 3 courses
        $courses = [
            [
                'title' => 'Web Development Fundamentals',
                'description' => 'Learn the basics of web development including HTML, CSS, and JavaScript',
                'categories' => [
                    [
                        'name' => 'HTML Basics',
                        'description' => 'Introduction to HTML structure and elements',
                        'lessons' => [
                            ['title' => 'Introduction to HTML', 'content' => '<h2>What is HTML?</h2><p>HTML stands for HyperText Markup Language...</p>'],
                            ['title' => 'HTML Elements and Tags', 'content' => '<h2>HTML Elements</h2><p>HTML elements are the building blocks of web pages...</p>'],
                            ['title' => 'HTML Attributes', 'content' => '<h2>HTML Attributes</h2><p>Attributes provide additional information about HTML elements...</p>'],
                        ]
                    ],
                    [
                        'name' => 'CSS Styling',
                        'description' => 'Learn how to style web pages with CSS',
                        'lessons' => [
                            ['title' => 'CSS Basics', 'content' => '<h2>Introduction to CSS</h2><p>CSS is used to style and layout web pages...</p>'],
                            ['title' => 'CSS Selectors', 'content' => '<h2>Understanding Selectors</h2><p>CSS selectors are patterns used to select elements...</p>'],
                            ['title' => 'CSS Box Model', 'content' => '<h2>The Box Model</h2><p>Every element in CSS is a box with margin, border, padding, and content...</p>'],
                        ]
                    ],
                    [
                        'name' => 'JavaScript Basics',
                        'description' => 'Learn programming fundamentals with JavaScript',
                        'lessons' => [
                            ['title' => 'JavaScript Introduction', 'content' => '<h2>What is JavaScript?</h2><p>JavaScript is a programming language for the web...</p>'],
                            ['title' => 'Variables and Data Types', 'content' => '<h2>Variables</h2><p>Variables are containers for storing data values...</p>'],
                            ['title' => 'Functions', 'content' => '<h2>JavaScript Functions</h2><p>A function is a block of code designed to perform a task...</p>'],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Database Design and SQL',
                'description' => 'Master database concepts and SQL queries',
                'categories' => [
                    [
                        'name' => 'Database Fundamentals',
                        'description' => 'Core concepts of database management',
                        'lessons' => [
                            ['title' => 'Introduction to Databases', 'content' => '<h2>What is a Database?</h2><p>A database is an organized collection of data...</p>'],
                            ['title' => 'Relational Database Concepts', 'content' => '<h2>Relational Databases</h2><p>Tables, rows, and columns form the basis of relational databases...</p>'],
                            ['title' => 'Database Normalization', 'content' => '<h2>Normalization</h2><p>Normalization is the process of organizing data to reduce redundancy...</p>'],
                        ]
                    ],
                    [
                        'name' => 'SQL Queries',
                        'description' => 'Learn to write SQL queries',
                        'lessons' => [
                            ['title' => 'SELECT Statements', 'content' => '<h2>SELECT Query</h2><p>The SELECT statement is used to retrieve data from a database...</p>'],
                            ['title' => 'JOIN Operations', 'content' => '<h2>SQL JOINs</h2><p>JOINs are used to combine rows from two or more tables...</p>'],
                            ['title' => 'Aggregate Functions', 'content' => '<h2>Aggregations</h2><p>COUNT, SUM, AVG, MIN, and MAX functions for data analysis...</p>'],
                        ]
                    ],
                    [
                        'name' => 'Advanced SQL',
                        'description' => 'Advanced database operations',
                        'lessons' => [
                            ['title' => 'Subqueries', 'content' => '<h2>Subqueries</h2><p>A subquery is a query nested inside another query...</p>'],
                            ['title' => 'Indexes and Performance', 'content' => '<h2>Database Indexes</h2><p>Indexes improve query performance by creating efficient lookup structures...</p>'],
                            ['title' => 'Transactions', 'content' => '<h2>ACID Transactions</h2><p>Transactions ensure data integrity with Atomicity, Consistency, Isolation, and Durability...</p>'],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Modern Framework Development',
                'description' => 'Build applications with Laravel and Angular',
                'categories' => [
                    [
                        'name' => 'Laravel Backend',
                        'description' => 'PHP Laravel framework fundamentals',
                        'lessons' => [
                            ['title' => 'Laravel Installation', 'content' => '<h2>Setting Up Laravel</h2><p>Learn how to install and configure Laravel...</p>'],
                            ['title' => 'Routing and Controllers', 'content' => '<h2>Laravel Routing</h2><p>Routes define the URLs your application responds to...</p>'],
                            ['title' => 'Eloquent ORM', 'content' => '<h2>Working with Eloquent</h2><p>Eloquent is Laravel\'s powerful ActiveRecord ORM...</p>'],
                        ]
                    ],
                    [
                        'name' => 'Angular Frontend',
                        'description' => 'Build SPAs with Angular',
                        'lessons' => [
                            ['title' => 'Angular Components', 'content' => '<h2>Component Architecture</h2><p>Components are the building blocks of Angular applications...</p>'],
                            ['title' => 'Services and Dependency Injection', 'content' => '<h2>Angular Services</h2><p>Services provide shared logic and data access...</p>'],
                            ['title' => 'Routing and Navigation', 'content' => '<h2>Angular Router</h2><p>The router enables navigation between views...</p>'],
                        ]
                    ],
                    [
                        'name' => 'API Integration',
                        'description' => 'Connect frontend to backend APIs',
                        'lessons' => [
                            ['title' => 'RESTful API Design', 'content' => '<h2>REST Principles</h2><p>REST is an architectural style for networked applications...</p>'],
                            ['title' => 'HTTP Client', 'content' => '<h2>Making HTTP Requests</h2><p>Learn to consume APIs using Angular HttpClient...</p>'],
                            ['title' => 'Authentication', 'content' => '<h2>Token-Based Auth</h2><p>Implement secure authentication with JWT tokens...</p>'],
                        ]
                    ],
                ]
            ],
        ];

        foreach ($courses as $index => $courseData) {
            $course = Course::create([
                'title' => $courseData['title'],
                'description' => $courseData['description'],
                'is_active' => true,
                'created_by' => $admin->id,
            ]);

            foreach ($courseData['categories'] as $catIndex => $categoryData) {
                $category = Category::create([
                    'course_id' => $course->id,
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'] ?? null,
                    'order' => $catIndex + 1,
                ]);

                foreach ($categoryData['lessons'] as $lessonIndex => $lessonData) {
                    Lesson::create([
                        'category_id' => $category->id,
                        'title' => $lessonData['title'],
                        'content' => $lessonData['content'],
                        'order' => $lessonIndex + 1,
                    ]);
                }
            }

            // Assign all courses to the learner
            CourseAssignment::create([
                'user_id' => $learner->id,
                'course_id' => $course->id,
            ]);
        }
    }
}
