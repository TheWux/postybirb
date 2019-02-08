import { Injectable } from '@angular/core';
import { Website } from '../../decorators/website-decorator';
import { WebsiteService, WebsiteStatus, LoginStatus } from '../../interfaces/website-service.interface';
import { WeasylSubmissionForm } from './components/weasyl-submission-form/weasyl-submission-form.component';
import { Submission } from 'src/app/database/models/submission.model';
import { getTags } from '../../helpers/website-validator.helper';

function validate(submission: Submission, formData: any): string[] {
  const problems: string[] = [];
  const tags = getTags(submission, Weasyl.name);
  if (tags.length < 2) problems.push('Weasyl is incomplete');
  return problems;
}

@Injectable({
  providedIn: 'root'
})
@Website({
  login: {
    url: 'https://www.weasyl.com/signin'
  },
  components: {
    submissionForm: WeasylSubmissionForm
  },
  validator: validate
})
export class Weasyl implements WebsiteService {
  readonly BASE_URL: string = 'https://www.weasyl.com';

  constructor() { }

  public async checkStatus(profileId: string): Promise<WebsiteStatus> {
    const returnValue: WebsiteStatus = {
      username: null,
      status: LoginStatus.LOGGED_OUT
    };

    const cookies = await getCookies(profileId, this.BASE_URL);
    const response = await got.get(`${this.BASE_URL}/api/whoami`, this.BASE_URL, cookies);
    try {
      const body = JSON.parse(response.body);
      if (body.login) {
        returnValue.status = LoginStatus.LOGGED_IN;
        returnValue.username = body.login;
      }
    } catch (e) { /* No important error handling */ }

    return returnValue;
  }
}
