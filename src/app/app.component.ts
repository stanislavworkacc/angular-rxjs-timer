import {Component, OnInit} from '@angular/core';
import { Observable, Subscription, timer} from "rxjs";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  startStop = 'Start'

  stream$: Observable<number> = timer(0, 1000);
  subs: Subscription;

  displayTimer = '00:00:00';
  currentTime;

  paused: boolean = false;
  clicked = 0;


  constructor() {
  }

  ngOnInit(): void {
    this.currentTime = 0;

    setInterval(() => {
      this.clicked = 0;
    }, 300)
  }

  start() {
    if(this.paused) {
      this.paused = !this.paused;
      this.startStop = 'Stop'
      return
    }

    if(this.startStop === 'Start') {
      this.startStop = 'Stop'
      this.subs = this.stream$
        .pipe(
          filter(v => !this.paused),
          map(v => {
            this.currentTime += 1;
            return this.currentTime;
          }),
        )
        .subscribe(ellapsedCycles => {
          this.currentTime = ellapsedCycles;
          this.getDisplayTimer(this.currentTime);
      });
    } else if(!this.paused) {
      this.startStop = 'Start'
      this.stop()
    }
  }

  getDisplayTimer(time: number) {
    let hours = `${Math.floor(time / 3600)}`
    let minutes = `${Math.floor(time % 3600 / 60)}`
    let seconds = `${Math.floor(time % 3600 % 60)}`

    if (Number(hours) < 10) {
      hours = '0' + hours;
    } else {
      hours = '' + hours;
    }
    if (Number(minutes) < 10) {
      minutes = '0' + minutes;
    } else {
      minutes = '' + minutes;
    }
    if (Number(seconds) < 10) {
      seconds = '0' + seconds;
    } else {
      seconds = '' + seconds;
    }
    this.displayTimer = `${hours}:${minutes}:${seconds}`
  }

  stop() {
    this.subs.unsubscribe();
    this.currentTime = 0;
    this.getDisplayTimer(0)
  }

  pause() {
    this.paused = true;
    this.startStop = 'Start';
  }

  reset() {
    if(this.paused) {
      this.startStop = 'Stop';
      this.paused = !this.paused
      this.currentTime = 0;
      this.getDisplayTimer(0)
      return
    }
    this.startStop = 'Stop';
    this.currentTime = 0;
    this.getDisplayTimer(0)
  }

  debounce() {
    this.clicked++;
    if (this.clicked === 2) {
      this.pause();
    }
  }
}
