import { Component, OnInit, Injector, forwardRef } from '@angular/core';
import { Folder } from 'src/app/websites/interfaces/folder.interface';
import { FormControl } from '@angular/forms';
import { BaseWebsiteSubmissionForm } from 'src/app/websites/components/base-website-submission-form/base-website-submission-form.component';

@Component({
  selector: 'deviant-art-submission-form',
  templateUrl: './deviant-art-submission-form.component.html',
  styleUrls: ['./deviant-art-submission-form.component.css'],
  providers: [{ provide: BaseWebsiteSubmissionForm, useExisting: forwardRef(() => DeviantArtSubmissionForm) }],
  host: {
    'class': 'submission-form'
  }
})
export class DeviantArtSubmissionForm extends BaseWebsiteSubmissionForm implements OnInit {

  public optionDefaults: any = {
    feature: [false],
    disableComments: [false],
    critique: [false],
    freeDownload: [false],
    folders: [[]],
    category: [],
    matureClassification: [[]],
    matureLevel: ['']
  };

  public folders: Folder[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.folders = this.websiteService.getFolders(this.parentForm.getLoginProfileId()) || [];
    if (!this.formGroup.get('tags')) this.formGroup.addControl('tags', new FormControl(null));
    if (!this.formGroup.get('description')) this.formGroup.addControl('description', new FormControl(null));
    if (!this.formGroup.get('options')) this.formGroup.addControl('options', this.formBuilder.group(this.optionDefaults));
  }
}