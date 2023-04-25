import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImg from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/infoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimerElapsed';



const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCout] = useState<number>(0);
  const [gridItem, setGridItem] = useState<GridItemType[]>([]);

  useEffect(() => {

    resetAndCreateGrid()

  }, []);

  useEffect(() => {

    const timer = setInterval(() => {
      if (playing) {
        setTimeElapsed(timeElapsed + 1)
      }
    }, 1000);

    return () => clearInterval(timer);

  }, [playing, timeElapsed]);

  // Verificar if opened are equal
  useEffect(() => {
    if (showCount === 2) {
      let opened = gridItem.filter(item => item.shown === true);

      if (opened.length === 2) {

        if (opened[0].item === opened[1].item) {

          // v1 - se eles forem iguais, faça todos que tem o shown permanente
          let tmpGrid = [...gridItem];
          for (let i in tmpGrid) {

            if (tmpGrid[i].shown) {
              tmpGrid[i].parmanentShown = true;
              tmpGrid[i].shown = false;
            }
          }

          setGridItem(tmpGrid);
          setShowCout(0);
        } else {

          // V2 - se todos nao são iguais, feche todos os shown
          setTimeout(() => {
            let tmpGrid = [...gridItem];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;

            }
            setGridItem(tmpGrid);
            setShowCout(0);
          }, 1000);
        }



        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [showCount, gridItem]);

  // Verificar se o jogo acabou.
  useEffect(() => {
    if (moveCount > 0 && gridItem.every(item => item.parmanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItem]);

  const resetAndCreateGrid = () => {

    // passo 1 - resetar o jogo

    setTimeElapsed(0);
    setMoveCount(0);
    setShowCout(0);

    // passo 2 - criar o grid
    //2.1 - criar o grid vazio

    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) tmpGrid.push({
      item: null, shown: false, parmanentShown: false
    });

    //2.2 - preencher o grid

    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    //2.3 - jogar no state

    setGridItem(tmpGrid);

    // passo3 - começar o jogo

    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if (playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItem];

      if (tmpGrid[index].parmanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShowCout(showCount + 1);
      }

      setGridItem(tmpGrid);
    }
  }

  return (
    <C.Container>

      <C.Info>

        <C.LogoLink href="">
          <img src={logoImg} width="200" alt='' />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />

      </C.Info>

      <C.GridArea>

        <C.Grid>

          {gridItem.map((item, index) => (

            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}

            />

          ))}

        </C.Grid>

      </C.GridArea>

    </C.Container>
  );
}

export default App;