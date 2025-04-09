import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // Добавлено
import { AppRoutingModule } from './app-routing.module';

// Импорт standalone-компонентов
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainPageComponent } from './components/main-page/main-page.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,  // Обеспечивает провайдер HttpClient
    AppRoutingModule,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainPageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
