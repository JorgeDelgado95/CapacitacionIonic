import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ItemsService } from '../services/items.service';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  formItem: FormGroup;
  id: string;
  image: string;

  constructor(
    private fb:FormBuilder, 
    private httpClient: HttpClient, 
    private router: Router, 
    private itemsService: ItemsService, 
    private route: ActivatedRoute, 
    private camera: Camera) {
    this.formItem = this.fb.group({
      title: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });

    this.route.queryParams.subscribe(params => {
      console.log('Query Params', params);
      if (params.id){
        this.id = params.id;
        this.itemsService.setIsLoading(true);
        this.itemsService.getSingleItem(params.id).subscribe(item => {          
          this.formItem.get('title').setValue(item.title);
          this.formItem.get('quantity').setValue(item.quantity);
          this.image = item.image;
          this.itemsService.setIsLoading(false);
        });
      }
    });
   }

   ngOnInit() {
  }

   save(){
    let item = new Item();
    item.title = this.formItem.get('title').value;
    item.quantity = this.formItem.get('quantity').value;

    if(this.image){
      item.image = this.image;
    }

    this.itemsService.setIsLoading(true);
    if (this.id){
      item._id = this.id;
      this.itemsService.updateItem(item).subscribe(res => {
        console.log('>>> Resultado Update', res);
        this.router.navigate(['list']);
        this.itemsService.setIsLoading(false);
      }, err => {
        alert('Ocurrio un error');
        this.itemsService.setIsLoading(false);
      });
    }else{
      this.itemsService.saveItem(item).subscribe(res => {
        console.log('>>> Resultado', res);
        this.router.navigate(['list']);
        this.itemsService.setIsLoading(false);
      }, err => {
        console.log(err);
        alert('ocurrio un error');
        this.itemsService.setIsLoading(false);
      });
     }
    }

    delete(){
      let item = new Item();
      if (this.id){
        this.itemsService.setIsLoading(true);
        item._id = this.id;
        this.itemsService.deleteItem(item).subscribe(res => {
          console.log('>>> Resultado Update', res);
          this.router.navigate(['list']);
        }, err => {
          alert('Ocurrio un error');
        });
    }
  }

  addPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBRQRMB8ZME7NAAABuklEQVRIx6XVv2vTQRzG8VfCN2nS1CgtGm3RwUVBXAQr2gqCW6VQoYM/BlEEl06K4KBL/wwHSyhYQRwK4qBCFSyipSgR4yClHRwUhFLQRpuUONgGKfGb5JtnOTg+9777PNxzR5uKbYw5mRZX/vRtE3DVuO1+twhIWXbHPS5aNCDe8tnjBi05z3tDutxwSRyBK65JghFjukIhZ7xjTY+7XvjsMm76YN44Rnzx0mQooMdaIKEsp6Aih16flPRirwWvDIQCyhJUZR3w2IQsdntk2j50mTTjSCggq/oXEFVZ1QDTKhEBAQEmlCIC0k613ULrF2iLGgNOO9Qe4JbD4QX1PYgZlUDMsv0SRmu53eJBfUDKlII0DvouplPBlFSzJvZ4qttJJfR7o2rVCRkzcs140GdOwZAVcNQc+OGsea/1NQasq+iozfd7W6vsULHejIndZjy3A0m/7ALbPDFrZ7MmJuUVdeq3ADKK8hvPTFMAGBYYMwUCw3VrGsY577owbcT5/3pmVkO1ncayRGRAQjmu6FhkwHEfuWDRQN2ohCtm0JJzgfs6PYzwtXVYcduDzZ33SLcIWPU1cuv/6g/ay3A3X3i0JAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0yMFQxNzo0ODozMSswMDowMI2go4AAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMjBUMTc6NDg6MzErMDA6MDD8/Rs8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==';
     console.log('DATA PHOTHO', base64Image);
    }, (err) => {
     alert('Ocurrio un error al tomar la foto');
    });
  }
}
