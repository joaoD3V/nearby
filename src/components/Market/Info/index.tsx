import { IconProps } from '@tabler/icons-react-native';
import { ComponentType } from 'react';
import { s } from './styles';
import { colors } from '@/styles/theme';
import { Text, View } from 'react-native';

type InfoProps = {
  icon: ComponentType<IconProps>;
  description: string;
};

export function Info({ icon: Icon, description }: InfoProps) {
  return (
    <View style={s.container}>
      <Icon size={16} color={colors.gray[400]} />
      <Text style={s.text}>{description}</Text>
    </View>
  );
}
