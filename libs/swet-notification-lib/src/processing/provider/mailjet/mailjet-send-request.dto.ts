export class MailjetSendRequest {
  Messages: Array<{
    From: { Email: string; Name: string };
    To: Array<{ Email: string }>;
    Subject: string;
    HTMLPart: string;
  }>;
  SandboxMode?: boolean;
}

export class MailjetSendResponse {
  Messages: Array<{
    Status: string;
    To?: Array<{ Email: string; MessageID: number }>;
  }>;
}
