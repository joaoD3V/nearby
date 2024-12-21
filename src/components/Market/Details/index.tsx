import { Details as DetailsItem } from '@/app/market/[id]';
import { Text, View } from 'react-native';
import { s } from './styles';
import { Info } from '../Info';
import { IconMapPin, IconPhone, IconTicket } from '@tabler/icons-react-native';

type DetailsProps = {
  details: DetailsItem;
};

export function Details({ details }: DetailsProps) {
  return (
    <View style={s.container}>
      <Text style={s.name}>{details.name}</Text>
      <Text style={s.description}>{details.description}</Text>

      <View style={s.group}>
        <Text style={s.title}>Informações</Text>
        <Info
          icon={IconTicket}
          description={`${details.coupons} cupons disponíveis`}
        />
        <Info icon={IconMapPin} description={details.address} />
        <Info icon={IconPhone} description={details.phone} />
      </View>

      <View style={s.group}>
        <Text style={s.title}>Regulamento</Text>
        {details.rules.map((item) => (
          <Text key={item.id} style={s.rule}>
            {`\u2022 ${item.description}`}
          </Text>
        ))}
      </View>
    </View>
  );
}
