import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css']
})
export class TaskForm implements OnInit {
  isEditMode = false;

  categories = ['İş', 'Okul', 'Kişisel'] as const;

  task = {
    id: null as number | null,
    title: '',
    description: '',
    category: 'İş' as 'İş' | 'Okul' | 'Kişisel',
    priority: 'Orta' as 'Yüksek' | 'Orta' | 'Düşük',
    dueDate: '',
    isCompleted: false
  };

  // Modal kontrolü için
  showErrorModal = false;
  errorMessage = '';
  errorTitle = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const existingTask = tasks.find((t: any) => t.id === +idParam);
      if (existingTask) {
        this.task = { ...existingTask };
      }
    }
  }

  setPriority(priority: 'Yüksek' | 'Orta' | 'Düşük') {
    this.task.priority = priority;
  }

  // Ana sayfaya gitme fonksiyonu
  goToHome() {
    this.router.navigate(['/']);
  }

  // Hata modal'ını göster
  showError(title: string, message: string) {
    this.errorTitle = title;
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  // Modal'ı kapat
  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
    this.errorTitle = '';
  }

  saveTask() {
    // Başlık kontrolü
    if (!this.task.title.trim()) {
      this.showError('Başlık Boş Bırakılamaz', 'Görev başlığı zorunludur. Lütfen bir başlık girin.');
      return;
    }

    if (this.task.title.length > 50) {
      this.showError('Başlık Çok Uzun', 'Başlık 50 karakterden fazla olamaz. Lütfen kısaltın.');
      return;
    }

    // Tarih kontrolü
    if (!this.task.dueDate) {
      this.showError('Tarih Seçiniz', 'Bitiş tarihi zorunludur. Lütfen bir tarih seçin.');
      return;
    }

    // Açıklama kontrolü
    if (this.task.description.length > 500) {
      this.showError('Açıklama Çok Uzun', 'Açıklama 500 karakterden fazla olamaz. Lütfen kısaltın.');
      return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (this.isEditMode) {
      // Düzenleme modunda
      tasks = tasks.map((t: any) => (t.id === this.task.id ? this.task : t));
      console.log('Görev güncellendi:', this.task);
    } else {
      // Yeni görev ekleme - ID otomatik oluştur
      const maxId = tasks.length > 0 ? Math.max(...tasks.map((t: any) => t.id)) : 0;
      this.task.id = maxId + 1;
      tasks.push(this.task);
      console.log('Yeni görev eklendi:', this.task);
    }

    // localStorage'a kaydet
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks localStorage\'a kaydedildi:', tasks);
    
    // Ana sayfaya yönlendir
    this.goToHome();
  }
}