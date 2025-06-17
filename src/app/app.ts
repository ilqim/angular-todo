import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { TaskList, TaskItem } from './components/task-list/task-list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, TaskList, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'Görev Listesi';
  showTaskList = true;
  showFilters = true;

  tasks: TaskItem[] = [];

  selectedCategory: string = '';
  selectedCompletion: string = '';
  selectedSort: string = '';

  constructor(private router: Router) {
    // Router olaylarını dinle
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ana sayfaya döndüğünde task'ları yeniden yükle
        if (event.url === '/') {
          this.loadTasks(); // Ana sayfaya döndüğünde task'ları yeniden yükle
        }
        
        this.showTaskList = event.url === '/';
        this.showFilters = event.url === '/';
      }
    });
  }

  get filteredTasks(): TaskItem[] {
    let result = [...this.tasks];

    if (this.selectedCategory) {
      result = result.filter(task => task.category === this.selectedCategory);
    }

    if (this.selectedCompletion) {
      const completed = this.selectedCompletion === 'true';
      result = result.filter(task => task.isCompleted === completed);
    }

    if (this.selectedSort) {
      result = result.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return this.selectedSort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    try {
      this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    } catch (error) {
      console.error('Task loading error:', error);
      this.tasks = [];
    }
  }

  handleDeleteTask(id: number) {
    this.tasks = this.tasks.filter((task: any) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    // loadTasks() çağırmaya gerek yok çünkü zaten this.tasks'ı güncelledik
  }

  handleToggleComplete(id: number) {
    this.tasks = this.tasks.map((task: any) => {
      if (task.id === id) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    // loadTasks() çağırmaya gerek yok çünkü zaten this.tasks'ı güncelledik
  }
}