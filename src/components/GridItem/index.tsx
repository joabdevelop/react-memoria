import { GridItemType } from '../../types/GridItemType';
import * as C from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
    item: GridItemType,
    onClick: () => void
}

export const GridItem = ({ item, onClick }: Props) => {
    return (
        <C.Container
            onClick={onClick}
            showBackgroud={item.parmanentShown || item.shown}
        >
            {item.parmanentShown === false && item.shown === false &&
                <C.Icon src={b7Svg} alt="" opacity={.5} />
            }
            {(item.parmanentShown || item.shown) && item.item !== null &&
                <C.Icon src={items[item.item].icon} alt="" />
            }
        </C.Container>
    );
}