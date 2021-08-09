import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DeleteModalComponent } from 'src/app/components/modal/delete/delete-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {
  constructor(private modalService: BsModalService) {}

  showDelete() {
    const bsModalRef: BsModalRef = this.modalService.show(DeleteModalComponent);
    return bsModalRef.content.confirmResult;
  }
}
