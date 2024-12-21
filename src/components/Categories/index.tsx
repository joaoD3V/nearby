import { FlatList } from 'react-native';
import { Category } from '../Category';
import { Category as CategoryProps } from '@/app/home';
import { s } from './styles';

type CategoriesProps = {
  data: CategoryProps[];
  selected: string;
  onSelect: (id: string) => void;
};

export function Categories({ data, selected, onSelect }: CategoriesProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Category
          iconId={item.id}
          name={item.name}
          onPress={() => onSelect(item.id)}
          isSelected={selected === item.id}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.content}
      style={s.container}
    />
  );
}
