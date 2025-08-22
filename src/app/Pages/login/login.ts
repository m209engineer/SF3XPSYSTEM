import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as studentsData from '../../students.json';

interface Student {
  id: number;
  name: string;
  username: string;
  password: string;
  avatar: string;
  months: {
    [key: string]: {
      davomat: number;
      uy_vazifa: number;
      tasks: number;
    }
  };
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  returnUrl: string = '/system/home';

  // JSON fayldan olingan student ma'lumotlari
  students: Student[] = (studentsData as any).default || studentsData;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Agar login sahifasiga boshqa sahifadan yoʻnaltirilgan boʻlsa
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/system/home';
    });
  }

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Student ma'lumotlaridan foydalanuvchini qidirish
      const student = this.students.find(s => 
        s.username === this.username && s.password === this.password
      );

      if (student) {
        // LocalStorage ga ma'lumotlarni saqlash
        localStorage.setItem('studentId', student.id.toString());
        localStorage.setItem('currentStudent', JSON.stringify(student));
        
        // System sahifasiga yo'naltirish
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = 'Login yoki parol noto‘g‘ri';
      }
    } catch (error) {
      console.error('Xato:', error);
      this.errorMessage = 'Server xatosi. Iltimos, keyinroq urunib ko‘ring.';
    } finally {
      this.isLoading = false;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}