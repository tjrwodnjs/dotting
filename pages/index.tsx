import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useContext, useRef, useState } from "react";
import { DimensionsInput } from "../components/Editor/PanelControl/DimensionsInput";
import { Editor } from "../components/Editor";
import { PanelUpperButtons } from "../components/Editor/PanelControl/PanelUpperButtons";
import {
  colorGroup,
  dataArrayElement,
  PanelKeys,
  rowColumnColor,
} from "../const/CommonDTO";
import { downloadImageRef } from "../const/CommonFunctions";
import { ColorContext } from "../context/ColorContext";
import { DataContext } from "../context/DataContext";
import { MouseDragContext } from "../context/MouseDragContext";
import styles from "../styles/Home.module.css";
import { PanelBelowButtons } from "../components/Editor/PanelControl/PanelBelowButtons";
import { Panel } from "../components/Editor/Panel";
import { Toolbar } from "../components/Editor/Toolbar";
import { Canvas } from "../components/Editor/Canvas";
import { ColorPicker } from "../components/Editor/Toolbar/ColorPicker";
import { ColorGroups } from "../components/Editor/Toolbar/ColorGroups";
import { ColorWindow } from "../components/Editor/ColorWindow";
import * as mouseDragActions from "../store/modules/mouseEvent";
import useMouseEvent from "../store/modules/mouseEventHook";

const Home: NextPage = () => {
  const defaultHeight: number = 32;
  const defaultWidth: number = 32;
  const { isLeftClicked, mouseDown, mouseUp } = useMouseEvent();
  const [hideOptions, setHideOptions] = useState<boolean>(false);
  const [hideDrawingPanel, setHideDrawingPanel] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<colorGroup>();
  const [buttonText, setButonText] = useState<"start drawing" | "reset">(
    "start drawing"
  );
  const [openChangePanel, setOpenChangePanel] = useState<boolean>(false);
  const [openChangePanelKey, setOpenChangePanelKey] = useState<string>("");
  const panelRef = useRef<any>(null);

  const { color, changeColor } = useContext(ColorContext);

  const { dataArray, setDataArray, setHistory, setHistoryIndex } =
    useContext(DataContext);

  const [keyData, setKeyData] = useState<PanelKeys>({
    L_key: 0,
    R_key: defaultWidth - 1,
    T_key: 0,
    B_key: defaultWidth - 1,
  });

  const [resetKeys, setResetKeys] = useState<PanelKeys>({
    L_key: 0,
    R_key: defaultWidth - 1,
    T_key: 0,
    B_key: defaultWidth - 1,
  });

  const [currentKeys, setCurrentKeys] = useState<PanelKeys>({
    L_key: 0,
    R_key: defaultWidth - 1,
    T_key: 0,
    B_key: defaultWidth - 1,
  });

  const [colorArray, setColorArray] = useState<dataArrayElement[]>([]);

  const [colorData, setColorData] = useState<rowColumnColor[]>([]);

  const initializeDrawingPanel = useCallback(() => {
    setHideOptions(!hideOptions);
    setHideDrawingPanel(!hideDrawingPanel);

    buttonText === "start drawing"
      ? setButonText("reset")
      : setButonText("start drawing");
  }, [hideOptions, hideDrawingPanel]);

  const resetOrStartPanel = useCallback(() => {
    initializeDrawingPanel();
    setDataArray([]);
    setHistory([]);
    setHistoryIndex(0);
  }, []);

  const downloadImage = useCallback(() => {
    const pixelRef = document.getElementById("pixels");
    downloadImageRef(pixelRef);
  }, []);

  const saveProject = useCallback(() => {
    setKeyData(JSON.parse(JSON.stringify(currentKeys)));
    setColorData(JSON.parse(JSON.stringify(dataArray)));
  }, [currentKeys, dataArray]);

  const resetDataKeyState = useCallback(
    (colorDataArray: rowColumnColor[], keyDataArray: PanelKeys) => {
      setColorArray(JSON.parse(JSON.stringify(colorDataArray)));
      setResetKeys(JSON.parse(JSON.stringify(keyDataArray)));
    },
    []
  );

  const bringSavedProject = () => {
    resetDataKeyState(colorData, keyData);
  };
  return (
    <Editor>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {openChangePanel && (
        <ColorWindow
          selectedGroup={selectedGroup}
          setOpenChangePanel={setOpenChangePanel}
          initialColor={color}
        />
      )}
      <Canvas
        // onMouseDown={enableMouseDragDraw}
        // onMouseUp={disableMouseDragDraw}
        // onMouseLeave={disableMouseDragDraw}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseLeave={() => {}}
      >
        <h1>Pixel Create Character</h1>
        {hideDrawingPanel && (
          <DimensionsInput
            defaultHeight={defaultHeight}
            defaultWidth={defaultWidth}
            resetKeys={resetKeys}
            setResetKeys={setResetKeys}
          />
        )}
        <PanelUpperButtons
          buttonText={buttonText}
          clickFunctions={[resetOrStartPanel]}
        />
        {hideOptions && (
          <Panel
            panelRef={panelRef}
            resetKeys={resetKeys}
            currentKeys={currentKeys}
            setCurrentKeys={setCurrentKeys}
            colorArray={colorArray}
            setResetKeys={setResetKeys}
            setColorArray={setColorArray}
          />
        )}
        <PanelBelowButtons
          clickFunctions={[downloadImage, saveProject, bringSavedProject]}
          hideDrawingPanel={hideDrawingPanel}
        />
      </Canvas>
      <Toolbar>
        <ColorPicker
          brushColor={color}
          color={color}
          changeColor={changeColor}
        />
        <ColorGroups
          dataArray={dataArray}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          openChangePanel={openChangePanel}
          setOpenChangePanel={setOpenChangePanel}
          setOpenChangePanelKey={setOpenChangePanelKey}
          changeColor={changeColor}
        />
      </Toolbar>
    </Editor>
  );
};

export default Home;
