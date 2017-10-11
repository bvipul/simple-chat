import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { SocketService } from "./socket.service";

@NgModule({
  declarations: [
    AppComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
