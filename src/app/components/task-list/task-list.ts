import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface TaskItem {
  id: number | null;
  title: string;
  description: string;
  category: 'İş' | 'Okul' | 'Kişisel';
  priority: 'Yüksek' | 'Orta' | 'Düşük';
  dueDate: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList {
  @Input() tasks: TaskItem[] = [];
  @Output() deleteTask = new EventEmitter<number>();
  @Output() toggleComplete = new EventEmitter<number>();

  // Modal kontrolü için
  showDeleteModal = false;
  taskToDelete: { id: number; title: string } | null = null;

  onDelete(id: number, taskTitle: string): void {
    this.taskToDelete = { id, title: taskTitle };
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.taskToDelete) {
      this.deleteTask.emit(this.taskToDelete.id);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.taskToDelete = null;
  }

  onToggleComplete(id: number): void {
    this.toggleComplete.emit(id);
  }

  // Açıklamayı 70 karakterle sınırla
  getTruncatedDescription(description: string): string {
    if (description.length <= 70) {
      return description;
    }
    return description.substring(0, 70) + '...';
  }

  getCategoryColor(category: 'İş' | 'Okul' | 'Kişisel'): string {
    switch (category) {
      case 'İş':
        return 'blue';
      case 'Okul':
        return 'purple';
      case 'Kişisel':
        return 'brown';
      default:
        return 'black';
    }
  }

  getPriorityColor(priority: 'Yüksek' | 'Orta' | 'Düşük'): string {
    switch (priority) {
      case 'Yüksek':
        return 'red';
      case 'Orta':
        return 'orange';
      case 'Düşük':
        return 'green';
      default:
        return 'black';
    }
  }
}