def UIComponent T
  public String name
  Label: {{name}}
def Page main
  ContainerComponent c1
    itemTemplate: T
    itemSource: [{name: 123}]