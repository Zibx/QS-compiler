def Page main
  Button next: Далее
    .click: (e)->{
        fr.takeSnapshot();
        return false;
      }
  VBox
    flexDefinition: '70 330 300'

    Header: 'Камера'
        size: medium

    HBox
      height: 650px
      FaceRecognition fr