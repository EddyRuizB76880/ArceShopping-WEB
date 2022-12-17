import { Component, OnInit } from '@angular/core';
import { CapacitorService } from 'src/app/services/capacitor.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  constructor(private capacitorService: CapacitorService) { }

  ngOnInit(): void {
    const capacitorGoogleMap: HTMLElement = document.getElementById('google-map') as HTMLElement;
    this.capacitorService.setGoogleMapReference(capacitorGoogleMap);
  }

}
