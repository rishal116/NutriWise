export interface ILiveKitService {
  generateParticipantToken(input: {
    identity: string;
    roomId: string;
    canPublish: boolean;
    canSubscribe: boolean;
  }): Promise<string>;
}
