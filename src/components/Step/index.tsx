import { Text, View } from 'react-native';
import { s } from './styles';
import { IconProps } from '@tabler/icons-react-native';
import { ComponentType } from 'react';
import { colors } from '@/styles/theme';

type StepProps = {
  icon: ComponentType<IconProps>;
  title: string;
  description: string;
};

export function Step({ icon: Icon, title, description }: StepProps) {
  return (
    <View style={s.container}>
      {Icon && <Icon size={32} color={colors.red.base} />}

      <View style={s.details}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.description}>{description}</Text>
      </View>
    </View>
  );
}
