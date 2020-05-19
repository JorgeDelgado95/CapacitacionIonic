import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ItemsService } from '../services/items.service';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  formItem: FormGroup;
  id: string;
  validate: boolean;

  constructor(private fb:FormBuilder, private httpClient: HttpClient, private router: Router, private itemsService: ItemsService, private route: ActivatedRoute) {
    this.formItem = this.fb.group({
      title: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
    this.validate = true;
    this.route.queryParams.subscribe(params => {
      console.log('Query Params', params);
      if (params.id){
        this.id = params.id;
        this.itemsService.getSingleItem(params.id).subscribe(item => {
          this.formItem.get('title').setValue(item.title);
          this.formItem.get('quantity').setValue(item.quantity);
        });
      }
    });
   }

   ionViewWillEnter(){
    if (this.id){
      this.validate = false;
    }
   }

   ngOnInit() {
  }

   save(){
    let item = new Item();
    item.title = this.formItem.get('title').value;
    item.quantity = this.formItem.get('quantity').value;

    if (this.id){
      item._id = this.id;
      this.itemsService.updateItem(item).subscribe(res => {
        console.log('>>> Resultado Update', res);
        this.router.navigate(['list']);
      }, err => {
        alert('Ocurrio un error');
      });
    }else{
      this.itemsService.saveItem(item).subscribe(res => {
        console.log('>>> Resultado', res);
        this.router.navigate(['list']);
      }, err => {
        console.log(err);
        alert('ocurrio un error');
      });
     }
    }

    delete(){
      let item = new Item();
      if (this.id){
        item._id = this.id;
        this.itemsService.deleteItem(item).subscribe(res => {
          console.log('>>> Resultado Update', res);
          this.router.navigate(['list']);
        }, err => {
          alert('Ocurrio un error');
        });
    }
  }
}
