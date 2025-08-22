import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone:false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit {
  @Input() isCollapsed: boolean = false;
  @Input() isMobile: boolean = false;
  @Output() themeToggled = new EventEmitter<boolean>();
  dynamicTitle = 'Abutech XP System';
  isDarkMode = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadThemePreference();
    this.updateTitleBasedOnRoute();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTitleBasedOnRoute();
      });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.saveThemePreference();
    this.applyTheme();
    this.themeToggled.emit(this.isDarkMode);
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  private saveThemePreference() {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  private updateTitleBasedOnRoute() {
    const url = this.router.url;
    const routeSegment = url.split('/').pop();
    const baseTitle = 'Abutech XP System';
    
    if (routeSegment && routeSegment !== 'system') {
      const capitalizedSegment = routeSegment.charAt(0).toUpperCase() + routeSegment.slice(1);
      this.dynamicTitle = `${baseTitle} ${capitalizedSegment}`;
    } else {
      this.dynamicTitle = baseTitle;
    }
  }
}