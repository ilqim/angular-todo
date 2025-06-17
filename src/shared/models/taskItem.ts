export class TaskItem {
  constructor(
    public id: number | null,
    public title: string,
    public description: string,
    public category: 'İş' | 'Okul' | 'Kişisel',
    public priority: 'Yüksek' | 'Orta' | 'Düşük',
    public dueDate: string,
    public isCompleted: boolean = false
  ) {}
}
