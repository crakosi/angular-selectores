import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall} from '../../interfaces/paisSamall.interface';
import { switchMap, tap } from 'rxjs';
import { Pais } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required  ],
    pais: ['', Validators.required],
    frontera:['', Validators.required]
  });
  regiones: string [] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];
  cargando: Boolean = false;

  constructor( private fb: FormBuilder, private paisesService: PaisesServiceService){ }

  ngOnInit(): void {
   this.regiones = this.paisesService.regiones;

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( () => {
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;

    }),
      switchMap( region => this.paisesService.getPaisesByRegion( region ) )
    )
    .subscribe(
      paises => {
        this.paises = paises;
        this.cargando = false;
      }
    )

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap( codigo =>  this.paisesService.getPaisByCode( codigo ) ),
      switchMap( pais => this.paisesService.getPaisesByCodes( pais[0]?.borders ) )
    )
    .subscribe(
      paises => {
        console.log(paises);
        if ( paises.length > 0 ){
          this.fronteras = paises;
          this.cargando = false;
        }
       }
    )
  }

  onSubmit(){
    console.log(this.miFormulario.value);

  }



}
