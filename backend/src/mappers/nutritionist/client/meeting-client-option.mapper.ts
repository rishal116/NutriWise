import { MeetingClientOptionDTO } from "../../../dtos/nutritionist/client/client-response.dto";
import { IMeetingClientOption } from "../../../types/nutriClientDetails.projection";

export class MeetingClientOptionMapper {
  static toDTO(client: IMeetingClientOption): MeetingClientOptionDTO {
    return {
      id: client.clientId.toString(),
      fullName: client.fullName,
      email: client.email,
      ...(client.profileImage && {
        profileImage: client.profileImage,
      }),
    };
  }

  static toDTOList(clients: IMeetingClientOption[]): MeetingClientOptionDTO[] {
    return clients.map((client) => this.toDTO(client));
  }
}
