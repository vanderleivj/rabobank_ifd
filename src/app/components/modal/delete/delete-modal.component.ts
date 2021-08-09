import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: []
})
export class DeleteModalComponent implements OnInit {

  confirmResult: Subject<boolean> = new Subject();

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() { }

  onConfirm() {
    this.confirmAndClose(true);
  }

  onClose() {
    this.confirmAndClose(false);
  }

  private confirmAndClose(value: boolean) {
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
