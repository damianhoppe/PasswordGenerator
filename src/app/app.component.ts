import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api'

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const LOCALSTORAGE_KEY_PASSWORD_FORM_DATA = "passwordFormData";

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Password Generator';
  passwordConfig = {
    length: {
      min: 8,
      max: 64,
    }
  };
  data = new PasswordFormData();
  password = "";

  constructor(private messageService: MessageService){}

  ngOnInit(): void {
    let savedData = localStorage.getItem(LOCALSTORAGE_KEY_PASSWORD_FORM_DATA);
    if(savedData != null) {
      Object.assign(this.data, JSON.parse(savedData));
    }
    this.password = this.generateNewPassword();
    window.onbeforeunload = () => this.ngOnDestroy();
  }
  ngOnDestroy(): void {
    localStorage.setItem(LOCALSTORAGE_KEY_PASSWORD_FORM_DATA, JSON.stringify(this.data));
  }

  public onInputPasswordLength(event: any) {
    this.data.passwordLength = clamp(parseInt(event.target.value), this.passwordConfig.length.min, this.passwordConfig.length.max);
    this.updatePassword();
  }

  public updatePassword() {
    this.password = this.generateNewPassword();
  }

  private buildCharactersSet(): string {
    let characters = "";
    if(this.data.lowercaseChecked)
      characters += "abcdefghijklmnopqrstuvwxyz";
    if(this.data.uppercaseChecked)
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(this.data.numbersChecked)
      characters += "0123456789";
    if(this.data.symbolsChecked)
      characters += "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
    return characters;
  }

  private generateNewPassword(): string {
    const characters = this.buildCharactersSet();
    if(characters.length == 0)
      return "";
    let newPassword = "";
    while(newPassword.length < this.data.passwordLength) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters.charAt(randomIndex);
    }
    return newPassword;
  }

  public verifyAndGetIsChecked(event: any): boolean {
    let element = event.target as HTMLInputElement;
    if(this.data.countChecked() <= 1) {
      element.checked = true;
    }
    return element.checked;
  }

  private canShowToast: boolean = true;

  public copyPasswordToClipboard() {
    navigator.clipboard.writeText(this.password);
    if(this.canShowToast) {
      this.canShowToast = false;
      let timeout = 1500;
      setTimeout(function(this: AppComponent){
        console.log("end");
        this.canShowToast = true;
      }.bind(this), timeout + 500);
      this.messageService.add({
        life: timeout,
        severity: 'success',
        summary: 'Password has been copied to the clipboard',
      });
    }
  }
  cancelEventIfOnlyOneChecked(event: any) {
    let target = event.target as HTMLInputElement;
    if(target.checked)
      return;
    if(this.data.countChecked() <= 1) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}


class PasswordFormData {
  public passwordLength: number = 24;
  public uppercaseChecked: boolean = true;
  public lowercaseChecked: boolean = true;
  public numbersChecked: boolean = true;
  public symbolsChecked: boolean = true;

  public countChecked(): number {
    let count: number = 0;
    if(this.lowercaseChecked)
      count++
    if(this.uppercaseChecked)
      count++
    if(this.numbersChecked)
      count++
    if(this.symbolsChecked)
      count++
    return count;
  }
}