import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Item } from '../models/item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  items: Item[] = [];
  constructor(private itemsService: ItemsService, private router: Router) {
    // this.items = this.itemsService.items;
   }

   ionViewWillEnter(){
    this.itemsService.setIsLoading(true);
    this.itemsService.getItems().subscribe(res => {
      console.log('>>>Res ', res);
      this.items = res;
      this.itemsService.setIsLoading(false);
    }, err => {
      alert(err);
      this.itemsService.setIsLoading(false);
    });
   }

  ngOnInit() {
  }

  new(){
    this.router.navigate(['products']);
  }

  edit(item: Item){
    this.router.navigateByUrl('/products?id=' + item._id);
  }

}
